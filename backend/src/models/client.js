const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Client = sequelize.define(
  'Client',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    documentType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    documentNumber: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'clients',
    underscored: true
  }
);

module.exports = Client;
