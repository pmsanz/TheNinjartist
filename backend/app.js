'use strict'

//modulos para crear servidor
var express = require('express');
var bodyParser = require('body-parser');

//Ejecutar exrepss
var app = express();
//cargar fichero rutas
var articlesRoute = require('./routes/article');
var itemRoute = require('./routes/item');
var purchaseRoute = require('./routes/purchase');
var couponRoute = require('./routes/coupon');
var userRoute = require('./routes/user');
var commentRoute = require('./routes/comment');
var paymentRoute = require('./routes/payment');
var feedRouter = require('./routes/feed');

//middlerwares

app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json());
//fix file


//CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, XMLHttpRequest ,Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//añadir prefijos a las rutas

app.use('/api/api',articlesRoute);
app.use('/api/items',itemRoute);
app.use('/api/purchase',purchaseRoute);
app.use('/api/coupon',couponRoute);
app.use('/api/user',userRoute);
app.use('/api/comment',commentRoute);
app.use('/api/payment',paymentRoute);
app.use('/api/feed',feedRouter);

module.exports = app;
