const Coupon = require('../models/coupon');
var validator = require('validator');
var Utils = require('./Utils');
const csv = require('csv-parser');
const fs = require('fs');
var propertiesReader = require('properties-reader');

var properties = propertiesReader('./env/properties.file');
var jwt = require('jsonwebtoken');
var utils = new Utils();

module.exports = {
    test: async (req, res) => {

        console.log(req.body);
        console.log(req.params);
        var params = req.body;

        return res.send("NODE js Services work!");
    },
    create: async (req, res) => {

        console.log(req.body);
        var params = req.body;
        var codeCoupon = params.codeCoupon;


        const coupon = await Coupon.create({
            codeCoupon,
            dateCreate: Date.now(),
            dateUsed: null,
            Coupons: null
        });
        await coupon.save();
        return res.send(coupon.id);
    },

    get: async (req, res) => {
        console.log("dentro de get Coupon");
        const pruchases = await Coupon.find({});

        return res.send(pruchases);
    },
    update: async (req, res) => {

        var parameters = req.body;
        var id = req.params.id;

        console.log("id", id);
        console.log("codeCoupon", parameters.codeCoupon);
        console.log("dateUsed", parameters.dateUsed);
        console.log("purchases", parameters.purchases);
        //valido id y title
        var datosValidos = !validator.isEmpty(id) && !validator.isEmpty(parameters.codeCoupon)
        //valido content y imageFull
        var bdateUsed = !validator.isEmpty(parameters.dateUsed);
        //valido iamgePreview1
        var bpurchases = !validator.isEmpty(parameters.purchases);

        console.log("Coupon con datos minimos para actualizar", id);
        console.log(datosValidos);

        console.log("Coupon con datos opcionales", bdateUsed);
        console.log(bdateUsed);

        console.log("Coupon con datos opcionales", bpurchases);
        console.log(bpurchases);

        if (datosValidos) {
            Coupon.findOneAndUpdate({ _id: id }, parameters, { new: true }, (err, CouponUpdated) => {

                if (!err) {

                    return res.status(200).send(CouponUpdated);

                } else {
                    return res.status(500).send({
                        status: 'Error al querer actualizar Coupon',
                        message: err
                    });

                }

            });
        }




    },
    delete: async (req, res) => {

        var id = req.params.id;

        console.log("dentro delete id:", id);
        Coupon.findOneAndDelete({ '_id': id }, (err, couponDeleted) => {

            if (!err) {

                if (couponDeleted)
                    return res.status(200).send({
                        status: 'Se elimino el Coupon :', couponDeleted: couponDeleted
                    });
                else
                    return res.status(200).send({
                        status: 'No existe Coupon ', Elemento: id
                    });

            } else
                return res.status(200).send({
                    status: 'Error ! al querer eliminar item:' + id
                });

        });

    },
    uploadMessage: async (req, res) => {

        var token = req.query.token;
        var file = req.files.file0;


        console.log("path file", req.files);

        console.log("token", token);

        let isTokenValid = await utils.verificarToken(token);
        console.log(isTokenValid);

        if (isTokenValid != "Token valido") {
            return res.status(200).send({
                status: "error2", mensaje: "erroEn el mensaje" + isTokenValid
            });
        }

        if (!utils.isNullOrUndefined(file)) {


            fs.readFile(file.path, function (err, data) {
                if (err) {
                    throw err;
                }
                let templatePath = properties.get('message.template.1');

                fs.writeFile(templatePath, data.toString(), function (err) {

                    if (!err) {

                        return res.status(200).send({
                            message: 'Se proceso archivo correctamente :' + data
                        });
                    }
                    else {
                        throw err;
                    }
                });
            });
        }

    },
    upload: async (req, res) => {

        var rows = [];
        //var id = req.query.id;
        var file = req.files.file0;
        console.log("valor de files", file);

        const element = file.path;
        //console.log("dentro del for", element);
        let so = properties.get('OS.OS.active');
        var ext = "";
        if (so == "windows" || so == undefined) {
            ext = element.split('\\')[2];
        }
        else {
            ext = element.split('/')[2];
        }
        //cambiar si es servidor linux

        ext = ext.split('.')[1];
        //var utils = new Utils();
        //console.log("extension y i", ext, i);
        if (utils.verificarFormatoFile(ext)) {
            // console.log("item con el formato correcto");
            fs.createReadStream(element)
                .pipe(csv())
                .on('data', (row) => {
                    //console.log(row);
                    if (utils.verificarFormatoRow(row)) {
                        rows.push(row);
                        // console.log("es formato valido", rows.length);

                        // console.log(row);
                    }
                    else {
                        //console.log("no tiene los campos correctos");
                    }
                })
                .on('end', () => {
                    console.log('CSV file successfully processed');
                    console.log("FINAL DEL PROCESO", rows.length);
                    rows = utils.FiltrarProcessed(rows);
                    utils.logicaGeneral(rows).then((coupon) => {

                        let templatePath = properties.get('message.template.1');

                        fs.readFile(templatePath, function (err, data) {
                            if (err) {
                                throw err;
                            } else {

                                return res.status(200).send({
                                    message: 'Se proceso la planilla correctamente, existen :' + rows.length,
                                    coupon: coupon,
                                    template: data.toString()
                                });

                            }

                        });

                    });
                });
        }
        else {
            fs.unlink(element, () => {

                console.log("Se borro correctamente el file");

            });

        }

    },

    verificarCoupon: async (req, res) => {

        console.log("dentro de verificarCoupon", req.body);
        var parameters = req.body;
        // var email = parameters.email;
        var coupon = parameters.coupon;

        // var isValid = !validator.isEmpty(email);
        var isValid = !validator.isEmpty(coupon);

        if (isValid) {
            //verifico si existen
            var utils = new Utils();
            //usuario existe
            var c = await utils.buscarCodeCoupon(coupon);

            //console.log("user array:", u[0].id);
            if (!utils.isNullOrUndefined(c)) {
                console.log("coupon:", c[0].id);
                return res.status(200).send({ "state": "valid", "couponId": coupon });
            }

            else {
                console.log("No se encontro coupon");
                return res.status(200).send({ "state": "invalid", "couponId": coupon });
            }

        }
        else {
            //retorno error porque no tiene los campos 
            return res.status(404).send("El mensaje no tiene los campos correctos");
        }


    }


}