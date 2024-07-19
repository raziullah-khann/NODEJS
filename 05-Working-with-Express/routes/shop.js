const express = require("express");
const path = require("path"); //it provide the utilities for working with file and directory paths.
const rootDir = require("../util/path");
const adminData = require("./admin");

//create router object
const router = express.Router(); //this is mini express app tied to the other express app

// next(); //Allow the request to continue to the next middleware in line
router.get("/", (req, res, next) => {
  // console.log(adminData.products);
  // res.sendFile(path.join(__dirname, '..', 'views', 'shop.html'));
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  const products = adminData.products;
  res.render("shop", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  });
});

module.exports = router;
