const express = require('express');
const { generateSectionPdf } = require('../utils/pdfGenerator');
const authorize = require('../middleware/auth');
const { Travel, Document } = require('../models');

const router = express.Router();

router.post('/:section/:travelId', authorize('admin_superior', 'admin', 'operador', 'lector'), async (req, res) => {
  const { section, travelId } = req.params;
  const travel = await Travel.findByPk(travelId);

  if (!travel) {
    return res.status(404).json({ message: 'Viaje no encontrado' });
  }

  const documents = await Document.findAll({
    where: { travelId, section }
  });

  const pdfBuffer = await generateSectionPdf({
    title: `${section.toUpperCase()} - ${travel.name}`,
    fields: req.body,
    documents: documents.map((doc) => ({ id: doc.id, title: doc.title }))
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${section}-${travelId}.pdf"`);
  res.send(pdfBuffer);
});

module.exports = router;
