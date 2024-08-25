const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const mongoConnect = require('./util/database').mongoConnect;

const app = express(); //initialize express

app.set("view engine", "ejs"); //Setting the View Engine => responsible for rendering dynamic HTML based on templates and data.
app.set("views", "views"); //Setting the Views Directory =>

const adminRoutes = require("./routes/admin");
const shopRoute = require("./routes/shop");
const pageNotFound = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public"))); //__dirname is a global variable in Node.js that represents the current directory path of the current module

// This middleware will run for every incoming request
app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then((user) => {  //this user is not normal javascript object this is sequelize object here available all sequelize method like destroy etc.
  //     req.user = user; //Making User Data Available Globally: here we can simply add new field to our request object
  //     next();
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  next();
});
  
app.use("/admin", adminRoutes);
app.use(shopRoute);

app.use(pageNotFound.get404Page);

mongoConnect(()=>{
  app.listen(3000);
})