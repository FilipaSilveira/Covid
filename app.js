const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const bcryptj = require('bcryptjs');

var config = require('./config');

const app = express();

app.use(bodyParser.json());

// Bodyparser
app.use(express.urlencoded({ extended: false}));


mongoose.connect(config.dbUrl);
mongoose.connection.on('connected', () => {
    console.log('connected to mongo db');
});

mongoose.connection.on('error', err => {
    console.log('Error at mongodb: ' + err);
});

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

// EJS
app.use(expressLayouts);
app.set('view engine','ejs');

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Connect flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//import routes
const homeRoute = require('./routes/home');
const adminRoute = require('./routes/admin');
const tecnicosRoute = require('./routes/tecnicos');

app.use('/', homeRoute);
app.use('/admin', adminRoute);
app.use('/tecnicos', tecnicosRoute);

//Listen 
const PORT = process.env.PORT || 3000;
app.listen(PORT,console.log('Server started on port ${PORT}'));