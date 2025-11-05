/**
 * Calculate gross salary from components
 * @param {Array} earnings - Array of earning components
 * @returns {Number} Gross salary
 */
const calculateGrossSalary = (earnings) => {
  return earnings.reduce((total, component) => total + component.amount, 0);
};

/**
 * Calculate total deductions
 * @param {Array} deductions - Array of deduction components
 * @returns {Number} Total deductions
 */
const calculateTotalDeductions = (deductions) => {
  return deductions.reduce((total, component) => total + component.amount, 0);
};

/**
 * Calculate net salary
 * @param {Number} grossSalary - Gross salary
 * @param {Number} totalDeductions - Total deductions
 * @returns {Number} Net salary
 */
const calculateNetSalary = (grossSalary, totalDeductions) => {
  return grossSalary - totalDeductions;
};

/**
 * Calculate provident fund contribution
 * @param {Number} basicSalary - Basic salary
 * @param {Number} employeePercentage - Employee PF percentage
 * @param {Number} employerPercentage - Employer PF percentage
 * @returns {Object} PF contribution details
 */
const calculateProvidentFund = (basicSalary, employeePercentage = 12, employerPercentage = 12) => {
  const employeeContribution = (basicSalary * employeePercentage) / 100;
  const employerContribution = (basicSalary * employerPercentage) / 100;
  const totalContribution = employeeContribution + employerContribution;
  
  return {
    employeeContribution,
    employerContribution,
    totalContribution
  };
};

/**
 * Calculate ESI contribution
 * @param {Number} grossSalary - Gross salary
 * @param {Number} employeePercentage - Employee ESI percentage
 * @param {Number} employerPercentage - Employer ESI percentage
 * @returns {Object} ESI contribution details
 */
const calculateESI = (grossSalary, employeePercentage = 0.75, employerPercentage = 3.25) => {
  // ESI is applicable only if gross salary is <= ₹25,000 per month
  if (grossSalary > 25000) {
    return {
      employeeContribution: 0,
      employerContribution: 0,
      totalContribution: 0
    };
  }
  
  const employeeContribution = (grossSalary * employeePercentage) / 100;
  const employerContribution = (grossSalary * employerPercentage) / 100;
  const totalContribution = employeeContribution + employerContribution;
  
  return {
    employeeContribution,
    employerContribution,
    totalContribution
  };
};

/**
 * Calculate leave encashment
 * @param {Number} basicSalary - Basic salary
 * @param {Number} leaveDays - Number of leave days to encash
 * @param {Number} workingDaysPerMonth - Working days per month
 * @returns {Number} Leave encashment amount
 */
const calculateLeaveEncashment = (basicSalary, leaveDays, workingDaysPerMonth = 30) => {
  const dailySalary = basicSalary / workingDaysPerMonth;
  return dailySalary * leaveDays;
};

module.exports = {
  calculateGrossSalary,
  calculateTotalDeductions,
  calculateNetSalary,
  calculateProvidentFund,
  calculateESI,
  calculateLeaveEncashment
};