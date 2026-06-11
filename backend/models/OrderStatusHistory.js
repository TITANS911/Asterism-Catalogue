const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderStatusHistory = sequelize.define('OrderStatusHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  event_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  field_name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  from_value: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  to_value: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  source: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'system'
  },
  created_by_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'order_status_histories',
  timestamps: false
});

module.exports = OrderStatusHistory;
