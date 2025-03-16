require("dotenv").config();
const path = require("path");
const fs = require('fs');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
// const csrf = require("csurf");
const flash = require("connect-flash");
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');


const MONGODB_URI = process.env.MONGODB_URI;

const PORT = process.env.PORT || 3000;

const User = require("./models/user");

const app = express(); //initialize express

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "session",
  expires: 1000 * 60 * 60 * 24, // 1 day
  autoRemove: "interval",
  autoRemoveInterval: 10, // Every 10 minutes
});


app.set("view engine", "ejs"); //Setting the View Engine => responsible for rendering dynamic HTML based on templates and data.
app.set("views", "views"); //Setting the Views Directory =>

const adminRoutes = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");
const pageNotFound = require("./controllers/error");

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(helmet()); //add some extra headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "https://nodejs-3-ddnt.onrender.com"], // Allow your Render app
        scriptSrc: [
          "'self'",
          "'unsafe-inline'", // Allows inline scripts
          "https://js.stripe.com",
          "https://m.stripe.network",
          "https://nodejs-3-ddnt.onrender.com", // Allow Render scripts
        ],
        styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles
        imgSrc: [
          "'self'",
          "https://res.cloudinary.com", // Allow Cloudinary images
          "https://nodejs-3-ddnt.onrender.com", // Allow images from Render
        ],
        connectSrc: [
          "'self'",
          "https://api.blocksly.org",
          "https://api.stripe.com",
          "https://nodejs-3-ddnt.onrender.com", // Allow API requests to your Render app
        ],
        frameSrc: [
          "'self'",
          "https://js.stripe.com", // Required for Stripe checkout
          "https://nodejs-3-ddnt.onrender.com", // Allow embedding frames from Render
        ],
      },
    },
  })
);


app.use(compression()); //compress size of css and js file code 
app.use(morgan('combined', {stream: accessLogStream})); //how to log data manage

//Both are built-in middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // For handling JSON requests
app.use(express.static(path.join(__dirname, "public"))); //__dirname is a global variable in Node.js that represents the current directory path of the current module

app.use(
  session({
    secret: "my secret", // Secret key for signing the session ID cookie
    resave: false, // Do not resave the session if it's not modified
    saveUninitialized: false, // Do not save uninitialized sessions
    store: store,
  })
);
app.use(flash()); //Flash middleware must be added after session middleware
// const csrfProtection = csrf(); //Create a CSRF protection middleware instance
// app.use(csrfProtection); // Enable the CSRF protection middleware globally

// Make CSRF token available to all views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.isAdmin = req.session.isAdmin; // ✅ Pass isAdmin to views
  // res.locals.csrfToken = req.csrfToken();
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
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
  