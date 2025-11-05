const XLSX = require('xlsx');

/**
 * Generate Excel file from data
 * @param {Array} data - Array of objects to convert to Excel
 * @param {String} outputPath - Path to save the Excel file
 * @param {String} sheetName - Name of the worksheet
 * @returns {String} Path to the generated file
 */
const generateExcel = (data, outputPath, sheetName = 'Sheet1') => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Write workbook to file
    XLSX.writeFile(workbook, outputPath);
    
    return outputPath;
  } catch (error) {
    throw new Error(`Failed to generate Excel file: ${error.message}`);
  }
};

/**
 * Generate financial report Excel
 * @param {Object} reportData - Report data
 * @param {String} outputPath - Path to save the Excel file
 * @returns {String} Path to the generated file
 */
const generateFinancialReportExcel = (reportData, outputPath) => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Add summary sheet
    if (reportData.summary) {
      const summarySheet = XLSX.utils.json_to_sheet([reportData.summary]);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    }
    
    // Add detailed data sheet
    if (reportData.details) {
      const detailsSheet = XLSX.utils.json_to_sheet(reportData.details);
      XLSX.utils.book_append_sheet(workbook, detailsSheet, 'Details');
    }
    
    // Add charts data sheet if available
    if (reportData.charts) {
      const chartsSheet = XLSX.utils.json_to_sheet(reportData.charts);
      XLSX.utils.book_append_sheet(workbook, chartsSheet, 'Charts Data');
    }
    
    // Write workbook to file
    XLSX.writeFile(workbook, outputPath);
    
    return outputPath;
  } catch (error) {
    throw new Error(`Failed to generate financial report Excel: ${error.message}`);
  }
};

/**
 * Generate budget Excel
 * @param {Array} budgetData - Budget data
 * @param {String} outputPath - Path to save the Excel file
 * @returns {String} Path to the generated file
 */
const generateBudgetExcel = (budgetData, outputPath) => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Convert budget data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(budgetData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Budget');
    
    // Write workbook to file
    XLSX.writeFile(workbook, outputPath);
    
    return outputPath;
  } catch (error) {
    throw new Error(`Failed to generate budget Excel: ${error.message}`);
  }
};

module.exports = {
  generateExcel,
  generateFinancialReportExcel,
  generateBudgetExcel
};