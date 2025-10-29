const express = require('express');
const { body, validationResult } = require('express-validator');

const authorize = require('../middleware/auth');
const { Shipment, Document } = require('../models');
const storageService = require('../services/storageService');
const notificationService = require('../services/notificationService');

const router = express.Router();

router.get('/', authorize('admin_superior', 'admin', 'operador', 'lector'), async (_req, res) => {
  const shipments = await Shipment.findAll();
  res.json(shipments);
});

router.post(
  '/',
  authorize('admin_superior', 'admin', 'operador'),
  [body('clientId').isInt(), body('channel').isIn(['whatsapp', 'email']), body('recipient').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { clientId, travelId, channel, recipient, subject, message, documentIds = [] } = req.body;
    const docs = await Document.findAll({ where: { id: documentIds } });

    const attachments = docs.map((doc) => ({
      filename: doc.fileName,
      path: storageService.getSignedUrl(doc.storageKey)
    }));

    let result;
    if (channel === 'whatsapp') {
      result = await notificationService.sendWhatsapp({ to: recipient, message, attachments });
    } else {
      result = await notificationService.sendEmail({ to: recipient, subject, message, attachments });
    }

    const shipment = await Shipment.create({
      clientId,
      travelId: travelId || null,
      channel,
      recipient,
      subject: subject || null,
      message: message || null,
      attachments: docs.map((doc) => ({ id: doc.id, title: doc.title })),
      status: result.success ? 'enviado' : 'error',
      createdBy: req.user.id
    });

    res.status(201).json(shipment);
  }
);

module.exports = router;
