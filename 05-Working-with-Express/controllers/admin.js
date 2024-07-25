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
  //i do extract my title, imageUrl, price and description and store in a constant bcs i never overwrite the value in this function 
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
  const product = new Products(title, imageUrl, price, description);
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
