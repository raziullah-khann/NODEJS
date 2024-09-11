const Product = require("../models/product");
const Order = require("../models/order");

// fetch all product
exports.getProducts = (req, res, next) => {
  // console.log(adminData.Product);
  // res.sendFile(path.join(__dirname, '..', 'views', 'shop.html'));
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  Product.find()
    .then((Product) => {
      res.render("shop/product-list", {
        prods: Product,
        pageTitle: "All Product",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log("Error fetching Product:", err);
    });
};

// fetch single product for product details
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findOne({ _id: prodId })
    .then((product) => {
      console.log("single Product", product);
      res.render("shop/product-detail", {
        product: product,
        pageTitle: "Product-Detail",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((product) => {
      console.log(product);

      res.render("shop/index", {
        prods: product,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId") // Populate the productId with the actual Product document and returns a Promise
    .then((user) => { //here user is req.user
      // console.log("get cart product", user.cart.items);
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        // totalPrice: cart.totalPrice,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// add-product.ejs file me add to product button pe click krne ke baad /cart route pe req.body me product id mil jayega hidden input field me data bhej diya hai waha se
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product); //here addTocart return promise
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .removeFromCart(productId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => { //here user is req.user
      // console.log(user.cart.items);
      const products = user.cart.items.map((i) => {
        return { product: {...i.productId._doc}, quantity: i.quantity };  //i.productId refers to a Product document.
      });
      const order = new Order({
        products: products,
        user: {
          userId: req.user._id,
          name: req.user.name,
        },
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    }).then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({"user.userId": req.user._id})
    .then((orders) => {
      // console.log(orders);
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
