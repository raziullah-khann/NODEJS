const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
// const {engine} = require('express-handlebars');
const db = require("./util/database");

const app = express(); //initialize express

// app.engine('hbs', engine({ extname: 'hbs', defaultLayout: 'main-layout', layoutsDir: path.join(__dirname, 'views/layouts') })); //first arguments engine name we can use any name second arg is initialize engine.
app.set("view engine", "ejs"); //Setting the View Engine => responsible for rendering dynamic HTML based on templates and data.
app.set("views", "views"); //Setting the Views Directory =>

const adminRoutes = require("./routes/admin");
const shopRoute = require("./routes/shop");
const pageNotFound = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public"))); //__dirname is a global variable in Node.js that represents the current directory path of the current module

app.use("/admin", adminRoutes);
app.use(shopRoute);

app.use(pageNotFound.get404Page);

app.listen(3000);
