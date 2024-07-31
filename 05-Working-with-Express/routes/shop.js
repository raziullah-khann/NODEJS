const express = require("express");
const path = require("path"); //it provide the utilities for working with file and directory paths.
const shopControllers = require('../controllers/shop');

//create router object
const router = express.Router(); //this is mini express app tied to the other express app

// next(); //Allow the request to continue to the next middleware in line
router.get("/", shopControllers.getIndex);

//get product list
router.get("/products", shopControllers.getProducts);

//get product details
router.get("/products/:productId", shopControllers.getProduct);

//get acart page
router.get("/cart", shopControllers.getCart);

//user click add to cart button then send product id on server
router.post("/cart", shopControllers.postCart);

router.get("/orders", shopControllers.getOrders);

router.get("/checkout", shopControllers.getCheckout);

module.exports = router;
