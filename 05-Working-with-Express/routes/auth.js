const express = require("express");
const authControllers = require("../controllers/auth");
const router = express.Router(); //this is mini express app tied to the other express app

router.get("/login", authControllers.getLogin);

router.get("/signup", authControllers.getSignup);

router.post("/login", authControllers.postLogin);

router.post("/signup", authControllers.postSignup);

router.post("/logout", authControllers.postLogout);

router.get("/reset", authControllers.getReset);

router.post("/reset", authControllers.postReset);

router.get("/reset/:token", authControllers.getNewPassword);

module.exports = router;