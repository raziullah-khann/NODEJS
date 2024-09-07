const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

module.exports = model("User", userSchema);

// const mongodb = require("mongodb");

// const getDb = require("../util/mongodbconnection").getDb;

// class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart; //{items: []}
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   //here start cart
//   addToCart(product) {
//     //find valid index or -1
//     const cartProductIndex = this.cart.items.findIndex(
//       (cartProduct) =>
//         cartProduct.productId.toString() === product._id.toString()
//     );
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items]; //here i am doing shallow copy [{},{}...]

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }
//     const updatedCart = {
//       items: updatedCartItems,
//     };
//     const db = getDb();
//     //keep everything as it is, I dont want to change the user name or anything i will just set cart equal to updated cart, that is it
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   // it return cart products
//   getCart() {
//     const db = getDb();
//     //here we get products ids array use to fetch products bcs i am not store products detail in cart store only product id.
//     const productIds = this.cart.items.map((i) => {
//       return i.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         //i have array of products here fresh from the database
//         return products.map((p) => {
//           //here i transform of each and every products and return new array including qty property
//           return {
//             ...p,
//             quantity: this.cart.items.find((i) => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity,
//           };
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   deleteItemFromCart(prodId) {
//     const updatedCartItems = this.cart.items.filter(
//       (p) => p.productId.toString() !== prodId.toString()
//     );
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   //there are two one-to-many relationships: 1. Order and Products (One-to-Many) => Each order can contain multiple products.
//   //  2. Order and User (One-to-Many) => Each user can place multiple orders.
//   addOrder() {
//     const db = getDb(); // here i reach out my database client and reach out new collection orders
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           //now i have products info and user info and here i use one to many relation one user has many orders
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this._id),
//             name: this.username,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] }; // here i clear the cart in user object and also i want to clear in a database
//         return db.collection("users").updateOne(
//           { _id: new mongodb.ObjectId(this._id) },
//           { $set: { cart: { items: [] } } } // clear the cart in database after order cart clear
//         );
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   getOrders() {
//     const db = getDb();
//     return db.collection("orders").find({"user._id": new mongodb.ObjectId(this._id)}).toArray();
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new mongodb.ObjectId(userId) })
//       .then((user) => {
//         console.log(user);
//         return user;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }

// module.exports = User;
