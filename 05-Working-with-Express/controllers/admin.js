const Products = require("../models/product");

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
  const product = new Products(null, title, imageUrl, price, description);
  product.save();
  res.redirect("/");
};

//get update product
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  // console.log("editMode", editMode);  //true
  if(!editMode){
    return res.redirect('/');
  }
  const productId = req.params.productId;
  if(!productId){
    return res.redirect('/');
  }
  Products.findById(productId, product => {
    console.log("product", product);
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product
    });
  })
};

//post updateProduct
exports.postEditProduct = (req,res, next) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedProduct = new Products(productId, updatedTitle, updatedImageUrl, updatedPrice, updatedDescription);
  updatedProduct.save();
  res.redirect('/admin/products');
};

//get admin product
exports.getProducts = (req, res, next) => {
  Products.fetchAll((products) => {
    //it should execute once it's done we get product
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};

//Delete product
exports.postDeleteProduct = (req,res, next) => {
  const productId = req.body.productId;
  Products.deleteById(productId);
  res.redirect('/admin/products');
};