const Vendor = require('../../models/expenditure/Vendor');
const { AppError } = require('../../utils/helpers/errorHelper');

/**
 * Create a new vendor
 * @param {Object} vendorData - Vendor data
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Created vendor
 */
const createVendor = async (vendorData, tenantId) => {
  try {
    // Add tenantId to vendor data
    vendorData.tenantId = tenantId;
    
    // Create vendor
    const vendor = new Vendor(vendorData);
    await vendor.save();
    
    return vendor;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('Vendor with this code already exists', 409, 'DUPLICATE_VENDOR_CODE');
    }
    throw error;
  }
};

/**
 * Get vendors with filters
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination options
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Vendors and pagination info
 */
const getVendors = async (filters, pagination, tenantId) => {
  try {
    const query = { tenantId, ...filters };
    
    // Handle active filter
    if (filters.active !== undefined) {
      query.isActive = filters.active;
    }
    
    // Handle vendor type filter
    if (filters.vendorType) {
      query.vendorType = filters.vendorType;
    }
    
    // Handle category filter
    if (filters.category) {
      query.category = filters.category;
    }
    
    // Handle search
    if (filters.search) {
      query.$or = [
        { vendorName: { $regex: filters.search, $options: 'i' } },
        { vendorCode: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    const vendors = await Vendor.find(query)
      .sort(pagination.sort || '-createdAt')
      .skip(pagination.skip)
      .limit(pagination.limit);
    
    const total = await Vendor.countDocuments(query);
    
    return {
      vendors,
      total,
      page: pagination.page,
      limit: pagination.limit
    };
  } catch (error) {
    throw new AppError('Failed to fetch vendors', 500, 'FETCH_VENDORS_ERROR');
  }
};

/**
 * Get vendor by ID
 * @param {String} vendorId - Vendor ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Vendor
 */
const getVendorById = async (vendorId, tenantId) => {
  try {
    const vendor = await Vendor.findOne({ vendorId, tenantId });
    
    if (!vendor) {
      throw new AppError('Vendor not found', 404, 'VENDOR_NOT_FOUND');
    }
    
    return vendor;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid vendor ID', 400, 'INVALID_VENDOR_ID');
    }
    throw error;
  }
};

/**
 * Update vendor
 * @param {String} vendorId - Vendor ID
 * @param {Object} updateData - Update data
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Updated vendor
 */
const updateVendor = async (vendorId, updateData, tenantId) => {
  try {
    const vendor = await Vendor.findOneAndUpdate(
      { vendorId, tenantId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!vendor) {
      throw new AppError('Vendor not found', 404, 'VENDOR_NOT_FOUND');
    }
    
    return vendor;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid vendor ID', 400, 'INVALID_VENDOR_ID');
    }
    throw error;
  }
};

/**
 * Delete vendor (soft delete)
 * @param {String} vendorId - Vendor ID
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Deletion result
 */
const deleteVendor = async (vendorId, tenantId) => {
  try {
    const vendor = await Vendor.findOneAndUpdate(
      { vendorId, tenantId },
      { isActive: false },
      { new: true }
    );
    
    if (!vendor) {
      throw new AppError('Vendor not found', 404, 'VENDOR_NOT_FOUND');
    }
    
    return {
      message: 'Vendor deleted successfully',
      vendor
    };
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid vendor ID', 400, 'INVALID_VENDOR_ID');
    }
    throw error;
  }
};

/**
 * Rate vendor
 * @param {String} vendorId - Vendor ID
 * @param {Number} rating - Rating (1-5)
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Updated vendor
 */
const rateVendor = async (vendorId, rating, tenantId) => {
  try {
    if (rating < 1 || rating > 5) {
      throw new AppError('Rating must be between 1 and 5', 400, 'INVALID_RATING');
    }
    
    const vendor = await Vendor.findOne({ vendorId, tenantId });
    
    if (!vendor) {
      throw new AppError('Vendor not found', 404, 'VENDOR_NOT_FOUND');
    }
    
    vendor.rating = rating;
    await vendor.save();
    
    return vendor;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AppError('Invalid vendor ID', 400, 'INVALID_VENDOR_ID');
    }
    throw error;
  }
};

module.exports = {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  rateVendor
};