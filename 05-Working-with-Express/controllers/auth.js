const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

//here i will set my user data and isLoggedIn 
exports.postLogin = (req, res, next) => {
  User.findById("66dc6a8ca269a15d09fda59b") // Assuming you're retrieving the same user
    .then((user) => {
      req.session.isLoggedIn = true;  //This line sets a isLoggedIn property in the session object to true. This indicates that the user is now authenticated and logged in.
      req.session.user = user; //The entire user object is stored in the session.
      req.session.save((err)=> {
        console.log(err);
        res.redirect("/"); //here you are done saving the session data then it will redirect
      })
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
