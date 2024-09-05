const Sequelize =  require("sequelize");

const sequelize = require("../../util/mongodbconnection");

const OrderItem = sequelize.define('orderItem', {
  id:{
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  }, 
  quantity: Sequelize.INTEGER
});

module.exports = OrderItem;