require('dotenv').config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");

const MONGODB_URI = process.env.MONGODB_URI;

const User = require("./models/user");

const app = express(); //initialize express

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "session",
});
const csrfProtection = csrf();

app.set("view engine", "ejs"); //Setting the View Engine => responsible for rendering dynamic HTML based on templates and data.
app.set("views", "views"); //Setting the Views Directory =>

const adminRoutes = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");
const pageNotFound = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public"))); //__dirname is a global variable in Node.js that represents the current directory path of the current module

app.use(
  session({
    secret: "my secret", // Secret key for signing the session ID cookie
    resave: false, // Do not resave the session if it's not modified
    saveUninitialized: false, // Do not save uninitialized sessions
    store: store,
  })
);
app.use(csrfProtection);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoute);
app.use(authRoute);
app.use(pageNotFound.get404Page);

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    console.log("Connected to MongoDB");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
