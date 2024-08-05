const Products = require("../models/product");
const Cart = require("../models/cart");

// fetch all product
exports.getProducts = (req, res, next) => {
  // console.log(adminData.products);
  // res.sendFile(path.join(__dirname, '..', 'views', 'shop.html'));
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  Products.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "All Products",
        path: "/products",
        // hasProducts: products.length > 0,  this is for handlebars
        // activeShop: true,
        // productCSS: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// fetch single product
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // console.log("productID", prodId);
  Products.findById(prodId)
    .then(([product]) => {
      // console.log(product);
      res.render("shop/product-detail", {
        product: product[0],
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Products.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  Cart.getCartProducts((cart) => {
    //Retrieve the Cart Data:
    Products.fetchAll((products) => {
      //Retrieve All Products:
      //Match Cart Products with All Products
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (curVal) => curVal.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      //Render the Cart Page
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
        totalPrice: cart.totalPrice,
      });
    });
  });
};

// add-product.ejs file me add to product button pe click krne ke baad /cart route pe req.body me product id mil jayega hidden input field me data bhej diya hai waha se
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Products.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
  // res.render('shop/cart', {path: '/cart', pageTitle: 'Your Cart'})
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Products.findById(productId, (product) => {
    Cart.deleteProduct(productId, product.price);
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", { path: "/orders", pageTitle: "Your Orders" });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", { path: "/checkout", pageTitle: "Checkout" });
};
