const Sequelize = require("sequelize");

const sequelize = new Sequelize("nodedb", "root", "admin2255", {
  dialect: "mysql",
  host: "localhost",
  port: 3306,
});

module.exports = sequelize;
