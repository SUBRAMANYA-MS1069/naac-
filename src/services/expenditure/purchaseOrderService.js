const PurchaseOrder = require('../../models/expenditure/PurchaseOrder');
const Vendor = require('../../models/expenditure/Vendor');
const { AppError } = require('../../utils/helpers/errorHelper');

/**
 * Create a new purchase order
 * @param {Object} poData - Purchase order data
 * @param {String} tenantId - Tenant ID
 * @param {String} userId - User ID
 * @returns {Object} Created purchase order
 */
const createPurchaseOrder = async (poData, tenantId, userId) => {
  try {
    // Add tenantId and preparedBy to PO data
    poData.tenantId = tenantId;
    poData.preparedBy = userId;
    
    // Check if vendor exists and is active
    const vendor = await Vendor.findOne({ 
      vendorId: poData.vendorId, 
      tenantId,
      isActive: true 
    });
    
    if (!vendor) {
      throw new AppError('Vendor not found or inactive', 404, 'VENDOR_NOT_FOUND');
    }
    
    // Calculate totals
    let subtotal = 0;
    let taxTotal = 0;
    
    for (const item of poData.items) {
      const itemTotal = item.quantity * item.unitPrice;
      const itemTax = itemTotal * (item.taxRate / 100);
      
      item.totalAmount = itemTotal + itemTax;
      subtotal += itemTotal;
      taxTotal += itemTax;
    }
    
    poData.subtotal = subtotal;
    poData.taxTotal = taxTotal;
    poData.totalAmount = subtotal + taxTotal + (poData.shippingCharges || 0);
    
    // Create purchase order
    const purchaseOrder = new PurchaseOrder(poData);
    await purchaseOrder.save();
    
    return purchaseOrder;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('Purchase order with this number already exists', 409, 'DUPLICATE_PO');
    }
    throw error;
  }
};

/**
 * Get purchase orders with filters
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination options
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Purchase orders and pagination info
 */
const getPurchaseOrders = async (filters, pagination, tenantId) => {
  try {
    const query = { tenantId, ...filters };
    
    // Handle vendor filter
    if (filters.vendorId) {
      query.vendorId = filters.vendorId;
    }
    
    // Handle status filter
    if (filters.status) {
      query.status = filters.status;
    }
    
    // Handle date range filter
    if (filters.startDate || filters.endDate) {
      query.poDate = {};
      if (filters.startDate) {
        query.poDate.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.poDate.$lte = new Date(filters.endDate);
      }
    }
    
    const purchaseOrders = await PurchaseOrder.find(query)
      .sort(pagination.sort || '-poDate')
      .skip(pagination.skip)
      .limit(pagination.limit)
      .populate('vendorId', 'vendorName vendorCode')
      .populate('preparedBy', 'name email');
    
    const total = await PurchaseOrder.countDocuments(query);
    
    return {
      purchaseOrders,
      total,
      page: pagination.page,
      limit: pagination.limit
    };
  } catch (error) {
    throw new AppError('Failed to fetch purchase orders', 500, 'FETCH_POS_ERROR');
  }
};

/**
 * Get purchase order by ID
 * @param {String} poId - Purchase order ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Purchase order
 */
const getPurchaseOrderById = async (poId, tenantId) => {
  try {
    const purchaseOrder = await PurchaseOrder.findOne({ poId, tenantId })
      .populate('vendorId', 'vendorName vendorCode contactPerson address')
      .populate('preparedBy', 'name email')
      .populate('approvers.userId', 'name email');
    
    if (!purchaseOrder) {
      throw new AppError('Purchase order not found', 404, 'PO_NOT_FOUND');
    }
    
    return purchaseOrder;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid purchase order ID', 400, 'INVALID_PO_ID');
    }
    throw error;
  }
};

/**
 * Update purchase order
 * @param {String} poId - Purchase order ID
 * @param {Object} updateData - Update data
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Updated purchase order
 */
const updatePurchaseOrder = async (poId, updateData, tenantId) => {
  try {
    // Prevent updating closed or cancelled POs
    const existingPO = await PurchaseOrder.findOne({ poId, tenantId });
    
    if (!existingPO) {
      throw new AppError('Purchase order not found', 404, 'PO_NOT_FOUND');
    }
    
    if (['Closed', 'Cancelled'].includes(existingPO.status)) {
      throw new AppError('Cannot update closed or cancelled purchase order', 400, 'CANNOT_UPDATE_CLOSED_PO');
    }
    
    // Recalculate totals if items are updated
    if (updateData.items) {
      let subtotal = 0;
      let taxTotal = 0;
      
      for (const item of updateData.items) {
        const itemTotal = item.quantity * item.unitPrice;
        const itemTax = itemTotal * (item.taxRate / 100);
        
        item.totalAmount = itemTotal + itemTax;
        subtotal += itemTotal;
        taxTotal += itemTax;
      }
      
      updateData.subtotal = subtotal;
      updateData.taxTotal = taxTotal;
      updateData.totalAmount = subtotal + taxTotal + (updateData.shippingCharges || 0);
    }
    
    const purchaseOrder = await PurchaseOrder.findOneAndUpdate(
      { poId, tenantId },
      updateData,
      { new: true, runValidators: true }
    );
    
    return purchaseOrder;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid purchase order ID', 400, 'INVALID_PO_ID');
    }
    throw error;
  }
};

/**
 * Approve purchase order
 * @param {String} poId - Purchase order ID
 * @param {String} tenantId - Tenant ID
 * @param {String} userId - User ID
 * @param {String} comments - Approval comments
 * @returns {Object} Approved purchase order
 */
const approvePurchaseOrder = async (poId, tenantId, userId, comments) => {
  try {
    const purchaseOrder = await PurchaseOrder.findOne({ poId, tenantId });
    
    if (!purchaseOrder) {
      throw new AppError('Purchase order not found', 404, 'PO_NOT_FOUND');
    }
    
    if (purchaseOrder.status !== 'PendingApproval') {
      throw new AppError('Purchase order is not in pending approval status', 400, 'INVALID_PO_STATUS');
    }
    
    // Add approver to the list
    purchaseOrder.approvers.push({
      userId,
      approved: true,
      approvedDate: new Date(),
      comments
    });
    
    // Check if all required approvals are done
    // In a real implementation, you would check against approval workflow
    purchaseOrder.status = 'Approved';
    
    await purchaseOrder.save();
    
    return purchaseOrder;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid purchase order ID', 400, 'INVALID_PO_ID');
    }
    throw error;
  }
};

/**
 * Close purchase order
 * @param {String} poId - Purchase order ID
 * @param {String} tenantId - Tenant ID
 * @param {String} userId - User ID
 * @param {String} reason - Closure reason
 * @returns {Object} Closed purchase order
 */
const closePurchaseOrder = async (poId, tenantId, userId, reason) => {
  try {
    const purchaseOrder = await PurchaseOrder.findOne({ poId, tenantId });
    
    if (!purchaseOrder) {
      throw new AppError('Purchase order not found', 404, 'PO_NOT_FOUND');
    }
    
    if (purchaseOrder.status === 'Closed') {
      throw new AppError('Purchase order is already closed', 400, 'PO_ALREADY_CLOSED');
    }
    
    purchaseOrder.status = 'Closed';
    purchaseOrder.closedDate = new Date();
    purchaseOrder.closedBy = userId;
    purchaseOrder.closureReason = reason;
    
    await purchaseOrder.save();
    
    return purchaseOrder;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid purchase order ID', 400, 'INVALID_PO_ID');
    }
    throw error;
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