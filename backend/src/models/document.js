const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Document = sequelize.define(
  'Document',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    clientId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    travelId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    section: {
      type: DataTypes.ENUM('cotizaciones', 'liquidaciones', 'vouchers', 'pasajes', 'itinerarios', 'documentos_personales'),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true
    },
    storageKey: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    uploadedBy: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  },
  {
    tableName: 'documents',
    underscored: true
  }
);

module.exports = Document;
