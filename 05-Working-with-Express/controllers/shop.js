const fs = require("fs");
const path = require("path");

const PDFDocument = require("pdfkit");

const Product = require("../models/product");
const Order = require("../models/order");

const ITEMS_PER_PAGE = 2;

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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  const page = req.query.page;
  Product.find()
  .skip((page-1) * ITEMS_PER_PAGE)
  .limit(ITEMS_PER_PAGE)
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId") // Populate the productId with the actual Product document and returns a Promise
    .then((user) => {
      //here user is req.user
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .removeFromCart(productId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      //here user is req.user
      // console.log(user.cart.items);
      const products = user.cart.items.map((i) => {
        return { product: { ...i.productId._doc }, quantity: i.quantity }; //i.productId refers to a Product document.
      });
      const order = new Order({
        products: products,
        user: {
          userId: req.user._id,
          email: req.user.email,
        },
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      // console.log(orders);
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("User have no order"));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorize user!"));
      }
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join(
        __dirname,
        "../data",
        "invoices",
        invoiceName
      );
      const pdfDoc = new PDFDocument(); //create a pdf
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${invoiceName}"`
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath)); //give path where we write anything
      pdfDoc.pipe(res);  //send response piece by piece to the client

      pdfDoc.fontSize(20).text("Invoice", {underline: true}) // actual data
      pdfDoc.text("----------------------------------------------------------------------");
      let totalPrice = 0;
      order.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc.fontSize(14).text(prod.product.title + ' - ' + prod.quantity + ' x ' + ' Rs ' + prod.product.price);
      })
      pdfDoc.text("-----------------------");
      pdfDoc.fontSize(20).text("Total price: Rs " + totalPrice);
      pdfDoc.end(); // signals that no more content will be added. 


      // console.log(invoicePath);
      // const stream = fs.createReadStream(invoicePath);
      // res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     `inline; filename="${invoiceName}"`
      //   );
      // stream.pipe(res);
      
    //   fs.readFile(invoicePath, (err, data) => {
    //     if (err) {
    //       return next(err);
    //     }
    //     res.setHeader("Content-Type", "application/pdf");
    //     res.setHeader(
    //       "Content-Disposition",
    //       `inline; filename="${invoiceName}"`
    //     );
    //     res.send(data);
    //   });
    })
    .catch((err) => {
      // console.log("error hai", err);
      return next(err);
    });
};