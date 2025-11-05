const vendorService = require('../../services/expenditure/vendorService');
const { successResponse, errorResponse, paginatedResponse } = require('../../utils/helpers/responseHelper');
const { getPagination } = require('../../utils/helpers/paginationHelper');

/**
 * Create a new vendor
 * @route POST /api/v1/finance/expenditure/vendors
 * @access Private (Finance Manager)
 */
const createVendor = async (req, res, next) => {
  try {
    const vendor = await vendorService.createVendor(req.body, req.tenantId);
    res.status(201).json(successResponse(vendor, 'Vendor created successfully', 201));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all vendors
 * @route GET /api/v1/finance/expenditure/vendors
 * @access Private (Finance Manager, Accountant)
 */
const getVendors = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const filters = {
      active: req.query.active,
      vendorType: req.query.vendorType,
      category: req.query.category,
      search: req.query.search
    };
    
    const result = await vendorService.getVendors(filters, pagination, req.tenantId);
    
    res.json(paginatedResponse(
      result.vendors,
      result.page,
      result.limit,
      result.total,
      'Vendors retrieved successfully'
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * Get vendor by ID
 * @route GET /api/v1/finance/expenditure/vendors/:vendorId
 * @access Private (Finance Manager, Accountant)
 */
const getVendorById = async (req, res, next) => {
  try {
    const vendor = await vendorService.getVendorById(req.params.vendorId, req.tenantId);
    res.json(successResponse(vendor, 'Vendor retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Update vendor
 * @route PUT /api/v1/finance/expenditure/vendors/:vendorId
 * @access Private (Finance Manager)
 */
const updateVendor = async (req, res, next) => {
  try {
    const vendor = await vendorService.updateVendor(req.params.vendorId, req.body, req.tenantId);
    res.json(successResponse(vendor, 'Vendor updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete vendor
 * @route DELETE /api/v1/finance/expenditure/vendors/:vendorId
 * @access Private (Finance Manager)
 */
const deleteVendor = async (req, res, next) => {
  try {
    const result = await vendorService.deleteVendor(req.params.vendorId, req.tenantId);
    res.json(successResponse(result, 'Vendor deleted successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor
};