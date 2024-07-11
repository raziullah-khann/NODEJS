const path = require('path'); //it provide the utilities for working with file and directory paths.
const express = require('express');
const rootDir = require('../util/path');

const router = express.Router(); //This Router is like a mini express app tied to the other express app or pluggable into other express app.

// /admin/add-product => GET
router.get('/add-product',  (req, res, next)=>{
    // res.send('<form action="/admin/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

// /admin/product => POST
router.post('/add-product', (req, res, next)=> {
    console.log(req.body); 
    res.redirect('/');
});

module.exports = router;
