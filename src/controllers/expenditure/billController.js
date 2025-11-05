const billService = require('../../services/expenditure/billService');
const paymentService = require('../../services/expenditure/paymentService');
const { successResponse, errorResponse, paginatedResponse } = require('../../utils/helpers/responseHelper');
const { getPagination } = require('../../utils/helpers/paginationHelper');

/**
 * Create a new bill
 * @route POST /api/v1/finance/expenditure/bills
 * @access Private (Finance Manager)
 */
const createBill = async (req, res, next) => {
  try {
    const bill = await billService.createBill(req.body, req.tenantId, req.user.userId);
    res.status(201).json(successResponse(bill, 'Bill created successfully', 201));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all bills
 * @route GET /api/v1/finance/expenditure/bills
 * @access Private (Finance Manager, Accountant)
 */
const getBills = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const filters = {
      vendorId: req.query.vendorId,
      status: req.query.status,
      billType: req.query.billType,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    
    const result = await billService.getBills(filters, pagination, req.tenantId);
    
    res.json(paginatedResponse(
      result.bills,
      result.page,
      result.limit,
      result.total,
      'Bills retrieved successfully'
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * Get bill by ID
 * @route GET /api/v1/finance/expenditure/bills/:billId
 * @access Private (Finance Manager, Accountant)
 */
const getBillById = async (req, res, next) => {
  try {
    const bill = await billService.getBillById(req.params.billId, req.tenantId);
    res.json(successResponse(bill, 'Bill retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Update bill
 * @route PUT /api/v1/finance/expenditure/bills/:billId
 * @access Private (Finance Manager)
 */
const updateBill = async (req, res, next) => {
  try {
    const bill = await billService.updateBill(req.params.billId, req.body, req.tenantId);
    res.json(successResponse(bill, 'Bill updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Approve bill
 * @route POST /api/v1/finance/expenditure/bills/:billId/approve
 * @access Private (Finance Manager)
 */
const approveBill = async (req, res, next) => {
  try {
    const bill = await billService.approveBill(
      req.params.billId,
      req.body.approvedBy,
      req.tenantId
    );
    res.json(successResponse(bill, 'Bill approved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Record bill payment
 * @route POST /api/v1/finance/expenditure/bills/:billId/pay
 * @access Private (Finance Manager)
 */
const recordBillPayment = async (req, res, next) => {
  try {
    // First create the payment record
    const payment = await paymentService.createPayment({
      ...req.body,
      bills: [{
        billId: req.params.billId,
        billAmount: req.body.billAmount,
        paidAmount: req.body.paidAmount
      }]
    }, req.tenantId, req.user.userId);
    
    // Then update the bill status
    const bill = await billService.recordPayment(
      req.params.billId,
      req.body.paidAmount,
      req.tenantId
    );
    
    res.status(201).json(successResponse({
      payment,
      bill
    }, 'Bill payment recorded successfully', 201));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBill,
  getBills,
  getBillById,
  updateBill,
  approveBill,
  recordBillPayment
};