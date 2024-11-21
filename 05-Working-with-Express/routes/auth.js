const express = require("express");
const authControllers = require("../controllers/auth");
const { check, body } = require("express-validator");
const User = require("../models/user");
const router = express.Router(); //this is mini express app tied to the other express app

router.get("/login", authControllers.getLogin);

router.get("/signup", authControllers.getSignup);

router.post("/login", authControllers.postLogin);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        // if (value === "test@test.com") {
        //   throw new Error("This email address is forbidden");
        // }
        // return true;
        return User.findOne({email: value}).then(user => {
            if(user) {
                return Promise.reject("E-mail exist already, please pick different one!")
            };
        })
      }),
    body("password", "Please enter password only number and text atleat 5 characters.")
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error("Password have to match!");
        }
        return true;
    })  
  ],
  authControllers.postSignup
);

router.post("/logout", authControllers.postLogout);

router.get("/reset", authControllers.getReset);

router.post("/reset", authControllers.postReset);

router.get("/reset/:token", authControllers.getNewPassword);

router.post("/new-password", authControllers.postNewPassword);

module.exports = router;
