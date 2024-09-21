const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

//here i will set my user data and isLoggedIn
exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email: email }) // Assuming you're retrieving the same user
    .then((user) => {
      if (!user) { //findOne() => if user entered wrong email return null 
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
          }else{
            res.redirect("/login");
          }
        })
    })
    .catch((err) => { // Executes only if there is an error (e.g., database or bcrypt error).
      console.log(err);
      res.redirect("/login");
    });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Sign Up",
    isAuthenticated: false,
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  //one step we want to do before we create a new user, first we check user is already exist or not in my database bcs i don't want duplicate email
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/signup");
      }
      return bcrypt
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
