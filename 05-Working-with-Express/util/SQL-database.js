// const mysql = require("mysql2");

// //returns a connection pool object. This object has methods to get a
// // connection from the pool, execute queries directly, release connections back to the pool, etc.
// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "node-complete",
//   password: "123456",
// });

// module.exports = pool.promise();


//here Sequelize connection code 
const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "123456", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;