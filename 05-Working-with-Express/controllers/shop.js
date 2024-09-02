const Product = require("../models/product");
// const Cart = require("../models/cart");

// fetch all product
exports.getProducts = (req, res, next) => {
  // console.log(adminData.Product);
  // res.sendFile(path.join(__dirname, '..', 'views', 'shop.html'));
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  Product.fetchAll()
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

// fetch single product
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // console.log("productID", prodId);
  // Product.findAll({where: {id:prodId}}).then().catch()
  Product.findById(prodId)
    .then((product) => {
      // console.log("single Product",product);
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((Product) => {
      res.render("shop/index", {
        prods: Product,
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
    .getCart()
    .then((products) => {
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
      res.redirect("/cart")
    })
    .catch((err) => {
      console.log(err);
    });
  // let fetchCart;
  // let newQuantity = 1;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchCart = cart;
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then((products) => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }
  //     if (product) {
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return product;
  //     }
  //     return Product.findByPk(prodId);
  //   })
  //   .then((product) => {
  //     return fetchCart.addProduct(product, {
  //       through: { quantity: newQuantity },
  //     });
  //   })
  //   .then(() => {
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      // console.log("cart ko get kiya hai", cart);
      return cart.getProducts({
        where: {
          id: productId,
        },
      });
    })
    .then((products) => {
      const product = products[0];
      // console.log("product", product);
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      // console.log("my cart products here!", products);
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProduct(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .then((result) => {
      return fetchCart.setProducts(null);
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
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
