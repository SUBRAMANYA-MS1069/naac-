/**
 * Calculate GST amount
 * @param {Number} taxableAmount - Taxable amount
 * @param {Number} gstRate - GST rate percentage
 * @param {String} supplyType - Type of supply (IntraState/InterState)
 * @returns {Object} GST calculation details
 */
const calculateGST = (taxableAmount, gstRate, supplyType = 'IntraState') => {
  const totalGST = (taxableAmount * gstRate) / 100;
  
  if (supplyType === 'IntraState') {
    // For intra-state supply, CGST and SGST are equal
    const cgst = totalGST / 2;
    const sgst = totalGST / 2;
    return {
      cgst,
      sgst,
      igst: 0,
      totalGST
    };
  } else {
    // For inter-state supply, only IGST applies
    return {
      cgst: 0,
      sgst: 0,
      igst: totalGST,
      totalGST
    };
  }
};

/**
 * Calculate TDS amount
 * @param {Number} grossAmount - Gross amount
 * @param {Number} tdsRate - TDS rate percentage
 * @returns {Object} TDS calculation details
 */
const calculateTDS = (grossAmount, tdsRate) => {
  const tdsAmount = (grossAmount * tdsRate) / 100;
  const netAmount = grossAmount - tdsAmount;
  
  return {
    grossAmount,
    tdsRate,
    tdsAmount,
    netAmount
  };
};

/**
 * Calculate income tax based on Indian tax slabs (FY 2023-24)
 * @param {Number} annualIncome - Annual income
 * @param {Boolean} isSeniorCitizen - Whether the taxpayer is a senior citizen
 * @returns {Object} Income tax calculation details
 */
const calculateIncomeTax = (annualIncome, isSeniorCitizen = false) => {
  let tax = 0;
  let taxableIncome = Math.max(0, annualIncome - 50000); // Standard deduction of ₹50,000
  
  if (isSeniorCitizen) {
    // Senior citizen tax slabs (60-80 years)
    if (taxableIncome <= 300000) {
      tax = 0;
    } else if (taxableIncome <= 500000) {
      tax = (taxableIncome - 300000) * 0.05;
    } else if (taxableIncome <= 1000000) {
      tax = 10000 + (taxableIncome - 500000) * 0.20;
    } else {
      tax = 110000 + (taxableIncome - 1000000) * 0.30;
    }
  } else {
    // Normal tax slabs (below 60 years)
    if (taxableIncome <= 250000) {
      tax = 0;
    } else if (taxableIncome <= 500000) {
      tax = (taxableIncome - 250000) * 0.05;
    } else if (taxableIncome <= 1000000) {
      tax = 12500 + (taxableIncome - 500000) * 0.20;
    } else {
      tax = 112500 + (taxableIncome - 1000000) * 0.30;
    }
  }
  
  // Health and education cess (4%)
  const cess = tax * 0.04;
  const totalTax = tax + cess;
  
  return {
    grossIncome: annualIncome,
    standardDeduction: 50000,
    taxableIncome,
    baseTax: tax,
    cess,
    totalTax
  };
};

/**
 * Calculate professional tax based on state rules (example for Maharashtra)
 * @param {Number} monthlySalary - Monthly salary
 * @returns {Number} Professional tax amount
 */
const calculateProfessionalTax = (monthlySalary) => {
  const annualSalary = monthlySalary * 12;
  
  if (annualSalary <= 150000) {
    return 0;
  } else if (annualSalary <= 200000) {
    return 150 * 12; // ₹150 per month
  } else {
    return 200 * 12; // ₹200 per month
  }
};

module.exports = {
  calculateGST,
  calculateTDS,
  calculateIncomeTax,
  calculateProfessionalTax
};