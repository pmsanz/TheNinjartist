'use strict'

var mongoose = require('mongoose');

var url = 'mongodb://localhost:27017/api_rest-ninjartist';

var app = require('./app');
var port = 3900;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
var connect = mongoose.connect(url,{useNewUrlParser:true}).then(() => 
{
console.log("La aplicacion se ha conectado correctamente");
app.listen(port , () => {
console.log("servidor correcto en http://localhost:3900");

});
});