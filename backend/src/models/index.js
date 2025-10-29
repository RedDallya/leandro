const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user');
db.Client = require('./client');
db.Travel = require('./travel');
db.Document = require('./document');
db.Shipment = require('./shipment');

db.User.hasMany(db.Document, { foreignKey: 'uploadedBy', as: 'uploadedDocuments' });
db.Document.belongsTo(db.User, { foreignKey: 'uploadedBy', as: 'uploader' });

db.Client.hasMany(db.Travel, { foreignKey: 'clientId', as: 'travels' });
db.Travel.belongsTo(db.Client, { foreignKey: 'clientId', as: 'client' });

db.Travel.hasMany(db.Document, { foreignKey: 'travelId', as: 'documents' });
db.Document.belongsTo(db.Travel, { foreignKey: 'travelId', as: 'travel' });

db.Client.hasMany(db.Document, { foreignKey: 'clientId', as: 'clientDocuments' });
db.Document.belongsTo(db.Client, { foreignKey: 'clientId', as: 'client' });

db.User.hasMany(db.Shipment, { foreignKey: 'createdBy', as: 'shipments' });
db.Shipment.belongsTo(db.User, { foreignKey: 'createdBy', as: 'creator' });

db.Client.hasMany(db.Shipment, { foreignKey: 'clientId', as: 'shipments' });
db.Shipment.belongsTo(db.Client, { foreignKey: 'clientId', as: 'client' });

db.Travel.hasMany(db.Shipment, { foreignKey: 'travelId', as: 'shipments' });
db.Shipment.belongsTo(db.Travel, { foreignKey: 'travelId', as: 'travel' });

module.exports = db;
