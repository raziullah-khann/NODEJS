const express = require("express");
const authControllers = require("../controllers/auth");
const router = express.Router(); //this is mini express app tied to the other express app

router.get("/login", authControllers.getLogin);

router.post("/login", authControllers.postLogin);

router.post("/logout", authControllers.postLogout);

module.exports = router;