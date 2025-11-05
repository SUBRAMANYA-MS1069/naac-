const FeeInvoice = require('../../models/fees/FeeInvoice');
const FeeStructure = require('../../models/fees/FeeStructure');
const { AppError } = require('../../utils/helpers/errorHelper');
const { calculateTotalDeductions } = require('../../utils/calculators/salaryCalculator');

/**
 * Generate fee invoice
 * @param {Object} invoiceData - Invoice data
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Created invoice
 */
const generateInvoice = async (invoiceData, tenantId) => {
  try {
    // Add tenantId to invoice data
    invoiceData.tenantId = tenantId;
    
    // Get fee structure
    const feeStructure = await FeeStructure.findOne({ 
      feeStructureId: invoiceData.feeStructureId, 
      tenantId,
      isActive: true 
    });
    
    if (!feeStructure) {
      throw new AppError('Fee structure not found or inactive', 404, 'FEE_STRUCTURE_NOT_FOUND');
    }
    
    // Set invoice details from fee structure
    invoiceData.totalAmount = feeStructure.totalFee;
    invoiceData.finalAmount = feeStructure.totalFee;
    
    // Apply discounts if any
    if (invoiceData.discountsApplied && invoiceData.discountsApplied.length > 0) {
      let totalDiscount = 0;
      
      for (const discount of invoiceData.discountsApplied) {
        // In a real implementation, you would validate discount eligibility
        totalDiscount += discount.discountAmount;
      }
      
      invoiceData.finalAmount = invoiceData.totalAmount - totalDiscount;
    }
    
    // Apply adjustments if any
    if (invoiceData.adjustments && invoiceData.adjustments.length > 0) {
      let totalAdjustment = 0;
      
      for (const adjustment of invoiceData.adjustments) {
        totalAdjustment += adjustment.amount;
      }
      
      invoiceData.finalAmount += totalAdjustment;
    }
    
    // Ensure final amount is not negative
    invoiceData.finalAmount = Math.max(0, invoiceData.finalAmount);
    invoiceData.balanceAmount = invoiceData.finalAmount;
    
    // Create invoice
    const invoice = new FeeInvoice(invoiceData);
    await invoice.save();
    
    return invoice;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('Invoice with this number already exists', 409, 'DUPLICATE_INVOICE');
    }
    throw error;
  }
};

/**
 * Get invoices with filters
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination options
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Invoices and pagination info
 */
const getInvoices = async (filters, pagination, tenantId) => {
  try {
    const query = { tenantId, ...filters };
    
    // Handle student filter
    if (filters.studentId) {
      query.studentId = filters.studentId;
    }
    
    // Handle academic year filter
    if (filters.academicYear) {
      query.academicYear = filters.academicYear;
    }
    
    // Handle status filter
    if (filters.status) {
      query.status = filters.status;
    }
    
    // Handle date range filter
    if (filters.startDate || filters.endDate) {
      query.dueDate = {};
      if (filters.startDate) {
        query.dueDate.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.dueDate.$lte = new Date(filters.endDate);
      }
    }
    
    const invoices = await FeeInvoice.find(query)
      .sort(pagination.sort || '-createdAt')
      .skip(pagination.skip)
      .limit(pagination.limit);
    
    const total = await FeeInvoice.countDocuments(query);
    
    return {
      invoices,
      total,
      page: pagination.page,
      limit: pagination.limit
    };
  } catch (error) {
    throw new AppError('Failed to fetch invoices', 500, 'FETCH_INVOICES_ERROR');
  }
};

/**
 * Get invoice by ID
 * @param {String} invoiceId - Invoice ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Invoice
 */
const getInvoiceById = async (invoiceId, tenantId) => {
  try {
    const invoice = await FeeInvoice.findOne({ feeInvoiceId: invoiceId, tenantId });
    
    if (!invoice) {
      throw new AppError('Invoice not found', 404, 'INVOICE_NOT_FOUND');
    }
    
    return invoice;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid invoice ID', 400, 'INVALID_INVOICE_ID');
    }
    throw error;
  }
};

/**
 * Update invoice
 * @param {String} invoiceId - Invoice ID
 * @param {Object} updateData - Update data
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Updated invoice
 */
const updateInvoice = async (invoiceId, updateData, tenantId) => {
  try {
    const invoice = await FeeInvoice.findOneAndUpdate(
      { feeInvoiceId: invoiceId, tenantId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!invoice) {
      throw new AppError('Invoice not found', 404, 'INVOICE_NOT_FOUND');
    }
    
    return invoice;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid invoice ID', 400, 'INVALID_INVOICE_ID');
    }
    throw error;
  }
};

/**
 * Delete invoice (soft delete)
 * @param {String} invoiceId - Invoice ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Deletion result
 */
const deleteInvoice = async (invoiceId, tenantId) => {
  try {
    const invoice = await FeeInvoice.findOneAndUpdate(
      { feeInvoiceId: invoiceId, tenantId },
      { isActive: false },
      { new: true }
    );
    
    if (!invoice) {
      throw new AppError('Invoice not found', 404, 'INVOICE_NOT_FOUND');
    }
    
    return {
      message: 'Invoice deleted successfully',
      invoice
    };
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid invoice ID', 400, 'INVALID_INVOICE_ID');
    }
    throw error;
  }
};

/**
 * Get student invoices
 * @param {String} studentId - Student ID
 * @param {Object} filters - Additional filters
 * @param {Object} pagination - Pagination options
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Student invoices and pagination info
 */
const getStudentInvoices = async (studentId, filters, pagination, tenantId) => {
  try {
    const query = { tenantId, studentId, ...filters };
    
    const invoices = await FeeInvoice.find(query)
      .sort(pagination.sort || '-dueDate')
      .skip(pagination.skip)
      .limit(pagination.limit);
    
    const total = await FeeInvoice.countDocuments(query);
    
    return {
      invoices,
      total,
      page: pagination.page,
      limit: pagination.limit
    };
  } catch (error) {
    throw new AppError('Failed to fetch student invoices', 500, 'FETCH_STUDENT_INVOICES_ERROR');
  }
};

/**
 * Cancel invoice
 * @param {String} invoiceId - Invoice ID
 * @param {String} tenantId - Tenant ID
 * @param {String} reason - Cancellation reason
 * @returns {Object} Cancelled invoice
 */
const cancelInvoice = async (invoiceId, tenantId, reason) => {
  try {
    const invoice = await FeeInvoice.findOne({ feeInvoiceId: invoiceId, tenantId });
    
    if (!invoice) {
      throw new AppError('Invoice not found', 404, 'INVOICE_NOT_FOUND');
    }
    
    if (invoice.status === 'Paid') {
      throw new AppError('Cannot cancel paid invoice', 400, 'CANNOT_CANCEL_PAID_INVOICE');
    }
    
    invoice.status = 'Cancelled';
    invoice.remarks = reason;
    
    await invoice.save();
    
    return invoice;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid invoice ID', 400, 'INVALID_INVOICE_ID');
    }
    throw error;
  }
};

module.exports = {
  generateInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  getStudentInvoices,
  cancelInvoice
};