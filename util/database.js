const Sequelize = require("sequelize");

const sequelize = new Sequelize("nodedb", "root", "77pwd", {
  dialect: "mysql",
  host: "localhost",
  port: 3308,
});

module.exports = sequelize;
