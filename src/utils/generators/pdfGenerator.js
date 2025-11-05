const PDFDocument = require('pdfkit');
const fs = require('fs');

/**
 * Generate PDF document
 * @param {Object} data - Data to include in PDF
 * @param {String} outputPath - Path to save the PDF
 * @returns {Promise} Promise that resolves when PDF is generated
 */
const generatePDF = async (data, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(outputPath);
      
      doc.pipe(stream);
      
      // Add content to PDF based on data type
      if (data.title) {
        doc.fontSize(20).text(data.title, { align: 'center' });
        doc.moveDown();
      }
      
      if (data.headers) {
        doc.fontSize(12);
        data.headers.forEach(header => {
          doc.text(`${header.label}: ${header.value}`);
        });
        doc.moveDown();
      }
      
      if (data.content) {
        doc.fontSize(10).text(data.content);
        doc.moveDown();
      }
      
      if (data.table) {
        // Simple table implementation
        const tableData = data.table;
        const columnWidth = 100;
        const rowHeight = 20;
        
        // Table headers
        let x = 50;
        let y = doc.y;
        tableData.headers.forEach((header, index) => {
          doc.rect(x + (index * columnWidth), y, columnWidth, rowHeight).stroke();
          doc.text(header, x + (index * columnWidth) + 5, y + 5);
        });
        
        // Table rows
        tableData.rows.forEach((row, rowIndex) => {
          y += rowHeight;
          row.forEach((cell, cellIndex) => {
            doc.rect(x + (cellIndex * columnWidth), y, columnWidth, rowHeight).stroke();
            doc.text(cell.toString(), x + (cellIndex * columnWidth) + 5, y + 5);
          });
        });
      }
      
      doc.end();
      
      stream.on('finish', () => {
        resolve(outputPath);
      });
      
      stream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate invoice PDF
 * @param {Object} invoiceData - Invoice data
 * @param {String} outputPath - Path to save the PDF
 * @returns {Promise} Promise that resolves when PDF is generated
 */
const generateInvoicePDF = async (invoiceData, outputPath) => {
  const data = {
    title: 'INVOICE',
    headers: [
      { label: 'Invoice Number', value: invoiceData.invoiceNumber },
      { label: 'Date', value: new Date(invoiceData.date).toLocaleDateString() },
      { label: 'Due Date', value: new Date(invoiceData.dueDate).toLocaleDateString() }
    ],
    content: `
      Bill To:
      ${invoiceData.billTo.name}
      ${invoiceData.billTo.address}
      
      Items:
      ${invoiceData.items.map(item => 
        `${item.description} - Qty: ${item.quantity} - Price: ${item.price} - Total: ${item.total}`
      ).join('\n')}
      
      Subtotal: ${invoiceData.subtotal}
      Tax: ${invoiceData.tax}
      Total: ${invoiceData.total}
    `
  };
  
  return generatePDF(data, outputPath);
};

/**
 * Generate receipt PDF
 * @param {Object} receiptData - Receipt data
 * @param {String} outputPath - Path to save the PDF
 * @returns {Promise} Promise that resolves when PDF is generated
 */
const generateReceiptPDF = async (receiptData, outputPath) => {
  const data = {
    title: 'PAYMENT RECEIPT',
    headers: [
      { label: 'Receipt Number', value: receiptData.receiptNumber },
      { label: 'Date', value: new Date(receiptData.date).toLocaleDateString() },
      { label: 'Payment Method', value: receiptData.paymentMethod }
    ],
    content: `
      Received From:
      ${receiptData.receivedFrom.name}
      ${receiptData.receivedFrom.address}
      
      Amount: ${receiptData.amount}
      Amount in Words: ${receiptData.amountInWords}
      
      For:
      ${receiptData.for}
    `
  };
  
  return generatePDF(data, outputPath);
};

module.exports = {
  generatePDF,
  generateInvoicePDF,
  generateReceiptPDF
};