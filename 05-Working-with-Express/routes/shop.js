const express = require("express");
const path = require("path"); //it provide the utilities for working with file and directory paths.
const shopControllers = require('../controllers/shop');

//create router object
const router = express.Router(); //this is mini express app tied to the other express app

// next(); //Allow the request to continue to the next middleware in line
router.get("/", shopControllers.getIndex);

router.get("/products", shopControllers.getProducts);

router.get("/cart", shopControllers.getCart);

router.get("/checkout", shopControllers.getCheckout);

module.exports = router;
