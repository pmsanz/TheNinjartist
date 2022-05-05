const Item = require('../models/item');
const path = require('path');
const { isNullOrUndefined } = require('util');
var validator = require('validator');
const fs = require('fs');
var propertiesReader = require('properties-reader');
const PropertiesReader = require('properties-reader');
var properties = propertiesReader('./env/properties.file');


module.exports = {


    test: async (req, res) => {



        return res.send("NODE js Services work!");
    },

    getStore: async (req, res) => {
        // console.log("dentro de getItems");

        let publicationType = "Store";

        const items = await Item.find({
            "$or": [
                { "publicationType": { "$regex": publicationType, "$options": "i" } }
            ]
        }).sort([['createdAt', -1]]);

        var casted_items = items.map(function (x) {
            let i = new Object();

            i.id = x._id;
            i.titulo = x.titulo;
            i.contenido = x.contenido;
            i.imageFull = [];
            i.imagePreview = x.imagePreview;
            i.height = x.height;
            i.width = x.width;
            i.weight = x.weight;
            i.price = x.price;

            return i;
        });

        // console.log(casted_items);
        return res.send(casted_items);
    },
    getFeed: async (req, res) => {
        // console.log("dentro de getItems");

        let publicationType = "feed";

        const items = await Item.find({
            "$or": [
                { "publicationType": { "$regex": publicationType, "$options": "i" } }
            ]
        })

        var casted_items = items.map(function (x) {
            let i = new Object();

            i.id = x._id;
            i.titulo = x.titulo;
            i.contenido = x.contenido;
            i.imageFull = [];
            i.imagePreview = x.imagePreview;
            i.height = x.height;
            i.width = x.width;
            i.weight = x.weight;

            return i;
        });

        // console.log(casted_items);
        return res.send(casted_items);
    }, getImage: (req, res) => {
        //console.log("atroden",req.params.image);
        var imageName = req.params.image;
        var pathImagen = './upload/items/' + imageName;
        //console.log(pathImagen);
        fs.exists(pathImagen, (exist) => {
            //console.log(exist);
            if (exist) {
                return res.sendFile(path.resolve(pathImagen));
            }
            else {
                return res.status(404).send({ message: 'la imagen no existe' });
            }

        })


    }


}