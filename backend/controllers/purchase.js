const Purchase = require('../models/purchase');
const Item = require('../models/item');
const User = require('../models/user');
var validator = require('validator');
const Utils = require('./Utils');
var propertiesReader = require('properties-reader');
var properties = propertiesReader('./env/properties.file');


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
        //title
        //content
        //imagePreview1
        //imageFull
        //case 1: minimo


        // var item = params.items;
        // console.log("el valor de items:", item);
        try {
            const purchase = await Purchase.create({
                purchaseCod: params.purchaseCod,
                totalImages: params.totalImages,
                // codeCoupon: params.codeCoupon,
                items: params.items,
                dateCreate: Date.now(),
                // imagePreview3: params.imagePreview3

            });
            await purchase.save();
            return res.send(purchase.id);
        } catch (error) {
            return res.status(500).send(error);
        }

    },
    get: async (req, res) => {
        console.log("dentro de getItems");
        const purchases = await Purchase.find({});



        return res.send(purchases);
    },
    verificarCoupon: async (req, res) => {
        console.log("dentro de verificarCoupon", req.body);
        var parameters = req.body;
        var email = parameters.email;
        var coupon = parameters.coupon;


        var isValid = !validator.isEmpty(email);
        isValid = !validator.isEmpty(coupon) && isValid;

        if (isValid) {
            //verifico si existen
            var utils = new Utils();
            var u = await utils.buscarUser(email);
            //console.log("user:", u[0].id);
            if (!utils.isNullOrUndefined(u)) {
                //usuario existe
                var c = await utils.buscarCodeCoupon(coupon);
                console.log("coupon:", c[0].id);
                console.log("user:", u.id);
                //console.log("user array:", u[0].id);
                if (!utils.isNullOrUndefined(c)) {
                    //existe coupon
                    //verifico que el coupon tenga el purchase con el usuario.
                    var p = await utils.buscarPurchase(c[0].id, u.id);
                    //console.log("coupon:", p);
                    if (!utils.isNullOrUndefined(p)) {
                        console.log("encontro correctamente", p)
                        return res.status(200).send(p);
                    }

                }

            }

        } else {
            //retorno error porque no tiene los campos 
            return res.status(404).send("El mensaje no tiene los campos correctos");
        }


    },
    downloadByOrderId: async (req, res) => {

        console.log("dentro de downloadByOrderId", req.body);
        var parameters = req.body;
        var orderId = parameters.orderId;
        let utils = new Utils();
        try {
            let items = await utils.obtenerItemsByOrderId(orderId);

            if (items)
                var casted_items = items.map(function (x) {
                    let i = new Object();
                    i.id = x._id;
                    i.titulo = x.titulo;
                    i.contenido = x.contenido;
                    i.imagePreview = x.imagePreview;
                    i.imageFull = x.imageFull;
                    i.height = x.height;
                    i.width = x.width;
                    i.weight = x.weight;

                    return i;
                });

            return res.send(casted_items);
        } catch (error) {
            return res.status(404).send("Error to Download");
        }

    },
    asociarCompra: async (req, res) => {

        console.log("dentro de asociarCompra", req.body);
        //res.status(200).send("OK");
        var parameters = req.body;
        var purchaseId = parameters.purchaseId;
        var items = JSON.parse(parameters.items);
        var itemsId = [];
        var utils = new Utils();
        //let isPurchaseEmpty = await utils.IsPurchaseEmpty(purchaseId);
        //console.log("Items", items);


        try {

            for (let index = 0; index < items.length; index++) {
                const item = items[index];
                var itemFound = await Item.findById({ _id: item });
                if (!utils.isNullOrUndefined(itemFound)) {
                    console.log("item encontrado:", itemFound.id);
                    itemsId.push(itemFound.id);

                }
            }

            for (let index = 0; index < itemsId.length; index++) {
                const itemId = itemsId[index];

                await utils.asociarPurchase(purchaseId, itemId)

            }
            res.status(200).send({ message: purchaseId });

        } catch (error) {
            res.status(404).send({ message: "Hubo un error" + error });
        }


    },
    crearCompra: async (req, res) => {


        //recibo los items que van a pertenecer a la compra
        console.log("dentro de asociarCompra", req.body);
        var parameters = req.body;
        let coupon = parameters.coupon;
        let userName = parameters.userName;
        var items = JSON.parse(parameters.items);
        var itemsId = [];
        let couponValidated = null;
        var utils = new Utils();

        if (coupon != undefined && coupon != '' && coupon != null) {

            let result = await utils.buscarCodeCoupon(coupon);
            couponValidated = result[0];

        }
        try {

            for (let index = 0; index < items.length; index++) {
                const item = items[index];
                var itemFound = await Item.findById({ _id: item });
                if (!utils.isNullOrUndefined(itemFound)) {
                    console.log("item encontrado:", itemFound.id);
                    itemsId.push(itemFound.id);

                }
            }
            let user = await User.findOne({ mail: userName });
            if (!user) {
                user = await User.create({ mail: userName });
            }
            let parameters = { user: user };
            //creo el purchase estado "not verified"
            let purchase = await utils.crearPurchaseOnly(parameters);

            //asocio los items con el purchase
            for (let index = 0; index < itemsId.length; index++) {
                const itemId = itemsId[index];
                console.log("id", purchase._id);
                purchase = await utils.asociarPurchase(purchase._id, itemId)
            }
            //creo la orden para que sea validada
            let orderId = "";
            if (couponValidated) {
                orderId = await utils.createOrderPaypal(couponValidated.codeCoupon, purchase.totalAmount, couponValidated.discount);
            } else {
                let referenceId = "SIN_DESCUENTO";
                orderId = await utils.createOrderPaypal(referenceId, purchase.totalAmount);
            }
            let cb = function (purchase, error) {
                //retorno el link de la orden
                if (purchase) {
                    if (properties.get('PAYPAL.API.ENVIROMENT') === 'production') {
                        res.status(200).send({ status: 'success', url: 'https://www.paypal.com/checkoutnow?token=' + orderId });
                    }
                    else {
                        res.status(200).send({ status: 'success', url: 'https://www.sandbox.paypal.com/checkoutnow?token=' + orderId });
                    }
                }
                else
                    res.status(200).send({ status: 'error ' + err, url: '' });
            }
            //asocio registro con el token de pago
            purchase = await utils.updateorderIdProcess(purchase._id, orderId, cb);

        } catch (error) {
            res.status(404).send({ message: "Hubo un error" + error });
        }









    },
    setAprove: async (req, res) => {

        console.log("aprobando el orderId:")
        var parameters = req.body;

        let orderId = parameters.orderId;
        let payerId = parameters.payerId;

        let filter = { orderId: orderId, state: "NOT VERIFIED" };
        // let purchase = Purchase.byOrderID(orderId);
        //se actualiza payerId y estado del purchase
        let purchase = {};
        purchase.payerId = payerId;
        purchase.state = "APROVED";
        let utils = new Utils();

        let cb = function (purchaseUpdated, err) {

            if (purchaseUpdated) {
                res.status(200).send({ message: "purchase updated successfully", status: "OK" });
            }
            else {
                if (!err)
                    res.status(200).send({ message: "error al actualizar el purchase solicitado, el mismo no se encuentra o no esta en un estado valido" });
                else
                    res.status(200).send({ message: "error al actualizar el purchase solicitado " + err, status: "error" });
            }


        }

        utils.updatePaymentProcess(filter, purchase, cb);

    },
    captureOrder: async (req, res) => {

        console.log("capturando el orderId:")
        var parameters = req.body;

        let orderId = parameters.orderId;

        // let purchase = Purchase.byOrderID(orderId);

        //se actualiza state del purchase y se captura

        let parameter = {};
        parameter.state = "CAPTURED";
        var utils = new Utils();

        let cb1 = function (response, error) {

        }
        let filter = { orderId: orderId, state: "APROVED" };
        utils.updatePaymentProcess(filter, parameter, cb1);
        //set callback function
        let cb2 = function (response) {
            if (response == "success") {
                res.status(200).send({ message: "Capture Completed!", status: "OK" });
            } else {
                res.status(200).send({ message: "Error during capture", status: "Error" + response });
            }

        }
        utils.captureOrderPaypal(orderId, cb2);



    },
    getById: async (req, res) => {
        console.log("dentro de purchases / getByID");
        var id = req.params.id;


        console.log("params", req.params);

        try {
            var utils = new Utils();
            let response = await utils.getById(id);

            return res.send(response);
        } catch (error) {
            res.status(404).send("Error to Download");
        }

    },
    download: async (req, res) => {
        console.log("dentro de purchases / download");
        var id = req.params.id;

        var utils = new Utils();

        if (validator.isEmpty(id))
            return res.status(500).send("Purchase wrong");

        var purchase = await utils.getById(id);
        console.log("purchase", purchase);
        if (typeof purchase != undefined && purchase && typeof purchase != null)
            if (!utils.verificarFecha(purchase))
                return res.status(500).send("purchase is out of date ");

        try {
            let items = await utils.obtenerItemsByPurchase(purchase);

            if (items)
                var casted_items = items.map(function (x) {
                    let i = new Object();
                    i.id = x._id;
                    i.titulo = x.titulo;
                    i.contenido = x.contenido;
                    i.imagePreview = x.imagePreview;
                    i.imageFull = x.imageFull;
                    i.height = x.height;
                    i.width = x.width;
                    i.weight = x.weight;

                    return i;
                });

            //console.log("Esto es lo que responde getByID", otherResponse);


            //const purchases = await Purchase.findById(id);
            //meto logica para verificar si es mayor a 7 dias

            return res.send(casted_items);
        } catch (error) {
            return res.status(404).send("Error to Download");
        }

    },
    update: async (req, res) => {


        var parameters = req.body;
        var id = req.params.id;
        console.log("id", id);
        console.log("purchaseCod", parameters.purchaseCod);
        console.log("totalImages", parameters.totalImages);
        console.log("codeCoupon", parameters.codeCoupon);
        console.log("items", parameters.items);
        console.log("users", parameters.users);
        //valido id y title
        var datosValidos = !validator.isEmpty(id) && !validator.isEmpty(parameters.purchaseCod)
        //valido content y imageFull
        datosValidos = !validator.isEmpty(parameters.totalImages) && !validator.isEmpty(parameters.codeCoupon) && datosValidos;
        //valido iamgePreview1
        datosValidos = !validator.isEmpty(parameters.items) && !validator.isEmpty(parameters.users) && datosValidos;

        console.log("purchase con datos minimos para actualizar", id);
        console.log(datosValidos);


        if (datosValidos) {
            Purchase.findOneAndUpdate({ _id: id }, parameters, { new: true }, (err, purchaseUpdated) => {

                if (!err) {

                    return res.status(200).send(purchaseUpdated);

                } else {
                    return res.status(500).send({
                        status: 'Error al querer actualizar purchase',
                        message: err
                    });

                }

            });
        }
        //validar datos



    },
    delete: async (req, res) => {

        var id = req.params.id;

        console.log("dentro delete id:", id);
        Purchase.findOneAndDelete({ '_id': id }, (err, purchaseDeleted) => {

            if (!err) {

                if (itemDeleted)
                    return res.status(200).send({
                        status: 'Se elimino el Purchase :', purchaseDeleted: purchaseDeleted
                    });
                else
                    return res.status(200).send({
                        status: 'No existe Purchase ', Elemento: id
                    });

            } else
                return res.status(200).send({
                    status: 'Error ! al querer eliminar item:' + id
                });

        });

    }


}