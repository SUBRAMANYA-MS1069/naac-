const FeePayment = require('../../models/fees/FeePayment');
const FeeInvoice = require('../../models/fees/FeeInvoice');
const { AppError } = require('../../utils/helpers/errorHelper');

/**
 * Create a new fee payment
 * @param {Object} paymentData - Payment data
 * @param {String} tenantId - Tenant ID
 * @param {String} userId - User ID
 * @returns {Object} Created payment
 */
const createPayment = async (paymentData, tenantId, userId) => {
  try {
    // Add tenantId and receivedBy to payment data
    paymentData.tenantId = tenantId;
    paymentData.receivedBy = userId;
    
    // Create payment
    const payment = new FeePayment(paymentData);
    await payment.save();
    
    // Update invoice status if needed
    if (paymentData.invoiceId) {
      await updateInvoiceStatus(paymentData.invoiceId, tenantId);
    }
    
    return payment;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('Payment with this transaction ID already exists', 409, 'DUPLICATE_PAYMENT');
    }
    throw error;
  }
};

/**
 * Get payments with filters
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination options
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Payments and pagination info
 */
const getPayments = async (filters, pagination, tenantId) => {
  try {
    const query = { tenantId, ...filters };
    
    // Handle student filter
    if (filters.studentId) {
      query.studentId = filters.studentId;
    }
    
    // Handle date range filter
    if (filters.startDate || filters.endDate) {
      query.paymentDate = {};
      if (filters.startDate) {
        query.paymentDate.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.paymentDate.$lte = new Date(filters.endDate);
      }
    }
    
    const payments = await FeePayment.find(query)
      .sort(pagination.sort || '-paymentDate')
      .skip(pagination.skip)
      .limit(pagination.limit)
      .populate('receivedBy', 'name email');
    
    const total = await FeePayment.countDocuments(query);
    
    return {
      payments,
      total,
      page: pagination.page,
      limit: pagination.limit
    };
  } catch (error) {
    throw new AppError('Failed to fetch payments', 500, 'FETCH_PAYMENTS_ERROR');
  }
};

/**
 * Get payment by ID
 * @param {String} paymentId - Payment ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Payment
 */
const getPaymentById = async (paymentId, tenantId) => {
  try {
    const payment = await FeePayment.findOne({ feePaymentId: paymentId, tenantId })
      .populate('receivedBy', 'name email');
    
    if (!payment) {
      throw new AppError('Payment not found', 404, 'PAYMENT_NOT_FOUND');
    }
    
    return payment;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid payment ID', 400, 'INVALID_PAYMENT_ID');
    }
    throw error;
  }
};

/**
 * Update payment
 * @param {String} paymentId - Payment ID
 * @param {Object} updateData - Update data
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Updated payment
 */
const updatePayment = async (paymentId, updateData, tenantId) => {
  try {
    const payment = await FeePayment.findOneAndUpdate(
      { feePaymentId: paymentId, tenantId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!payment) {
      throw new AppError('Payment not found', 404, 'PAYMENT_NOT_FOUND');
    }
    
    return payment;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid payment ID', 400, 'INVALID_PAYMENT_ID');
    }
    throw error;
  }
};

/**
 * Delete payment (soft delete)
 * @param {String} paymentId - Payment ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Deletion result
 */
const deletePayment = async (paymentId, tenantId) => {
  try {
    const payment = await FeePayment.findOneAndUpdate(
      { feePaymentId: paymentId, tenantId },
      { isActive: false },
      { new: true }
    );
    
    if (!payment) {
      throw new AppError('Payment not found', 404, 'PAYMENT_NOT_FOUND');
    }
    
    return {
      message: 'Payment deleted successfully',
      payment
    };
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid payment ID', 400, 'INVALID_PAYMENT_ID');
    }
    throw error;
  }
};

/**
 * Update invoice status based on payments
 * @param {String} invoiceId - Invoice ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Updated invoice
 */
const updateInvoiceStatus = async (invoiceId, tenantId) => {
  try {
    // Get invoice
    const invoice = await FeeInvoice.findOne({ feeInvoiceId: invoiceId, tenantId });
    
    if (!invoice) {
      throw new AppError('Invoice not found', 404, 'INVOICE_NOT_FOUND');
    }
    
    // Get all payments for this invoice
    const payments = await FeePayment.find({ 
      invoiceId: invoice.feeInvoiceId, 
      tenantId, 
      status: 'Success' 
    });
    
    // Calculate total paid amount
    const paidAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const balanceAmount = invoice.finalAmount - paidAmount;
    
    // Update invoice status
    if (paidAmount >= invoice.finalAmount) {
      invoice.status = 'Paid';
    } else if (paidAmount > 0) {
      invoice.status = 'PartiallyPaid';
    } else if (new Date() > invoice.dueDate) {
      invoice.status = 'Overdue';
    }
    
    invoice.paidAmount = paidAmount;
    invoice.balanceAmount = balanceAmount;
    
    await invoice.save();
    
    return invoice;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  updateInvoiceStatus
};