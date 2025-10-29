const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const db = require('./models');
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const travelRoutes = require('./routes/travels');
const documentRoutes = require('./routes/documents');
const shipmentRoutes = require('./routes/shipments');
const pdfRoutes = require('./routes/pdf');

dotenv.config();

const app = express();
const upload = multer();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.json({
    name: 'Agencia de Turismo API',
    version: '1.0.0'
  });
});

app.use('/auth', authRoutes);
app.use('/clientes', clientRoutes(upload));
app.use('/viajes', travelRoutes);
app.use('/documentos', documentRoutes(upload));
app.use('/envios', shipmentRoutes);
app.use('/pdf', pdfRoutes);

const port = process.env.PORT || 4000;

db.sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`API escuchando en el puerto ${port}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('No fue posible iniciar la API', error);
  });

module.exports = app;
