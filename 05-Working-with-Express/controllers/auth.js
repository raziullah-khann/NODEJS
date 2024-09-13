exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.isLoggedIn
  });
};

//here i will get my login data
exports.postLogin = (req, res, next) => {
    req.isLoggedIn = true; 
    res.redirect("/")
  };
