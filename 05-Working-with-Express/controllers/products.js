const Products = require('../models/product');

exports.getAddProductPage = (req, res, next)=>{
    // res.send('<form action="/admin/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    res.render('admin/add-product', {pageTitle: 'Add Product', path: '/admin/add-product', productCSS: true, activeAddProduct: true});
};


exports.postAddProductPage = (req, res, next)=> {
    // console.log(req.body); 
    const product = new Products(req.body.title);
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    // console.log(adminData.products);
    // res.sendFile(path.join(__dirname, '..', 'views', 'shop.html'));
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    Products.fetchAll(products => {  //it should execute once it's done we get product
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true,
      });
    }); 
  }