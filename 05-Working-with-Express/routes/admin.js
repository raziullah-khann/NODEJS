const path = require('path'); //it provide the utilities for working with file and directory paths.
const express = require('express');
const rootDir = require('../util/path');
const productsControllers = require('../controllers/products');

const router = express.Router(); //This Router is like a mini express app tied to the other express app or pluggable into other express app.


// /admin/add-product => GET
router.get('/add-product',  productsControllers.getAddProductPage);

// /admin/product => POST
router.post('/add-product', productsControllers.postAddProductPage);

// exports.routes = router;
// exports.products = products;

module.exports = router;