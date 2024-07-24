const Products = require("../models/product");

exports.getAddProductPage = (req, res, next) => {
  // res.send('<form action="/admin/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    productCSS: true,
    activeAddProduct: true,
  });
};

exports.postAddProductPage = (req, res, next) => {
  // console.log(req.body);
  const product = new Products(req.body.title);
  product.save();
  res.redirect("/");
};

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
