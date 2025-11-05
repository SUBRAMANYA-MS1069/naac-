const purchaseOrderService = require('../../services/expenditure/purchaseOrderService');
const { successResponse, errorResponse, paginatedResponse } = require('../../utils/helpers/responseHelper');
const { getPagination } = require('../../utils/helpers/paginationHelper');

/**
 * Create a new purchase order
 * @route POST /api/v1/finance/expenditure/purchase-orders
 * @access Private (Finance Manager)
 */
const createPurchaseOrder = async (req, res, next) => {
  try {
    const purchaseOrder = await purchaseOrderService.createPurchaseOrder(req.body, req.tenantId, req.user.userId);
    res.status(201).json(successResponse(purchaseOrder, 'Purchase order created successfully', 201));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all purchase orders
 * @route GET /api/v1/finance/expenditure/purchase-orders
 * @access Private (Finance Manager, Accountant)
 */
const getPurchaseOrders = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const filters = {
      vendorId: req.query.vendorId,
      status: req.query.status,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    
    const result = await purchaseOrderService.getPurchaseOrders(filters, pagination, req.tenantId);
    
    res.json(paginatedResponse(
      result.purchaseOrders,
      result.page,
      result.limit,
      result.total,
      'Purchase orders retrieved successfully'
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * Get purchase order by ID
 * @route GET /api/v1/finance/expenditure/purchase-orders/:poId
 * @access Private (Finance Manager, Accountant)
 */
const getPurchaseOrderById = async (req, res, next) => {
  try {
    const purchaseOrder = await purchaseOrderService.getPurchaseOrderById(req.params.poId, req.tenantId);
    res.json(successResponse(purchaseOrder, 'Purchase order retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Update purchase order
 * @route PUT /api/v1/finance/expenditure/purchase-orders/:poId
 * @access Private (Finance Manager)
 */
const updatePurchaseOrder = async (req, res, next) => {
  try {
    const purchaseOrder = await purchaseOrderService.updatePurchaseOrder(req.params.poId, req.body, req.tenantId);
    res.json(successResponse(purchaseOrder, 'Purchase order updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Approve purchase order
 * @route POST /api/v1/finance/expenditure/purchase-orders/:poId/approve
 * @access Private (Finance Manager, Admin)
 */
const approvePurchaseOrder = async (req, res, next) => {
  try {
    const purchaseOrder = await purchaseOrderService.approvePurchaseOrder(
      req.params.poId,
      req.body.approverId,
      req.body.comments,
      req.tenantId
    );
    res.json(successResponse(purchaseOrder, 'Purchase order approved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Close purchase order
 * @route POST /api/v1/finance/expenditure/purchase-orders/:poId/close
 * @access Private (Finance Manager)
 */
const closePurchaseOrder = async (req, res, next) => {
  try {
    const purchaseOrder = await purchaseOrderService.closePurchaseOrder(
      req.params.poId,
      req.body.closedBy,
      req.body.closedDate,
      req.body.closureReason,
      req.tenantId
    );
    res.json(successResponse(purchaseOrder, 'Purchase order closed successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrder,
  approvePurchaseOrder,
  closePurchaseOrder
};