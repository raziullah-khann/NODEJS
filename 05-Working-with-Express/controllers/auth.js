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

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Sign Up",
    isAuthenticated: false,
  });
}

exports.postSignup = (req, res, next) => {
  const {email, password, confirmPassword} = req.body;
  //one step we want to do before we create a new user,  first we check user is already exist or in my database bcs i don't want duplicate email
  User.findOne({email: email}).then(userDoc => {
    if(userDoc){
      return res.redirect("/signup");
    }
    const user = new User({
      email: email,
      password: password,
      cart: { items: []},
    });
    return user.save();
  }).then(result => {
    res.redirect("/login");
  }).catch(err => {
    console.log(err);
  });
}

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
