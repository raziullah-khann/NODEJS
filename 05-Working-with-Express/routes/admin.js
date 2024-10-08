const path = require('path'); //it provide the utilities for working with file and directory paths.
const express = require('express');
const rootDir = require('../util/path');
const adminControllers = require('../controllers/admin');
const isAuth = require("../middleware/is-auth");

const router = express.Router(); //This Router is like a mini express app tied to the other express app or pluggable into other express app.


// /admin/add-product => GET
router.get('/add-product', isAuth, adminControllers.getAddProductPage);

// /admin/products => GET, fetch all product from product model with edit and delete button
router.get('/products', isAuth, adminControllers.getProducts);

// /admin/product => POST,  to get the req.body of add-product body
router.post('/add-product', isAuth, adminControllers.postAddProductPage);

router.get('/edit-product/:productId', isAuth, adminControllers.getEditProduct);

// /admin/edit-product => POST,  to get the req.body of edit-product body
router.post('/edit-product', isAuth, adminControllers.postEditProduct);

router.post('/delete-product', isAuth, adminControllers.postDeleteProduct);

// exports.routes = router;
// exports.products = products;

module.exports = router;