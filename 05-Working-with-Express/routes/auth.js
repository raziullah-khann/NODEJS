const express = require("express");
const authControllers = require("../controllers/auth");
const router = express.Router(); //this is mini express app tied to the other express app

router.get("/login", authControllers.getLogin);

module.exports = router;