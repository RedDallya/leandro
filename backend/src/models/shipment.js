const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Shipment = sequelize.define(
  'Shipment',
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
    channel: {
      type: DataTypes.ENUM('whatsapp', 'email'),
      allowNull: false
    },
    recipient: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('enviado', 'error'),
      allowNull: false,
      defaultValue: 'enviado'
    },
    createdBy: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  },
  {
    tableName: 'shipments',
    underscored: true
  }
);

module.exports = Shipment;
