require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const helmet = require('helmet');
const compression = require('compression');

const MONGODB_URI = process.env.MONGODB_URI;

const User = require("./models/user");

const app = express(); //initialize express

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "session",
});
const csrfProtection = csrf(); //Create a CSRF protection middleware instance

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "images"));
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.set("view engine", "ejs"); //Setting the View Engine => responsible for rendering dynamic HTML based on templates and data.
app.set("views", "views"); //Setting the Views Directory =>

const adminRoutes = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");
const pageNotFound = require("./controllers/error");

app.use(helmet());
app.use(compression());

//Both are built-in middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"));
app.use(express.static(path.join(__dirname, "public"))); //__dirname is a global variable in Node.js that represents the current directory path of the current module
app.use(express.static(path.join(__dirname, "images")));

app.use(
  session({
    secret: "my secret", // Secret key for signing the session ID cookie
    resave: false, // Do not resave the session if it's not modified
    saveUninitialized: false, // Do not save uninitialized sessions
    store: store,
  })
);
app.use(csrfProtection); // Enable the CSRF protection middleware globally
app.use(flash()); //Flash middleware must be added after session middleware

// Make CSRF token available to all views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  // throw new Error("Sync Dummy!");
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoute);
app.use(authRoute);
app.get("/500", pageNotFound.get500Page);
app.use(pageNotFound.get404Page);
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session ? req.session.isLoggedIn : false,
  });
  // res.redirect("/500");
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    console.log("Connected to MongoDB");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
