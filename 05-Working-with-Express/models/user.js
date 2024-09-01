const mongodb = require("mongodb");

const getDb = require("../util/database").getDb;

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart; //{items: []}
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    //find valid index or -1
    // const cartProduct = this.cart.items.findIndex(
    //   (cartProduct) => cartProduct._id === product._id
    // );
    const updatedCart = {items: [{productId: new mongodb.ObjectId(product._id), quantity: 1}]};
    const db = getDb();
    //keep everything as it is, I dont want to change the user name or anything i will just set cart equal to updated cart, that is it
    return db.collection("users").updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {cart: updatedCart}}) 
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;
