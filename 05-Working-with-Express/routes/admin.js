const express = require("express");
const adminControllers = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator");
const { upload } = require("../util/cloudinary-config"); // Import Multer setup for Cloudinary

const router = express.Router(); //This Router is like a mini express app tied to the other express app or pluggable into other express app.

// /admin/add-product => GET
router.get("/add-product", isAuth, adminControllers.getAddProductPage);

// /admin/products => GET, fetch all product from product model with edit and delete button
router.get("/products", isAuth, adminControllers.getProducts);

// /admin/product => POST,  to get the req.body of add-product body
router.post(
  "/add-product",
  upload.single("image"), // Use Multer middleware for image uploads
  isAuth,
  [
    body("title", "Title must be atleast 3 character")
      .isString()
      .isLength({ min: 3 })
      .trim(),
    // body("imageUrl", "imageUrl must require and valid url").isURL(),
    body("price", "price must be number").isFloat(),
    body("description", "description must require atleast 5 character")
      .isLength({ min: 5 })
      .trim(),
  ],
  adminControllers.postAddProductPage
);

router.get("/edit-product/:productId", isAuth, adminControllers.getEditProduct);

// /admin/edit-product => POST,  to get the req.body of edit-product body
router.post(
  "/edit-product",
  upload.single("image"), // Optional image update
  [
    body("title", "Title must be atleast 3 character")
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("price", "price must be number").isFloat(),
    body("description", "description must require atleast 5 character")
      .isLength({ min: 5 })
      .trim(),
  ],
  isAuth,
  adminControllers.postEditProduct
);

// router.post("/delete-product", isAuth, adminControllers.postDeleteProduct);

router.delete("/delete-product/:productId", isAuth, adminControllers.deleteProduct);

module.exports = router;
