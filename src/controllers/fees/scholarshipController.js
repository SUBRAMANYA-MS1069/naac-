const scholarshipService = require('../../services/fees/scholarshipService');
const { successResponse, errorResponse, paginatedResponse } = require('../../utils/helpers/responseHelper');
const { getPagination } = require('../../utils/helpers/paginationHelper');

/**
 * Create a new scholarship
 * @route POST /api/v1/finance/fees/scholarships
 * @access Private (Finance Manager)
 */
const createScholarship = async (req, res, next) => {
  try {
    const scholarship = await scholarshipService.createScholarship(req.body, req.tenantId);
    res.status(201).json(successResponse(scholarship, 'Scholarship created successfully', 201));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all scholarships
 * @route GET /api/v1/finance/fees/scholarships
 * @access Private (Finance Manager, Accountant)
 */
const getScholarships = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const filters = {
      active: req.query.active,
      academicYear: req.query.academicYear,
      scholarshipType: req.query.scholarshipType
    };
    
    const result = await scholarshipService.getScholarships(filters, pagination, req.tenantId);
    
    res.json(paginatedResponse(
      result.scholarships,
      result.page,
      result.limit,
      result.total,
      'Scholarships retrieved successfully'
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * Get scholarship by ID
 * @route GET /api/v1/finance/fees/scholarships/:scholarshipId
 * @access Private (Finance Manager, Accountant)
 */
const getScholarshipById = async (req, res, next) => {
  try {
    const scholarship = await scholarshipService.getScholarshipById(req.params.scholarshipId, req.tenantId);
    res.json(successResponse(scholarship, 'Scholarship retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Update scholarship
 * @route PUT /api/v1/finance/fees/scholarships/:scholarshipId
 * @access Private (Finance Manager)
 */
const updateScholarship = async (req, res, next) => {
  try {
    const scholarship = await scholarshipService.updateScholarship(req.params.scholarshipId, req.body, req.tenantId);
    res.json(successResponse(scholarship, 'Scholarship updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete scholarship
 * @route DELETE /api/v1/finance/fees/scholarships/:scholarshipId
 * @access Private (Finance Manager)
 */
const deleteScholarship = async (req, res, next) => {
  try {
    const result = await scholarshipService.deleteScholarship(req.params.scholarshipId, req.tenantId);
    res.json(successResponse(result, 'Scholarship deleted successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Apply for scholarship
 * @route POST /api/v1/finance/fees/scholarships/:scholarshipId/applications
 * @access Private (Student)
 */
const applyForScholarship = async (req, res, next) => {
  try {
    const application = await scholarshipService.applyForScholarship(
      req.params.scholarshipId,
      req.body,
      req.tenantId
    );
    res.status(201).json(successResponse(application, 'Scholarship application submitted successfully', 201));
  } catch (error) {
    next(error);
  }
};

/**
 * Get scholarship applications
 * @route GET /api/v1/finance/fees/scholarships/:scholarshipId/applications
 * @access Private (Finance Manager)
 */
const getScholarshipApplications = async (req, res, next) => {
  try {
    const applications = await scholarshipService.getScholarshipApplications(
      req.params.scholarshipId,
      req.tenantId
    );
    res.json(successResponse(applications, 'Scholarship applications retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Update scholarship application
 * @route PUT /api/v1/finance/fees/scholarships/applications/:applicationId
 * @access Private (Finance Manager)
 */
const updateScholarshipApplication = async (req, res, next) => {
  try {
    const application = await scholarshipService.updateScholarshipApplication(
      req.params.applicationId,
      req.body,
      req.tenantId
    );
    res.json(successResponse(application, 'Scholarship application updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Disburse scholarship
 * @route POST /api/v1/finance/fees/scholarships/disbursements
 * @access Private (Finance Manager)
 */
const disburseScholarship = async (req, res, next) => {
  try {
    const disbursement = await scholarshipService.disburseScholarship(req.body, req.tenantId);
    res.status(201).json(successResponse(disbursement, 'Scholarship disbursed successfully', 201));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createScholarship,
  getScholarships,
  getScholarshipById,
  updateScholarship,
  deleteScholarship,
  applyForScholarship,
  getScholarshipApplications,
  updateScholarshipApplication,
  disburseScholarship
};