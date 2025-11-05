const paymentService = require('../../services/fees/paymentService');
const invoiceService = require('../../services/fees/invoiceService');
const { successResponse, errorResponse, paginatedResponse } = require('../../utils/helpers/responseHelper');
const { getPagination } = require('../../utils/helpers/paginationHelper');

/**
 * Generate fee invoice
 * @route POST /api/v1/finance/fees/invoices
 * @access Private (Finance Manager, Accountant)
 */
const generateInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.generateInvoice(req.body, req.tenantId);
    res.status(201).json(successResponse(invoice, 'Invoice generated successfully', 201));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all invoices
 * @route GET /api/v1/finance/fees/invoices
 * @access Private (Finance Manager, Accountant)
 */
const getInvoices = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const filters = {
      studentId: req.query.studentId,
      academicYear: req.query.academicYear,
      status: req.query.status,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    
    const result = await invoiceService.getInvoices(filters, pagination, req.tenantId);
    
    res.json(paginatedResponse(
      result.invoices,
      result.page,
      result.limit,
      result.total,
      'Invoices retrieved successfully'
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * Get invoice by ID
 * @route GET /api/v1/finance/fees/invoices/:invoiceId
 * @access Private (Finance Manager, Accountant, Student)
 */
const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.invoiceId, req.tenantId);
    res.json(successResponse(invoice, 'Invoice retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Update invoice
 * @route PUT /api/v1/finance/fees/invoices/:invoiceId
 * @access Private (Finance Manager, Accountant)
 */
const updateInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.updateInvoice(req.params.invoiceId, req.body, req.tenantId);
    res.json(successResponse(invoice, 'Invoice updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Record fee payment
 * @route POST /api/v1/finance/fees/payments
 * @access Private (Finance Manager, Accountant)
 */
const recordPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.createPayment(req.body, req.tenantId, req.user.userId);
    res.status(201).json(successResponse(payment, 'Payment recorded successfully', 201));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all payments
 * @route GET /api/v1/finance/fees/payments
 * @access Private (Finance Manager, Accountant)
 */
const getPayments = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const filters = {
      studentId: req.query.studentId,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    
    const result = await paymentService.getPayments(filters, pagination, req.tenantId);
    
    res.json(paginatedResponse(
      result.payments,
      result.page,
      result.limit,
      result.total,
      'Payments retrieved successfully'
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * Get payment by ID
 * @route GET /api/v1/finance/fees/payments/:paymentId
 * @access Private (Finance Manager, Accountant)
 */
const getPaymentById = async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.paymentId, req.tenantId);
    res.json(successResponse(payment, 'Payment retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Process refund
 * @route POST /api/v1/finance/fees/refunds
 * @access Private (Finance Manager)
 */
const processRefund = async (req, res, next) => {
  try {
    const refund = await paymentService.processRefund(req.body, req.tenantId);
    res.status(201).json(successResponse(refund, 'Refund processed successfully', 201));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  recordPayment,
  getPayments,
  getPaymentById,
  processRefund
};