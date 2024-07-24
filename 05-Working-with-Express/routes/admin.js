const path = require('path'); //it provide the utilities for working with file and directory paths.
const express = require('express');
const rootDir = require('../util/path');
const adminControllers = require('../controllers/admin');

const router = express.Router(); //This Router is like a mini express app tied to the other express app or pluggable into other express app.


// /admin/add-product => GET
router.get('/add-product',  adminControllers.getAddProductPage);

// /admin/products => GET
router.get('/products', adminControllers.getProducts);

// /admin/product => POST
router.post('/add-product', adminControllers.postAddProductPage);

// exports.routes = router;
// exports.products = products;

module.exports = router;