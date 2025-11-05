const Scholarship = require('../../models/fees/Scholarship');
const ScholarshipApplication = require('../../models/fees/ScholarshipApplication');
const ScholarshipDisbursement = require('../../models/fees/ScholarshipDisbursement');
const { AppError } = require('../../utils/helpers/errorHelper');

/**
 * Create a new scholarship
 * @param {Object} scholarshipData - Scholarship data
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Created scholarship
 */
const createScholarship = async (scholarshipData, tenantId) => {
  try {
    // Add tenantId to scholarship data
    scholarshipData.tenantId = tenantId;
    
    // Create scholarship
    const scholarship = new Scholarship(scholarshipData);
    await scholarship.save();
    
    return scholarship;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('Scholarship with this name already exists', 409, 'DUPLICATE_SCHOLARSHIP');
    }
    throw error;
  }
};

/**
 * Get scholarships with filters
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination options
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Scholarships and pagination info
 */
const getScholarships = async (filters, pagination, tenantId) => {
  try {
    const query = { tenantId, ...filters };
    
    // Handle active filter
    if (filters.active !== undefined) {
      query.isActive = filters.active;
    }
    
    // Handle academic year filter
    if (filters.academicYear) {
      query.academicYear = filters.academicYear;
    }
    
    // Handle scholarship type filter
    if (filters.scholarshipType) {
      query.scholarshipType = filters.scholarshipType;
    }
    
    const scholarships = await Scholarship.find(query)
      .sort(pagination.sort || '-createdAt')
      .skip(pagination.skip)
      .limit(pagination.limit);
    
    const total = await Scholarship.countDocuments(query);
    
    return {
      scholarships,
      total,
      page: pagination.page,
      limit: pagination.limit
    };
  } catch (error) {
    throw new AppError('Failed to fetch scholarships', 500, 'FETCH_SCHOLARSHIPS_ERROR');
  }
};

/**
 * Get scholarship by ID
 * @param {String} scholarshipId - Scholarship ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Scholarship
 */
const getScholarshipById = async (scholarshipId, tenantId) => {
  try {
    const scholarship = await Scholarship.findOne({ scholarshipId, tenantId });
    
    if (!scholarship) {
      throw new AppError('Scholarship not found', 404, 'SCHOLARSHIP_NOT_FOUND');
    }
    
    return scholarship;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid scholarship ID', 400, 'INVALID_SCHOLARSHIP_ID');
    }
    throw error;
  }
};

/**
 * Update scholarship
 * @param {String} scholarshipId - Scholarship ID
 * @param {Object} updateData - Update data
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Updated scholarship
 */
const updateScholarship = async (scholarshipId, updateData, tenantId) => {
  try {
    const scholarship = await Scholarship.findOneAndUpdate(
      { scholarshipId, tenantId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!scholarship) {
      throw new AppError('Scholarship not found', 404, 'SCHOLARSHIP_NOT_FOUND');
    }
    
    return scholarship;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid scholarship ID', 400, 'INVALID_SCHOLARSHIP_ID');
    }
    throw error;
  }
};

/**
 * Delete scholarship (soft delete)
 * @param {String} scholarshipId - Scholarship ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Deletion result
 */
const deleteScholarship = async (scholarshipId, tenantId) => {
  try {
    const scholarship = await Scholarship.findOneAndUpdate(
      { scholarshipId, tenantId },
      { isActive: false },
      { new: true }
    );
    
    if (!scholarship) {
      throw new AppError('Scholarship not found', 404, 'SCHOLARSHIP_NOT_FOUND');
    }
    
    return {
      message: 'Scholarship deleted successfully',
      scholarship
    };
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid scholarship ID', 400, 'INVALID_SCHOLARSHIP_ID');
    }
    throw error;
  }
};

/**
 * Apply for scholarship
 * @param {Object} applicationData - Application data
 * @param {String} tenantId - Tenant ID
 * @param {String} studentId - Student ID
 * @returns {Object} Created application
 */
