module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login"); // Redirect if user is not authenticated.
  }
  req.user = req.session.user;  // Attach user data to the request
  next();
};
