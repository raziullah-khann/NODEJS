const { mongoose } = require("mongoose");
const Product = require("../models/product");
const { validationResult } = require("express-validator");
const fileHelper = require("../util/file");
const path = require("path");

exports.getAddProductPage = (req, res, next) => {
  // res.send('<form action="/admin/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddProductPage = (req, res, next) => {
  //i do extract my title, imageUrl, price and description and store in a constant bcs i never overwrite the value in this function
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMessage: "Attached file is not an image!",
      validationErrors: [],
    });
  }
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  console.log("add krte time image object hai ",image);
  const imageUrl = image.filename; // Use relative path
  console.log("add krte time image filename hai ",imageUrl);
  const product = new Product({
    // _id: new mongoose.Types.ObjectId("6736193ee9f91850f79be2d0"),//create duplicate id
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user._id,
  });
  // Product.create({
  // })
  product
    .save()
    .then((result) => {
      console.log("Product saved successfully:", result);
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      // return res.status(500).render("admin/edit-product", {
      //   pageTitle: "Add Product",
      //   path: "/admin/add-product",
      //   editing: false,
      //   hasError: true,
      //   product: {
      //     title: title,
      //     imageUrl: imageUrl,
      //     price: price,
      //     description: description,
      //   },
      //   errorMessage: "Database operation failed, please try again.",
      //   validationErrors: [],
      // });
      // res.redirect("/500");
      // console.error("Error saving product:", err); // Log the actual error
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

//get update product
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  // console.log("editMode", editMode);  //true
  if (!editMode) {
    return res.redirect("/");
  }
  const productId = req.params.productId;
  if (!productId) {
    return res.redirect("/");
  }
  Product.findById(productId)
    // Products.findByPk(productId)
    .then((product) => {
      console.log("product", product);
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

//post updateProduct
exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const image = req.file;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDescription,
        _id: productId,
      },
      errorMessage: "Attached file is not an image!",
      validationErrors: [],
    });
  }

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      if (image) {
        console.log("imagePath hai update karte time ka", product.imageUrl);
      
        // Check if product.imageUrl is undefined or null
        if (!product.imageUrl) {
          console.error("product.imageUrl is undefined or invalid.");
          throw new Error("Invalid imageUrl for the product.");
        }
      
        try {
          const updatePath = path.join(__dirname, "../", "images", product.imageUrl);
          console.log("Resolved update path:", updatePath);
      
          // Attempt file deletion
          fileHelper.deleteFile(updatePath);
          console.log("File deletion attempted for path:", updatePath);
      
          product.imageUrl = image.filename; // Save relative path
        } catch (err) {
          console.error("Error occurred in the update image logic:", err.message);
          console.error(err.stack); // Log the stack trace for more details
          throw err; // Trigger the main catch block
        }
      }
      return product.save().then((result) => {
        console.log("Updated Product is", result);
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      console.log('error hai jab hum update kr rhe hai')
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

//get admin product
exports.getProducts = (req, res, next) => {
  // req.user.getProducts()
  Product.find({ userId: req.user._id })
    // .select("title price -_id")
    // .populate("userId", "name")
    .then((products) => {
      // console.log("admin products", products);
      //it should execute once it's done we get product
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

//Delete product
exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return next(new Error("Product not found!"));
      }
      const currentPath = path.join(__dirname,"../","images",product.imageUrl);
      console.log("current path hai ",currentPath);
      fileHelper.deleteFile(currentPath);
      return Product.deleteOne({ _id: productId, userId: req.user._id });
    })
    .then(() => {
      console.log("Destroy Product!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