const applyForScholarship = async (applicationData, tenantId, studentId) => {
  try {
    // Add tenantId and studentId to application data
    applicationData.tenantId = tenantId;
    applicationData.studentId = studentId;
    
    // Check if scholarship exists and is active
    const scholarship = await Scholarship.findOne({ 
      scholarshipId: applicationData.scholarshipId, 
      tenantId,
      isActive: true 
    });
    
    if (!scholarship) {
      throw new AppError('Scholarship not found or inactive', 404, 'SCHOLARSHIP_NOT_FOUND');
    }
    
    // Check if application already exists
    const existingApplication = await ScholarshipApplication.findOne({
      scholarshipId: applicationData.scholarshipId,
      studentId,
      tenantId
    });
    
    if (existingApplication) {
      throw new AppError('Application already exists for this scholarship', 409, 'DUPLICATE_APPLICATION');
    }
    
    // Create application
    const application = new ScholarshipApplication(applicationData);
    await application.save();
    
    return application;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('Application already exists', 409, 'DUPLICATE_APPLICATION');
    }
    throw error;
  }
};

/**
 * Get scholarship applications
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination options
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Applications and pagination info
 */
const getScholarshipApplications = async (filters, pagination, tenantId) => {
  try {
    const query = { tenantId, ...filters };
    
    // Handle scholarship filter
    if (filters.scholarshipId) {
      query.scholarshipId = filters.scholarshipId;
    }
    
    // Handle student filter
    if (filters.studentId) {
      query.studentId = filters.studentId;
    }
    
    // Handle status filter
    if (filters.status) {
      query.status = filters.status;
    }
    
    const applications = await ScholarshipApplication.find(query)
      .sort(pagination.sort || '-applicationDate')
      .skip(pagination.skip)
      .limit(pagination.limit)
      .populate('scholarshipId', 'scholarshipName scholarshipType')
      .populate('studentId', 'name studentCode');
    
    const total = await ScholarshipApplication.countDocuments(query);
    
    return {
      applications,
      total,
      page: pagination.page,
      limit: pagination.limit
    };
  } catch (error) {
    throw new AppError('Failed to fetch scholarship applications', 500, 'FETCH_APPLICATIONS_ERROR');
  }
};

/**
 * Update scholarship application
 * @param {String} applicationId - Application ID
 * @param {Object} updateData - Update data
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Updated application
 */
const updateScholarshipApplication = async (applicationId, updateData, tenantId) => {
  try {
    const application = await ScholarshipApplication.findOneAndUpdate(
      { scholarshipApplicationId: applicationId, tenantId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!application) {
      throw new AppError('Scholarship application not found', 404, 'APPLICATION_NOT_FOUND');
    }
    
    return application;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid application ID', 400, 'INVALID_APPLICATION_ID');
    }
    throw error;
  }
};

/**
 * Disburse scholarship
 * @param {Object} disbursementData - Disbursement data
 * @param {String} tenantId - Tenant ID
 * @param {String} userId - User ID
 * @returns {Object} Created disbursement
 */
const disburseScholarship = async (disbursementData, tenantId, userId) => {
  try {
    // Add tenantId and disbursedBy to disbursement data
    disbursementData.tenantId = tenantId;
    disbursementData.disbursedBy = userId;
    
    // Check if application exists and is approved
    const application = await ScholarshipApplication.findOne({
      scholarshipApplicationId: disbursementData.applicationId,
      tenantId,
      status: 'Approved'
    });
    
    if (!application) {
      throw new AppError('Approved application not found', 404, 'APPLICATION_NOT_FOUND');
    }
    
    // Create disbursement
    const disbursement = new ScholarshipDisbursement(disbursementData);
    await disbursement.save();
    
    return disbursement;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('Disbursement already exists', 409, 'DUPLICATE_DISBURSEMENT');
    }
    throw error;
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