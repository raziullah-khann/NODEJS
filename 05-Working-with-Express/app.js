const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const {engine} = require('express-handlebars');

const app = express(); //initialize express

// app.engine('hbs', engine({ extname: 'hbs', defaultLayout: 'main-layout', layoutsDir: path.join(__dirname, 'views/layouts') })); //first arguments engine name we can use any name second arg is initialize engine.
app.set('view engine', 'ejs'); //Setting the View Engine => responsible for rendering dynamic HTML based on templates and data.
app.set('views', 'views'); //Setting the Views Directory => 

const adminData = require('./routes/admin');
const shopRoute = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));  //__dirname is a global variable in Node.js that represents the current directory path of the current module

app.use('/admin', adminData.routes);
app.use(shopRoute);

app.use((req, res, next) => {
    // res.status(404).send('<h1>Page not found</h1>');
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    res.status(404).render('404', { pageTitle: 'Page not found', path: '' });
});

app.listen(3000);