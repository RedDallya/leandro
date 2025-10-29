const PDFDocument = require('pdfkit');
const getStream = require('get-stream');

const generateSectionPdf = async ({ title, fields = {}, documents = [] }) => {
  const doc = new PDFDocument({ margin: 40 });
  doc.fontSize(18).text(title, { underline: true });
  doc.moveDown();

  doc.fontSize(12);
  Object.entries(fields).forEach(([key, value]) => {
    if (value) {
      doc.text(`${key}: ${value}`);
    }
  });

  if (documents.length) {
    doc.moveDown();
    doc.text('Documentos Adjuntos:', { continued: false });
    documents.forEach((document) => {
      doc.circle(doc.x - 6, doc.y + 6, 3).fill('#000').stroke();
      doc.fillColor('#000').text(document.title, { indent: 12 });
    });
  }

  doc.end();
  const buffer = await getStream.buffer(doc);
  return buffer;
};

module.exports = {
  generateSectionPdf
};
