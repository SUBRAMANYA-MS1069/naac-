const Bill = require('../../models/expenditure/Bill');
const Vendor = require('../../models/expenditure/Vendor');
const PurchaseOrder = require('../../models/expenditure/PurchaseOrder');
const { AppError } = require('../../utils/helpers/errorHelper');

/**
 * Create a new bill
 * @param {Object} billData - Bill data
 * @param {String} tenantId - Tenant ID
 * @param {String} userId - User ID
 * @returns {Object} Created bill
 */
const createBill = async (billData, tenantId, userId) => {
  try {
    // Add tenantId to bill data
    billData.tenantId = tenantId;
    
    // Check if vendor exists and is active
    const vendor = await Vendor.findOne({ 
      vendorId: billData.vendorId, 
      tenantId,
      isActive: true 
    });
    
    if (!vendor) {
      throw new AppError('Vendor not found or inactive', 404, 'VENDOR_NOT_FOUND');
    }
    
    // Check if PO exists (if provided)
    if (billData.purchaseOrderId) {
      const po = await PurchaseOrder.findOne({ 
        poId: billData.purchaseOrderId, 
        tenantId 
      });
      
      if (!po) {
        throw new AppError('Purchase order not found', 404, 'PO_NOT_FOUND');
      }
    }
    
    // Calculate totals
    let subtotal = 0;
    let taxTotal = 0;
    
    for (const item of billData.lineItems) {
      const itemTotal = item.quantity * item.unitPrice;
      const itemTax = itemTotal * (item.taxRate / 100);
      
      item.totalAmount = itemTotal + itemTax;
      subtotal += itemTotal;
      taxTotal += itemTax;
    }
    
    billData.subtotal = subtotal;
    billData.taxTotal = taxTotal;
    billData.totalAmount = subtotal + taxTotal + (billData.otherCharges || 0);
    billData.balanceAmount = billData.totalAmount;
    
    // Create bill
    const bill = new Bill(billData);
    await bill.save();
    
    return bill;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('Bill with this number already exists', 409, 'DUPLICATE_BILL');
    }
    throw error;
  }
};

/**
 * Get bills with filters
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination options
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Bills and pagination info
 */
const getBills = async (filters, pagination, tenantId) => {
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
    
    // Handle bill type filter
    if (filters.billType) {
      query.billType = filters.billType;
    }
    
    // Handle date range filter
    if (filters.startDate || filters.endDate) {
      query.billDate = {};
      if (filters.startDate) {
        query.billDate.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.billDate.$lte = new Date(filters.endDate);
      }
    }
    
    const bills = await Bill.find(query)
      .sort(pagination.sort || '-billDate')
      .skip(pagination.skip)
      .limit(pagination.limit)
      .populate('vendorId', 'vendorName vendorCode')
      .populate('purchaseOrderId', 'poNumber');
    
    const total = await Bill.countDocuments(query);
    
    return {
      bills,
      total,
      page: pagination.page,
      limit: pagination.limit
    };
  } catch (error) {
    throw new AppError('Failed to fetch bills', 500, 'FETCH_BILLS_ERROR');
  }
};

/**
 * Get bill by ID
 * @param {String} billId - Bill ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Bill
 */
const getBillById = async (billId, tenantId) => {
  try {
    const bill = await Bill.findOne({ billId, tenantId })
      .populate('vendorId', 'vendorName vendorCode contactPerson address')
      .populate('purchaseOrderId', 'poNumber poDate');
    
    if (!bill) {
      throw new AppError('Bill not found', 404, 'BILL_NOT_FOUND');
    }
    
    return bill;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid bill ID', 400, 'INVALID_BILL_ID');
    }
    throw error;
  }
};

/**
 * Update bill
 * @param {String} billId - Bill ID
 * @param {Object} updateData - Update data
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Updated bill
 */
const updateBill = async (billId, updateData, tenantId) => {
  try {
    // Prevent updating paid bills
    const existingBill = await Bill.findOne({ billId, tenantId });
    
    if (!existingBill) {
      throw new AppError('Bill not found', 404, 'BILL_NOT_FOUND');
    }
    
    if (existingBill.status === 'Paid') {
      throw new AppError('Cannot update paid bill', 400, 'CANNOT_UPDATE_PAID_BILL');
    }
    
    // Recalculate totals if line items are updated
    if (updateData.lineItems) {
      let subtotal = 0;
      let taxTotal = 0;
      
      for (const item of updateData.lineItems) {
        const itemTotal = item.quantity * item.unitPrice;
        const itemTax = itemTotal * (item.taxRate / 100);
        
        item.totalAmount = itemTotal + itemTax;
        subtotal += itemTotal;
        taxTotal += itemTax;
      }
      
      updateData.subtotal = subtotal;
      updateData.taxTotal = taxTotal;
      updateData.totalAmount = subtotal + taxTotal + (updateData.otherCharges || 0);
      
      // Update balance amount if not explicitly set
      if (updateData.paidAmount === undefined) {
        updateData.balanceAmount = updateData.totalAmount - (existingBill.paidAmount || 0);
      } else {
        updateData.balanceAmount = updateData.totalAmount - updateData.paidAmount;
      }
    }
    
    const bill = await Bill.findOneAndUpdate(
      { billId, tenantId },
      updateData,
      { new: true, runValidators: true }
    );
    
    return bill;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid bill ID', 400, 'INVALID_BILL_ID');
    }
    throw error;
  }
};

/**
 * Approve bill
 * @param {String} billId - Bill ID
 * @param {String} tenantId - Tenant ID
 * @param {String} userId - User ID
 * @returns {Object} Approved bill
 */
const approveBill = async (billId, tenantId, userId) => {
  try {
    const bill = await Bill.findOne({ billId, tenantId });
    
    if (!bill) {
      throw new AppError('Bill not found', 404, 'BILL_NOT_FOUND');
    }
    
    if (bill.status !== 'Pending') {
      throw new AppError('Bill is not in pending status', 400, 'INVALID_BILL_STATUS');
    }
    
    bill.status = 'Approved';
    bill.approvedBy = userId;
    bill.approvedDate = new Date();
    
    await bill.save();
    
    return bill;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid bill ID', 400, 'INVALID_BILL_ID');
    }
    throw error;
  }
};

/**
 * Record bill payment
 * @param {String} billId - Bill ID
 * @param {Number} amount - Payment amount
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Updated bill
 */
const recordBillPayment = async (billId, amount, tenantId) => {
  try {
    const bill = await Bill.findOne({ billId, tenantId });
    
    if (!bill) {
      throw new AppError('Bill not found', 404, 'BILL_NOT_FOUND');
    }
    
    if (bill.status !== 'Approved') {
      throw new AppError('Bill must be approved before payment', 400, 'BILL_NOT_APPROVED');
    }
    
    const newPaidAmount = (bill.paidAmount || 0) + amount;
    
    if (newPaidAmount > bill.totalAmount) {
      throw new AppError('Payment amount exceeds bill total', 400, 'PAYMENT_EXCEEDS_TOTAL');
    }
    
    bill.paidAmount = newPaidAmount;
    bill.balanceAmount = bill.totalAmount - newPaidAmount;
    
    // Update status based on payment
    if (bill.balanceAmount === 0) {
      bill.status = 'Paid';
    } else {
      bill.status = 'PartiallyPaid';
    }
    
    await bill.save();
    
    return bill;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid bill ID', 400, 'INVALID_BILL_ID');
    }
    throw error;
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