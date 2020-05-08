const express = require('express');
//const expressLayouts = require('express-ejs-layouts');
//const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

//Connect DB
mongoose.connect('mongodb+srv://trabalhopaw:paw2020@cluster0-gifs8.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true }, () =>
    console.log('connected to db')
);





//import routes
const homeRoute = require('./routes/home');
const adminRoute = require('./routes/admin');
const tecnicosRoute = require('./routes/tecnicos');

app.use('/', homeRoute);
app.use('/admin', adminRoute);
app.use('/tecnicos', tecnicosRoute);


//Listen 
app.listen(3000);