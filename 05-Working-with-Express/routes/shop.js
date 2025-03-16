const express = require("express");
const path = require("path"); //it provide the utilities for working with file and directory paths.
const shopControllers = require('../controllers/shop');
const { isAuth } = require('../middleware/is-auth');

//create router object
const router = express.Router(); //this is mini express app tied to the other express app

// next(); //Allow the request to continue to the next middleware in line
//Home page
router.get("/", shopControllers.getIndex);

//get product list
router.get("/products", shopControllers.getProducts);

//get product details
router.get("/products/:productId", shopControllers.getProduct);

//get acart page
router.get("/cart", isAuth, shopControllers.getCart);

//user click add to cart button then send product id on server
router.post("/cart", isAuth, shopControllers.postCart);

//if user click on delete button on cart page then that product deleted
router.post("/cart-delete-item", isAuth, shopControllers.postCartDeleteProduct);

//
router.get("/checkout", isAuth, shopControllers.getCheckout);

router.get("/checkout/success", isAuth, shopControllers.getCheckoutSuccess);

router.get("/checkout/cancel", isAuth, shopControllers.getCheckout);

//if we click on OrderNow button in cart then execute this middleware function
// router.post("/create-order", isAuth, shopControllers.postOrder);

//if user get the orders path then it will be execute
router.get("/orders", isAuth, shopControllers.getOrders);

router.get("/orders/:orderId", isAuth, shopControllers.getInvoice);

module.exports = router;
