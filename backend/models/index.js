const sequelize = require('../config/database');

const User = require('./User');
const UserGroup = require('./UserGroup');
const UserProfile = require('./UserProfile');
const Product = require('./Product');
const ProductCategory = require('./ProductCategory');
const ProductVariant = require('./ProductVariant');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const OrderStatusHistory = require('./OrderStatusHistory');
const InventoryLog = require('./InventoryLog');
const SiteSetting = require('./SiteSetting');

User.belongsTo(UserGroup, { foreignKey: 'user_group_id', as: 'group' });
UserGroup.hasMany(User, { foreignKey: 'user_group_id', as: 'users' });

User.hasOne(UserProfile, { foreignKey: 'user_id', as: 'profile' });
UserProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Product.belongsTo(ProductCategory, { foreignKey: 'category_id', as: 'category' });
ProductCategory.hasMany(Product, { foreignKey: 'category_id', as: 'products' });

Product.hasMany(ProductVariant, { foreignKey: 'product_id', as: 'variants' });
ProductVariant.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });

Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'orderItems' });

Order.hasMany(OrderStatusHistory, { foreignKey: 'order_id', as: 'status_histories' });
OrderStatusHistory.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

module.exports = {
  sequelize,
  User,
  UserGroup,
  UserProfile,
  Product,
  ProductCategory,
  ProductVariant,
  Order,
  OrderItem,
  OrderStatusHistory,
  InventoryLog,
  SiteSetting
};
