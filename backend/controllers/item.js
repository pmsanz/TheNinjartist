const Item = require('../models/item');
const path = require('path');
const { isNullOrUndefined } = require('util');
var validator = require('validator');
const fs = require('fs');
var propertiesReader = require('properties-reader');
var properties = propertiesReader('./env/properties.file');
var jwt = require('jsonwebtoken');
const uploadPath = path.join('upload', 'items/');
var Busboy = require('busboy');
var Utils = require('./Utils');
var utils = new Utils();
var crypto = require('crypto');

function base64FromFile(fullPath) {

    var bitmap = fs.readFileSync(fullPath);
    // convert binary data to base64 encoded string
    base64str = new Buffer.from(bitmap).toString('base64');

    return base64str;
}

function verificarFormato(ext) {
    if (!validator.isEmpty(ext) && (ext == "jpg" || ext == "bmp" || ext == "jpge"))
        return true;
    else
        return false;
}

module.exports = {


    test: async (req, res) => {



        return res.send("NODE js Services work!");
    },
    create: async (req, res) => {

        // let items = await Item.find({});
        // let cb = async function(myItem,i,array){

        //     if (myItem.publicationType == "store")
        //     myItem.publicationType = "Store";
        // if (myItem.publicationType == "feed")
        //     myItem.publicationType = "Feed";
        // await myItem.save();

        // }
        // items.map(cb);


        var parameters = req.body;
        var itemToCreate = {}
        try {

            //valido titulo
            if (parameters.titulo != undefined) {
                validator.isEmpty(parameters.titulo)
                itemToCreate.titulo = parameters.titulo;
            }
            //valido descripcion
            if (parameters.contenido != undefined) {
                validator.isEmpty(parameters.contenido)
                itemToCreate.contenido = parameters.contenido;
            }
            //valido price
            if (parameters.price != undefined) {
                validator.isInt(parameters.price.toString())
                let priceAux = parameters.price * 100;
                itemToCreate.price = priceAux;
            }
            //valido height
            if (parameters.height != undefined) {
                validator.isInt(parameters.height.toString())
                itemToCreate.heigh = parameters.height;
            }
            //valido width
            if (parameters.width != undefined) {
                validator.isInt(parameters.width.toString())
                itemToCreate.width = parameters.width;
            }
            //valido weight
            if (parameters.weight != undefined) {
                validator.isInt(parameters.weight.toString())
                itemToCreate.weight = parameters.weight;
            }
            //valido type
            if (parameters.type != undefined && parameters.type.length > 1) {
                validator.isEmpty(parameters.type)
                //creo la primera letra en mayuscula
                let typeAux = parameters.type.charAt(0).toUpperCase() + parameters.type.slice(1)
                itemToCreate.publicationType = typeAux;
            }
            else {
                itemToCreate.type = "Store";
            }

            const item = await Item.create(itemToCreate);

            await item.save((err, product) => {
                if (err)
                    return res.status(500).send({ status: "Error", message: "Error al querer crear item nuevo " + err.message });
                else {
                    console.log("All OK!", item.id);
                    return res.status(200).send(item.id);

                }


            });



        } catch (error) {


            return res.status(500).send({ status: "Error", message: "Error al querer crear item nuevo " + error.message });

        }


    },
    getSecure: async (req, res) => {

        var id = req.params.id;
        console.log("dentro de getSecure id", id);
        let result = validator.isMongoId(id);
        console.log("res", result);
        if (!result)
            return res.status(200).send({ item: "", mensaje: "id del item invalida ", status: "error" });

        const item = await Item.findById(id);

        if (!isNullOrUndefined(item))
            var casted_item = {
                id: item._id,
                titulo: item.titulo,
                contenido: item.contenido,
                imageFull: item.imageFull,
                imagePreview: item.imagePreview,
                imageFull: item.imageFull,
                height: item.height,
                width: item.width,
                weight: item.weight,
                price: item.price,
                type: item.publicationType

            }
        else {
            return res.status(200).send({ item: "", mensaje: "No se encontro el id del item ", status: "error" });
        }
        // console.log(casted_items);
        return res.status(200).send({ item: casted_item, mensaje: "", status: "OK" });

    },
    getAllSecure: async (req, res) => {

        let items = await Item.find({});

        let results = items.map((item) => {

            var casted_item = {
                id: item._id,
                titulo: item.titulo,
                contenido: item.contenido,
                imageFull: item.imageFull,
                imagePreview: item.imagePreview,
                imageFull: item.imageFull,
                height: item.height,
                width: item.width,
                weight: item.weight,
                price: item.price,
                type: item.publicationType

            }
            // console.log("type", casted_item.type);
            return casted_item;
        });

        return res.status(200).send({ items: results, mensaje: "", status: "OK" });

    },
    getImage: (req, res) => {
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


    },
    update: async (req, res) => {

        var parameters = req.body;
        var itemToModify = {}
        try {

            //valido id
            validator.isEmpty(parameters.id)
            itemToModify._id = parameters.id;

            //valido titulo
            if (parameters.titulo != undefined) {
                validator.isEmpty(parameters.titulo)
                itemToModify.titulo = parameters.titulo;
            }
            //valido descripcion
            if (parameters.contenido != undefined) {
                validator.isEmpty(parameters.contenido)
                itemToModify.contenido = parameters.contenido;
            }
            //valido price
            if (parameters.price != undefined) {
                validator.isInt(parameters.price.toString())
                let priceAux = parameters.price * 100;
                itemToModify.price = priceAux;
            }
            //valido height
            if (parameters.height != undefined) {
                validator.isInt(parameters.height.toString())
                itemToModify.heigh = parameters.height;
            }
            //valido width
            if (parameters.width != undefined) {
                validator.isInt(parameters.width.toString())
                itemToModify.width = parameters.width;
            }
            //valido weight
            if (parameters.weight != undefined) {
                validator.isInt(parameters.weight.toString())
                itemToModify.weight = parameters.weight;
            }
            //valido type
            if (parameters.type != undefined && parameters.type.length > 1) {
                validator.isEmpty(parameters.type)
                //creo la primera letra en mayuscula
                let typeAux = parameters.type.charAt(0).toUpperCase() + parameters.type.slice(1)
                itemToModify.publicationType = typeAux;
            }
            else {
                itemToModify.type = "Store";
            }

            //si los datos son validos

            Item.findOneAndUpdate({ _id: itemToModify._id }, itemToModify, { new: true }, (err, itemUpdate) => {

                if (!err) {

                    return res.status(200).send(itemUpdate);

                } else {
                    return res.status(500).send({
                        status: 'Error al querer actualizar item',
                        message: err
                    });

                }

            });

        } catch (error) {
            return res.status(500).send({ status: "Error", message: "Error al querer modificar item " + error.message });
        }

    },
    deleteImage: async (req, res) => {

        var id = req.params.id;
        console.log("parameters ", req.params)
        if (!validator.isEmpty(id)) {


            //{ imageFull: {$all: ["LA1vflBAYMBq-_m9SIaGA2hO.jpg"]} }
            // let parameter = { imageFull: { $all: [id] } };
            // console.log("parameters armado",parameter);

            let item = await Item.findOne({ imageFull: { $all: id } });

            if (!isNullOrUndefined(item)) {
                let newImageFull = [];
                item.imageFull.forEach(item => {

                    if (id != item)
                        newImageFull.push(item);

                });

                console.log("newImageFull", newImageFull);
                item.imageFull = newImageFull;
            } else {
                // puede ser una image preview
                item = await Item.findOne({ imagePreview: id });

                if (item == []) {

                    console.log("no se encontro con ningun item");
                    return res.status(404).send({ message: 'error al querer item con esa imagen' });
                }

                console.log("item la imagen es preview", item);
                item.imagePreview = "";

            }

            await Item.findOneAndUpdate({ _id: item.id }, item, { new: true }, (err, itemUpdate) => {
                if (err) {
                    console.log("error al querer actualizar item", err);
                    return res.status(404).send({ message: 'error al querer actualizar item' });
                } else {


                    let i = new Object();

                    i.id = itemUpdate._id;
                    i.titulo = itemUpdate.titulo;
                    i.contenido = itemUpdate.contenido;
                    i.imagePreview = itemUpdate.imagePreview;
                    i.imageFull = itemUpdate.imageFull;
                    i.height = itemUpdate.height;
                    i.width = itemUpdate.width;
                    i.weight = itemUpdate.weight;


                    id = "./upload/items/" + id;
                    //console.log("item encontrado", item);

                    fs.exists(id, (exist) => {

                        if (exist) {

                            fs.unlink(id, (error) => {
                                if (error) {
                                    return res.status(404).send({ message: 'hubo un error al querer eliminar la imagen ' + error })

                                } else {
                                    return res.status(200).send({ message: i });
                                }
                            });
                        }
                        else {
                            return res.status(404).send({ message: 'la imagen no existe' });
                        }
                    });

                }
            });



        }





    },
    upload: async (req, res) => {


        //recibo file
        //Se guarda imagen en el servidor
        //se retorna id de la imagen
        console.log("dentro de upload", req.query.id);



        var id = req.query.id;
        var file = req.files.file0;
        var token = id.split('@')[2];
        var type = id.split('@')[1];
        id = id.split('@')[0];
        // console.log("valor de id", id);
        console.log("token", token);
        let pass = properties.get('config.llave.token')
        console.log("config.llave", pass);
        await jwt.verify(token, pass, (err, decoded) => {
            if (err) {
                console.log("tiene error")
                return res.status(200).send({ message: "token invalid" });
            }
        });
        console.log("paso")
        //Cambiar cuando sea linux

        const element = file.path;
        //console.log("dentro del for", element);
        let so = properties.get('OS.OS.active');
        var ext = "";
        var filePath = "";
        if (so == "windows" || so == undefined) {
            filePath = element.split('\\')[2];
        }
        else {
            filePath = element.split('/')[2];
        }
        ext = filePath.split('.')[1];


        let item = await Item.findById(id);

        console.log("item", item);
        console.log("type", type);
        if (type == 0 || type == "0") {
            //es  preview 
            item.imagePreview = filePath;
        }
        else {
            // si el array existe busco el indice y lo reemplazo sino push
            console.log("imageFull", item.imageFull.length);

            if (item.imageFull.length > 0 && item.imageFull.length > type - 1) {
                console.log("actualizando indice");
                item.imageFull[type - 1] = filePath;
            } else {
                console.log("agrfegando a la coleccion");
                item.imageFull.push(filePath);
            }
            console.log("item-luego", item);
        }

        if (true) {
            Item.findOneAndUpdate({ _id: id }, item, { new: true }, (err, itemUpdate) => {

                if (!err) {

                    return res.status(200).send({ itemUpdate: itemUpdate, type: type });

                } else {
                    return res.status(500).send({
                        status: 'Error al querer actualizar item',
                        message: err
                    });

                }

            });
        }


        // if (verificarFormato(ext)) {

        //     res.status(200).send({
        //         id: file.path
        //     });

        // } else {
        //     //elimino la imagen
        //     fs.unlink(file_id);
        // }




    },
    delete: async (req, res) => {

        var id = req.params.id;

        // console.log("dentro delete id:", id);
        // console.log("params:", req.params);

        Item.findOneAndDelete({ '_id': id }, (err, itemDeleted) => {

            if (!err) {

                if (itemDeleted) {
                    return res.status(200).send({
                        status: 'Se elimino el articulo :', itemDeleted: itemDeleted.id
                    });
                }
                else {
                    return res.status(200).send({
                        status: 'No existe elemento ', Elemento: id
                    });
                }
            } else
                return res.status(200).send({
                    status: 'Error ! al querer eliminar item:' + id
                });

        });

    },
    createNew: async (req, res) => {

        let imagePreviewPath = "";
        let imageFullPath = [];

        var busboy = new Busboy({ headers: req.headers, highWaterMark: 2 * 1024 * 1024, immediate: true });

        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

            let fullFileNameHashed = "";
            var currentTimeInMilliseconds = Date.now();
            var hash = crypto.createHash('md5').update(currentTimeInMilliseconds.toString()).digest("hex");

            //get extension of file
            let objExt = utils.descomponerPath(filename, 'image');
            fullFileNameHashed = hash + "." + objExt.ext;
            imageFullPathName = path.join(uploadPath, fullFileNameHashed);
            fstream = fs.createWriteStream(imageFullPathName);

            if (fieldname == "imagePreview") {

                //es  imagePreview 
                imagePreviewPath = fullFileNameHashed;
            }
            else {
                //es imageFull
                imageFullPath.push(fullFileNameHashed);

            }
            file.pipe(fstream);
            // fstream.on('close', item_cb, err => {
            //     console.log("error", err)
            // });

        });
        busboy.on('finish', async function () {
            console.log('finish, files uploaded ');
            //termina de subir todos los archivos
            let body = req.body;
            let id = body.id;

            if (!validator.isEmpty(id)) {
                if (!validator.isMongoId(id)) {
                    return res.status(500).send({
                        status: 'error',
                        message: "id no tiene el formato correcto"
                    });
                }
            }
            else
                return res.status(500).send({
                    status: 'error',
                    message: "id no suministrada"
                });

            let itemFinded = await Item.findById(id);
            console.log("imagePreview", imagePreviewPath)
            console.log("imageFull", imageFullPath)

            itemFinded.imagePreview = imagePreviewPath;
            itemFinded.imageFull = imageFullPath;

            Item.findOneAndUpdate({ _id: id }, itemFinded, { new: true }, (err, itemFindedUpdate) => {

                console.log("item modificado" + itemFindedUpdate);
                if (!err)
                    return res.status(200).send({ success: true });
                else
                    return res.status(500).send({
                        status: 'Was raised an error',
                        message: err
                    });

            });


        });

        busboy.on('field', (fieldName, value) => {
            req.body[fieldName] = value
        })
        req.pipe(busboy);

    }


}