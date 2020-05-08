const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

//import routes
const adminRoute = require('./routes/admin');
const homeRoute = require('./routes/home');
const tecnicosRoute = require('./routes/tecnicos');

app.use('/tecnicos', tecnicosRoute);
app.use('/', homeRoute);
app.use('/admin', adminRoute);

//Connect DB
mongoose.connect('mongodb+srv://trabalhopaw:paw2020@cluster0-gifs8.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true }, () =>
    console.log('connected to db')
);

//Listen 
app.listen(3000);