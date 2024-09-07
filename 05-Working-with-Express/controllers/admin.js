const Product = require("../models/product");

exports.getAddProductPage = (req, res, next) => {
  // res.send('<form action="/admin/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProductPage = (req, res, next) => {
  // console.log(req.body);
  //i do extract my title, imageUrl, price and description and store in a constant bcs i never overwrite the value in this function
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({title: title, price: price, description: description, imageUrl: imageUrl});
  // Product.create({
  // })
    product.save().then((result) => {
      // console.log(result);
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
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
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//post updateProduct
exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price; 
  const updatedDescription = req.body.description;
  const product = new Product(updatedTitle, updatedPrice, updatedDescription, updatedImageUrl, productId);
  product.save()
    .then((result) => {
      console.log("updated product is", result);
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

//get admin product
exports.getProducts = (req, res, next) => {
  // req.user.getProducts()
  Product.find()
    .then((products) => {
      //it should execute once it's done we get product
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//Delete product
exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteById(productId)
    .then(() => {
      console.log("Destroy Product!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

