const fs = require("fs");
const path = require("path");
const rootDir = require("../util/path");
const {json} = require( "body-parser" );

const p = path.join(rootDir, "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    //Fetch previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      //Analyze the cart => find existing product
      const existingProductIndex = cart.products.findIndex(
        (currentProduct) => currentProduct.id === id
      ); //this allows me  to use that index to replace the item  in our cart products here.
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      //Add new product/ increse quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];  //Update Cart Products Array:
        cart.products[existingProductIndex] = updatedProduct; //The second line updates the cart.products array at the index of the existing product with the new updatedProduct
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + Number(productPrice);
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    //1. to get cart data
    fs.readFile(p, (err, fileContent) => {
      if(err){
        return;
      }
      const updatedCart = {...JSON.parse(fileContent)};
      //2. find the product which we want to delete
      const product = updatedCart.products.find(curVal => curVal.id === id);
      //3. fid the quantity of that product according to product we reduce totalPrice
      const productQty = product.qty;
      // delete that product
      updatedCart.products = updatedCart.products.filter(curVal => curVal.id !== id);
      //update cart totalPrice
      updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;
      // now update my cart.json file
      fs.writeFile(p, JSON.stringify(updatedCart), err => {
        console.log(err);
      })
    })
  }

  static getCartProducts(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if(err){
        return cb(null); 
      } else {
        cb(cart);
      }
    })
  }
};
