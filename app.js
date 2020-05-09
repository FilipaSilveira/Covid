const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

//app.set('views', './views');

//Connect DB
mongoose.connect('mongodb+srv://trabalhopaw:paw2020@cluster0-gifs8.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true }, () =>
    console.log('connected to db')
);

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
const adminRoute = require('./routes/admin');
const homeRoute = require('./routes/home');
const tecnicosRoute = require('./routes/tecnicos');

app.use('/tecnicos', tecnicosRoute);
app.use('/', homeRoute);
app.use('/admin', adminRoute);



//Listen 
const PORT = process.env.PORT || 3000;

app.listen(PORT,console.log('Server started on port ${PORT}'));