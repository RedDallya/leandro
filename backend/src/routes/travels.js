const express = require('express');
const { body, validationResult } = require('express-validator');

const authorize = require('../middleware/auth');
const { Travel, Document } = require('../models');

const router = express.Router();

router.get('/', authorize('admin_superior', 'admin', 'operador', 'lector'), async (req, res) => {
  const travels = await Travel.findAll({
    include: [{ model: Document, as: 'documents' }]
  });
  res.json(travels);
});

router.post(
  '/',
  authorize('admin_superior', 'admin', 'operador'),
  [body('clientId').isInt(), body('name').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const travel = await Travel.create(req.body);
    res.status(201).json(travel);
  }
);

router.get('/:id', authorize('admin_superior', 'admin', 'operador', 'lector'), async (req, res) => {
  const travel = await Travel.findByPk(req.params.id, {
    include: [{ model: Document, as: 'documents' }]
  });

  if (!travel) {
    return res.status(404).json({ message: 'Viaje no encontrado' });
  }

  return res.json(travel);
});

module.exports = router;
