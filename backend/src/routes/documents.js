const express = require('express');
const authorize = require('../middleware/auth');
const { Document, Client, Travel } = require('../models');
const storageService = require('../services/storageService');

module.exports = (upload) => {
  const router = express.Router();

  router.get(
    '/:id',
    authorize('admin_superior', 'admin', 'operador', 'lector'),
    async (req, res) => {
      const document = await Document.findByPk(req.params.id);
      if (!document) {
        return res.status(404).json({ message: 'Documento no encontrado' });
      }

      const url = storageService.getSignedUrl(document.storageKey);
      return res.json({ ...document.toJSON(), url });
    }
  );

  router.post(
    '/upload',
    authorize('admin_superior', 'admin', 'operador'),
    upload.single('archivo'),
    async (req, res) => {
      const { clientId, travelId, section, title, metadata } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: 'Archivo requerido' });
      }

      const client = await Client.findByPk(clientId);
      if (!client) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }

      const travel = travelId ? await Travel.findByPk(travelId) : null;
      if (travelId && !travel) {
        return res.status(404).json({ message: 'Viaje no encontrado' });
      }

      const { key, hash } = await storageService.uploadFile({
        clientId,
        travelId,
        section,
        fileBuffer: file.buffer,
        mimeType: file.mimetype,
        originalName: file.originalname
      });

      const document = await Document.create({
        clientId,
        travelId,
        section,
        title: title || file.originalname,
        storageKey: key,
        mimeType: file.mimetype,
        fileName: file.originalname,
        hash,
        metadata: metadata ? JSON.parse(metadata) : null,
        uploadedBy: req.user.id
      });

      res.status(201).json(document);
    }
  );

  return router;
};
