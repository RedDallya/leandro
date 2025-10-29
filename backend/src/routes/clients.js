const express = require('express');
const { body, validationResult } = require('express-validator');

const authorize = require('../middleware/auth');
const { Client, Document, Travel } = require('../models');
const storageService = require('../services/storageService');

module.exports = (upload) => {
  const router = express.Router();

  router.get('/', authorize('admin_superior', 'admin', 'operador', 'lector'), async (_req, res) => {
    const clients = await Client.findAll({
      include: [
        { model: Document, as: 'clientDocuments' },
        { model: Travel, as: 'travels', include: [{ model: Document, as: 'documents' }] }
      ]
    });
    res.json(clients);
  });

  router.post(
    '/',
    authorize('admin_superior', 'admin', 'operador'),
    [body('firstName').notEmpty(), body('lastName').notEmpty(), body('email').isEmail()],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const client = await Client.create(req.body);
      res.status(201).json(client);
    }
  );

  router.get('/:id', authorize('admin_superior', 'admin', 'operador', 'lector'), async (req, res) => {
    const client = await Client.findByPk(req.params.id, {
      include: [
        { model: Document, as: 'clientDocuments' },
        { model: Travel, as: 'travels', include: [{ model: Document, as: 'documents' }] }
      ]
    });

    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    return res.json(client);
  });

  router.post(
    '/:id/documentos',
    authorize('admin_superior', 'admin', 'operador'),
    upload.single('archivo'),
    async (req, res) => {
      const client = await Client.findByPk(req.params.id);
      if (!client) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }

      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: 'Archivo requerido' });
      }

      const { key, hash } = await storageService.uploadFile({
        clientId: client.id,
        travelId: null,
        section: 'documentos_personales',
        fileBuffer: file.buffer,
        mimeType: file.mimetype,
        originalName: file.originalname
      });

      const document = await Document.create({
        clientId: client.id,
        travelId: null,
        section: 'documentos_personales',
        title: file.originalname,
        storageKey: key,
        mimeType: file.mimetype,
        fileName: file.originalname,
        hash,
        metadata: null,
        uploadedBy: req.user.id
      });

      res.status(201).json(document);
    }
  );

  return router;
};
