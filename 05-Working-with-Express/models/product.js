const fs = require("fs");
const path = require("path");
const rootDir = require("../util/path");
const Cart = require("./cart");

const p = path.join(rootDir, "data", "products.json"); // Construct the file path

const getProductsFromFile = (cb) => {
  fs.readFile(p, (error, fileContent) => {
    if (error) {
      return cb([]);
    } else {
        cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  //add new product/update existing product => in product.json
  save() {
    // products.push(this); //this refers to the current instance of the class.// Store the entire Product instance
    // products.push(this.title); // Store only the title property
    getProductsFromFile(products => {
      if(this.id){
        const existingProductIndex = products.findIndex(curVal => curVal.id === this.id);
        const updateProduct = [...products];
        updateProduct[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updateProduct), err => {
          console.log(err);
        })
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (error) => {
          console.log("error",error);
        });
      }
    });
  }

  //delete product
  static deleteById(id) {
    getProductsFromFile(products => {
      const product = products.find(prod=> prod.id === id);
      const updatedProduct = products.filter((ele) => ele.id !== id); 
      fs.writeFile(p, JSON.stringify(updatedProduct), err => {
        if(!err) {
          Cart.deleteProduct(id, product.price)
        }
      });
    })
  }

  //fetch all product from product.json
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  // fetch single product through id from product.json
  static findById(id, cb) {
    getProductsFromFile(products => {
      // this is synchonous function
      const product = products.find((ele) => { return ele.id === id});  
      cb(product)
    })
  }
};
