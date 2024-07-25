const fs = require("fs");
const path = require("path");
const rootDir = require("../util/path");

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
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    // products.push(this); //this refers to the current instance of the class.// Store the entire Product instance
    // products.push(this.title); // Store only the title property
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (error) => {
        console.log("error",error);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
};
