const Sequelize = require("sequelize");

const connection = new Sequelize(
             "guiaperg",
             "root", "",{
    host:    "localhost",
    dialect: "mysql"
});

module.exports = connection;