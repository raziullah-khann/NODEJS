const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
// const {engine} = require('express-handlebars');
// const db = require("./util/database");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-items");
const Order = require("./models/order");
const OrderItem = require("./models/order-items");

const app = express(); //initialize express

// app.engine('hbs', engine({ extname: 'hbs', defaultLayout: 'main-layout', layoutsDir: path.join(__dirname, 'views/layouts') })); //first arguments engine name we can use any name second arg is initialize engine.
app.set("view engine", "ejs"); //Setting the View Engine => responsible for rendering dynamic HTML based on templates and data.
app.set("views", "views"); //Setting the Views Directory =>

const adminRoutes = require("./routes/admin");
const shopRoute = require("./routes/shop");
const pageNotFound = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public"))); //__dirname is a global variable in Node.js that represents the current directory path of the current module

// This middleware will run for every incoming request
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {  //this user is not normal javascript object this is sequelize object here available all sequelize method like destroy etc.
      req.user = user; //Making User Data Available Globally: here we can simply add new field to our request object
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});
  
app.use("/admin", adminRoutes);
app.use(shopRoute);

app.use(pageNotFound.get404Page);

//Association
//one to many
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
//one to one
User.hasOne(Cart);
Cart.belongsTo(User);
//many to many
Cart.belongsToMany(Product, {through: CartItem});  //telling the sequelize where these connection should be stored
Product.belongsToMany(Cart, {through: CartItem});
//one to many 
Order.belongsTo(User);
User.hasMany(Order);
//many to many
Order.belongsToMany(Product, {through: OrderItem});

sequelize
  // .sync({force: true}) //this is drop all table and overwrite the tables every time
  .sync()
  .then((result) => {
    return User.findByPk(1);
    // console.log(result);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name: "Raziullah",
        email: "raziullahkhan25@gmail.com",
      });
    }
    return Promise.resolve(user);
  })
  .then((user) => {
    // console.log(user);
    return user.createCart();   
}).then(()=>{
    
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
