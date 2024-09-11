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

//if user click on delete button on cart page then that product deleted
router.post("/cart-delete-item", shopControllers.postCartDeleteProduct);

//if we click on OrderNow button in cart then execute this middleware function
router.post("/create-order", shopControllers.postOrder);

//if user get the orders path then it will be execute
router.get("/orders", shopControllers.getOrders);

module.exports = router;
