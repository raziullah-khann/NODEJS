require("dotenv").config();
const crypto = require("crypto");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTansport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

const transporter = nodemailer.createTransport(
  sendgridTansport({
    auth: {
      api_key: SENDGRID_API_KEY,
    },
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

//here i will set my user data and isLoggedIn
exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email: email }) // Assuming you're retrieving the same user
    .then((user) => {
      if (!user) {
        //findOne() => if user entered wrong email return null
        req.flash("error", "Invalid email or password!");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password) //this compare return promise taht resolves to true, if password match
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true; //This line sets a isLoggedIn property in the session object to true. This indicates that the user is now authenticated and logged in.
            req.session.user = user; //The entire user object is stored in the session.
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/"); //here you are done saving the session data then it will redirect
            });
          } else {
            req.flash("error", "Invalid email or password!");
            res.redirect("/login");
          }
        });
    })
    .catch((err) => {
      // Executes only if there is an error (e.g., database or bcrypt error).
      console.log(err);
      res.redirect("/login");
    });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Sign Up",
    errorMessage: message,
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  //one step we want to do before we create a new user, first we check user is already exist or not in my database bcs i don't want duplicate email
  const errors = validationResult(req);
  console.log("errors.array()", errors.array());
  if(!errors.isEmpty()){
    // console.log("errors.isEmpty()", errors.isEmpty()); //false
    console.log("errors", errors);
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Sign Up",
      errorMessage: errors.array()[0].msg,
    });
  }
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "E-mail exist already, please pick different one!");
        return res.redirect("/signup");
      }
      return bcrypt //This is an asynchronous task and therefore it will return promise that resolve with the hashed password.
        .hash(password, 12)
        .then((hashPassword) => {
          const user = new User({
            email: email,
            password: hashPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: "raziullahkhan25@gmail.com",
            subject: "SignUp succeesded!",
            html: "<h1>You Successfully signed up!</h1>",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        return transporter.sendMail({
          to: req.body.email,
          from: "raziullahkhan25@gmail.com",
          subject: "Password Reset!",
          html: `
        <p>You requested password reset</p>
        <p>Click this <a href="https://localhost:3000/reset/${token}">link</a> to set new password</p>
        `,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })  //This part checks if the resetTokenExpiration timestamp is greater than the current time, meaning the token has not yet expired.
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now()}, _id: userId}).then(user =>{
    resetUser = user;
    return bcrypt.hash(newPassword, 12);
  })
  .then(hashPassword => {
    resetUser.password = hashPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save();
  }).then(result => {
    res.redirect("/login");
  }).catch(err=> {
    console.log(err);
  })
}