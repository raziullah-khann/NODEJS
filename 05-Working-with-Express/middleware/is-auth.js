require("dotenv").config();

const adminEmails = process.env.ADMINS.split(",");

exports.isAuth = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login"); // Redirect if user is not authenticated.
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (!req.session.user || !adminEmails.includes(req.session.user.email)) {
    return res.status(403).render("403", {
      pageTitle: "Forbidden",
      path: "/403",
    });
  }
  next();
};
