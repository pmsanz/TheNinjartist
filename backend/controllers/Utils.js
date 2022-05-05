const Purchase = require('../models/purchase');
const Item = require('../models/item');
const User = require('../models/user');
// const Feed = require('../models/feed');
const Comment = require('../models/comment');
const Coupon = require('../models/coupon');
var validator = require('validator');
var propertiesReader = require('properties-reader');
var properties = propertiesReader('./env/properties.file');
var jwt = require('jsonwebtoken');
const createOrder = require('./../PayPal/createOrder').createOrder;
const captureOrder = require('./../PayPal/captureOrder').captureOrder;

var tiers = [];



class Utils {


    constructor() {

        tiers = [];
        this.usersEncontrados = [];
        this.usersNoEncontrados = [];

        //cargo los tiers desde el file de propiedades
        properties.each((key, value) => {
            if (key.includes("tier")) {
                var k = key.split(".");
                var key = k[2];
                // console.log("k",k,"j",j);
                var key_value = [parseInt(key), parseInt(value)];
                tiers.push(key_value);
            }

        });

    }
    async obtenerItemsByPurchase(purchases) {


        //console.log("obtenerItemsByPurchase",purchases);
        if (purchases) {
            if (purchases.items.length > 0) {
                var items = [];
                for (var i = 0; i < purchases.items.length; i++) {
                    var myId = purchases.items[i];
                    console.log("id de item :", myId);
                    var myItem = await Item.findOne(myId);
                    if (myItem) {

                        //console.log("my item", myItem);
                        items.push(myItem);

                    } else
                        console.log("item no existe mas", myItem);


                }
                console.log("array de items:", items.length);


            } else
                console.log("No tiene items");

        }
        return items;
    }
    async obtenerItemsByOrderId(orderId) {


        let purchases = await Purchase.byOrderID(orderId).exec();
        //console.log("obtenerItemsByPurchase",purchases);
        purchases = purchases[0];
        if (purchases) {
            if (purchases.items.length > 0 && purchases.state == "CAPTURED") {
                var items = [];
                for (var i = 0; i < purchases.items.length; i++) {
                    var myId = purchases.items[i];
                    console.log("id de item :", myId);
                    var myItem = await Item.findOne(myId);
                    if (myItem) {

                        //console.log("my item", myItem);
                        items.push(myItem);

                    } else
                        console.log("item no existe mas", myItem);


                }
                console.log("array de items:", items.length);


            } else
                console.log("No tiene items");

        }
        return items;
    }

    async getById(id) {
        if (!validator.isEmpty(id))
            var purchases = await Purchase.findById(id);
        return purchases;
    }

    async IsPurchaseEmpty(id) {
        if (!validator.isEmpty(id))
            var purchases = await Purchase.findById(id);

        if (!Array.isArray(purchases.items) || purchases.items.length == 0) {
            return true;
        }
        else
            return false;

    }

    //compara si la fecha del purchase es menor o igual a dicha fecha + x dias
    verificarFecha(purchase) {

        try {
            var days = properties.get('days.avaible');
            console.log("dias disponibles:", days);
            var date = purchase.dateCreate;

            var d1 = new Date();
            var d2 = new Date(date);
            var d3 = new Date();

            d3 = this.addDays(d2, days);
            console.log("date hoy:", d1);
            console.log("date purchase", d2);
            console.log("purchase + x", d3);

            //verifico que validar fecha este habilitado
            var validarFechaEnabled = properties.get('days.enabled');

            if (validarFechaEnabled == true || validarFechaEnabled == 'true')
                if (d1.getTime() <= d3.getTime()) {
                    console.log("resultado de la comparacion", d2, d1, true);
                    return true;
                }
                else {
                    console.log("resultado de la comparacion", false);
                    return false;

                }
            else {
                //si no valida siempre retorna true
                return true;
            }

        } catch (error) {
            console.log(error);
            return false;
        }

    }

    addDays(date, days) {
        var result = new Date(date);

        result.setDate(result.getDate() + days);

        return result;
    }

    verificarFormatoFile(ext) {
        if (!validator.isEmpty(ext) && ext == "csv")
            return true;
        else
            return false;
    }
    verificarFormatoRow(row) {
        var isValid = false;
        //FirtsName
        isValid = !this.isNullOrUndefined(row.FirstName);
        //LastName
        isValid = !this.isNullOrUndefined(row.LastName) && isValid;
        //Email
        isValid = !this.isNullOrUndefined(row.Email) && isValid;
        //Pledge
        isValid = !this.isNullOrUndefined(row.Pledge) && isValid;
        //Lifetime
        isValid = !this.isNullOrUndefined(row.Lifetime) && isValid;
        //Status:
        isValid = !this.isNullOrUndefined(row.Status) && isValid;
        //Twitter
        isValid = !this.isNullOrUndefined(row.Twitter) && isValid;
        //Street
        isValid = !this.isNullOrUndefined(row.Street) && isValid;
        //City
        isValid = !this.isNullOrUndefined(row.City) && isValid;
        //State:
        isValid = !this.isNullOrUndefined(row.State) && isValid;
        //Zip:
        isValid = !this.isNullOrUndefined(row.Zip) && isValid;
        //Country:
        isValid = !this.isNullOrUndefined(row.Country) && isValid;
        //Start:
        isValid = !this.isNullOrUndefined(row.Start) && isValid;
        //MaxAmount:
        isValid = !this.isNullOrUndefined(row.MaxAmount) && isValid;
        //test
        //console.log("pepe", this.isNullOrUndefined(row.pepe));
        //isValid = !this.isNullOrUndefined(row.pepe) && isValid;

        return isValid;
    }

    isNullOrUndefined(variable) {

        if (typeof variable == 'undefined')
            return true;

        if (variable == null)
            return true;

        return false;
    }

    //USER PROCESSING
    async createUserByCSV(rows) {


        for (let index = 0; index < rows.length; index++) {

            const myUser = rows[index];
            const user = await User.create({
                mail: myUser.Email,
                dateCreate: Date.now(),
                purchases: []
            });
        }




    }

    FiltrarProcessed(rows) {
        var myRows = [];
        for (let index = 0; index < rows.length; index++) {
            const element = rows[index];
            if (element.Status == 'Processed')
                myRows.push(element);
        }
        console.log("rows totales:", rows.length, "rowsfiltradas:", myRows.length);
        return myRows;

    }

    tierLogic(rows) {
        var usersToCreate = [];
        //verifico si el tier merece recompensas y cuantas
        //console.log("atroden");
        for (let i = 0; i < rows.length; i++) {

            var row = rows[i];
            //console.log("valor del row", parseInt(row.Pledge));
            var tierPrice = parseInt(row.Pledge);
            var find = false;
            for (let index = 0; index < tiers.length; index++) {
                const element = tiers[index];
                if (element[0] == tierPrice) {
                    find = true;
                    //console.log("mismo tier",element[1]);
                    if (element[1] > 0) {
                        //console.log("tier ", element[0], "merece " + element[1] + " recompensans");
                        usersToCreate.push({ user: row.Email, images: element[1] });
                    }
                }

            }


        }

        //console.log("usuarios a crear", usersToCreate);
        //this.crearUsuarioIfNoExist(usersToCreate);


        return usersToCreate;
    }


    crearPurchaseCod() {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + minutes;
        return date.getDate().toString() + (date.getMonth() + 1).toString() + date.getFullYear().toString() + strTime;
    }


    async crearPurchase(couponId, user) {

        var pc = this.crearPurchaseCod();
        //console.log("pc:", pc,"couponId:",couponId,"user:",user);

        try {
            const purchase = await Purchase.create({
                purchaseCod: pc,
                totalImages: user.images,
                codeCoupon: couponId,
                items: null,
                user: user.id,
                dateCreate: Date.now()

            });

            await purchase.save();
            //console.log("purchase Id:",purchase);
            return purchase.id;
        } catch (error) {
            console.log("Error al crear purchase:", error);
            return "";
        }

    }

    async createOrderPaypal(referenceId, amount, discount = 0) {

        console.log("creando orden paypal valores amount , discount", amount, discount);
        let response = await createOrder(referenceId, amount, discount, false);
        console.log("Creating Order...");
        let orderId = "";
        if (response.statusCode === 201) {
            console.log("Created Successfully", response.result.id);
            orderId = response.result.id;
            return orderId;
        } else {
            console.log("Error creating orderPaypal", response.result.id);
        }

    }

    async captureOrderPaypal(orderId, cb) {

        try {
            console.log('Capturing Order... ' + orderId);
            let response = await captureOrder(orderId);
            // let captureId = "";
            if (response.statusCode === 201) {
                cb("success");
            }
        }
        catch (err) {
            cb("error: " + err);
        }

    }

    async crearPurchaseOnly(parameters) {

        var pc = this.crearPurchaseCod();
        //console.log("pc:", pc,"couponId:",couponId,"user:",user);

        try {
            let purchase = null;
            if (parameters) {
                parameters.purchaseCod = pc;
                parameters.totalImages = null;
                parameters.codeCoupon = null;
                parameters.items = null;
                parameters.dateCreate = Date.now();

                purchase = await Purchase.create({

                    purchaseCod: parameters.purchaseCod,
                    totalImages: parameters.totalImages,
                    codeCoupon: parameters.codeCoupon,
                    items: parameters.items,
                    user: parameters.user,
                    dateCreate: parameters.dateCreate

                });

            } else {

                purchase = await Purchase.create({
                    purchaseCod: pc,
                    totalImages: null,
                    codeCoupon: null,
                    items: null,
                    user: null,
                    dateCreate: Date.now()

                });

            }

            await purchase.save();
            //console.log("purchase Id:",purchase);
            return purchase;
        } catch (error) {
            console.log("Error al crear purchase:", error);
            return null;
        }

    }


    async crearCupon() {

        let random = Math.floor(Math.random() * 10);
        //console.log("random1",random);
        var d = new Date();
        var n = d.getTime();
        random = random.toString() + n.toString();
        // console.log("random2",random);

        const coupon = await Coupon.create({
            codeCoupon: random,
            dateCreate: Date.now(),
            dateUsed: null,
            purchases: null
        });

        await coupon.save();


        let response = new Object();

        response.id = coupon.id;
        response.code = coupon.codeCoupon;

        return response;

    }

    async crearUser(userToCreate) {

        const user = await User.create({
            mail: userToCreate.user,
            dateCreate: Date.now(),
            purchases: null

        });

        await user.save();

        return user.id;

    }


    async buscarUser(user) {

        let users = await User.byEmail(user);
        return users;

    }


    securizar(req, res, next) {
        //console.log("Entro a securizar",req)
        const token = req.headers['authorization'];
        //console.log("headers: ",req.headers)
        if (token) {
            console.log("es base")
            let pass = properties.get('config.llave.token')
            jwt.verify(token, pass, (err, decoded) => {
                if (err) {
                    return res.json({ mensaje: 'Token invalida' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(403).send({
                mensaje: 'Token no proveida.'
            });
        }
    };

    verificarToken(token) {

        let pass = properties.get('config.llave.token')

        console.log("pass", pass);

        jwt.verify(token, pass, (err, decoded) => {
            if (!err) {
                console.log("token valido")
                return "Token valido";
            }
            else {
                console.log("tiene error, token invalido", err)
                return "Token invalido";
            }

        });

    }

    async buscarCodeCoupon(code) {

        let codeCoupon = await Coupon.byCode(code);

        if (codeCoupon.length > 0)
            return codeCoupon;
        else
            return null;

    }
    async buscarPurchase(code, user) {
        //console.log("code:", code, "user:", user);
        let purchase = await Purchase.byCodeAndUser(code, user);

        return purchase;


    }

    async updateorderIdProcess(purchaseID, orderId, cb) {

        console.log("Dentro de utils.updatePaymentProcess", purchaseID, orderId);
        let parameters = {
            orderId: orderId
        };

        Purchase.findOneAndUpdate({ _id: purchaseID }, parameters, { new: true }, (err, purchaseUpdated) => {
            console.log("purchase actualizado");
            cb(purchaseUpdated, err);
        });


    }

    async updatePaymentProcess(filter, parameters, cb) {

        console.log("Dentro de utils.updatePaymentProcess ", filter, parameters);
        // let parameters = {
        //     orderId: orderId
        // };



        Purchase.findOneAndUpdate(filter, parameters, { new: true }, (err, purchaseUpdated) => {

            if (!err) {
                console.log("actualizado correctamente: " + purchaseUpdated);
                let sendMailFunc = function (error, res) {
                    console.log("dentro de sendMailFunc");
                    if (res && !error) {
                        let subject = properties.get('mail.mail.subject');
                        let bodyMail = properties.get('mail.mail.body');
                        let urlSite = properties.get('url.site.main');
                        bodyMail = bodyMail.replace("@",purchaseUpdated.orderId);
                        bodyMail = bodyMail.replace("%",urlSite);
                        let EnviaMails = require('./EnviaMails');
                        new EnviaMails(subject, bodyMail, res.mail);
                    }
                    else {
                        console.log("error al querer buscar user" + res);
                    }
                }
                if (parameters.state == "CAPTURED")
                    User.findById(purchaseUpdated.user._id, sendMailFunc);

            }
            else
                console.log("hubo un erorr al querer actualizar ", err);

            cb(purchaseUpdated, err);
        });


    }

    async asociarPurchase(purchaseId, itemId) {


        try {

            //console.log("code:", code, "user:", user);

            console.log("Dentro de utils.asociarPurchase", purchaseId, itemId);
            let purchase = await Purchase.findById({ _id: purchaseId });
            let item = await Item.findById({ _id: itemId });

            let countItems = 0;
            if (!this.isNullOrUndefined(purchase.items))
                countItems = purchase.items.length;
            else {
                //porque a veces items es null
                purchase.items = [];
            }
            if (purchase.items.isMongooseArray) {
                if (!purchase.items.includes(itemId))
                    purchase.items.push(itemId);
            } else {
                throw new Error("Error al querer agregar item al array purchase");
            }
            //actualizo el precio total de la compra
            if (item.price == null) {
                item.price = 500;
            }
            let totalAmount = purchase.totalAmount + item.price;
            purchase.totalAmount = totalAmount;

            console.log("purchase antes de actualizar:", purchase.items);

            await purchase.save();

            return purchase;
        } catch (error) {
            console.log("error:", error);
            return null;

        }
        // await Purchase.findOneAndUpdate({ _id: purchaseId }, parameters, { new: true }, (err, purchaseUpdated) => {



        //     if (!err) {

        //         console.log("no existe error");
        //         resolve(true);










        //     } else {
        //         console.log("existe error un error:",err);
        //         resolve(false);
        //     }

        // });


    }

    async buscarUsers(usersToCreate) {

        for (let index = 0; index < usersToCreate.length; index++) {
            const user = usersToCreate[index];
            // console.log("valor de user en for:",user);
            await this.buscarUser(user.user)
                .then(
                    val => {
                        if (!this.isNullOrUndefined(val)) {

                            //console.log("val", val);
                            usersToCreate[index].id = val._id;
                            this.usersEncontrados.push(val);
                            //console.log("Suma, users ecnotnrados",usersEncontrados);
                        } else {
                            //si no encuentra el usuario lo genera
                            this.usersNoEncontrados.push(user);
                            this.crearUser(user)
                                .then(
                                    response => {
                                        usersToCreate[index].id = response;
                                    });
                        }
                        //console.log("No suma");
                    }

                );
        }
        // console.log("usersEncontrados", this.usersEncontrados.length);
        // console.log("usersNOEncontrados", this.usersNoEncontrados.length);
        // console.log("usersToCreate", usersToCreate.length);
        return usersToCreate;
    }

    async logicaGeneral(rows) {
        //aplico la logica tier para saber a que usuarios ignorar
        let usersToCreate = this.tierLogic(rows);
        //console.log("usersToCreate",usersToCreate);
        //genero el coupon del
        let response = await this.crearCupon();
        //console.log("couponid :",coupon);
        // //si los usuarios no estan creados los creo
        let users = await this.buscarUsers(usersToCreate);
        //console.log("users con id:",users);
        // //genero el purchase para todos los usuarios ya genereados
        //for (let index = 0; index < users.length; index++) {
        for (let index = 0; index < users.length; index++) {

            const u = users[index];
            this.crearPurchase(response.id, u).then((val) => {
                let purchaseId = val;
                console.log("purchaseId:", purchaseId);
                //actualizo el purchaseId en couponId , user 
                this.ActualizarPurchaseId(u.id, purchaseId, false);
                this.ActualizarPurchaseId(coupon, purchaseId, true);
            });

        }

        return response.code;


    }
    //FEED
    async addCommentToFeed(commentId, feedId, cb) {
        try {
            //verifico que exista el commentId
            const comment = await Comment.findById(commentId);
            //verifico que exista el feedId
            const feed = await Item.findById(feedId);

            if (comment && feed) {
                if (Array.isArray(feed.comments)) {
                    let index = feed.comments.indexOf(comment._id);
                    if (index === -1)
                        feed.comments.push(comment._id);
                    else
                        throw new Error("el comentario ya se encuentra en el feed");
                }

                else {
                    feed.comments = [];
                    feed.comments.push(comment._id);
                }
                feed.save();
                cb(feed, null);
            }
            else {
                if (!comment)
                    throw new Error("no se encuentra el comment Id indicado");
                if (!feed)
                    throw new Error("no se encuentra el feed Id indicado");
            }
        } catch (error) {
            //retorno null en la fucntion callback
            cb(null, error);
        }


    }
    async populateReplyWithCallBack(comment, cb) {

        try {
            if (comment.Reply != null && comment.Reply != undefined) {
                comment.Reply = this.populateReply(comment.Reply);

            }


        } catch (error) {
            console.log("error al querer popular commentarios")
            cb(null, error);
        }


    }
    async populateReply(comment) {

        try {
            if (validator.isMongoId(comment)) {
                const Mycomment = await Comment.findById(comment);
                if (Mycomment.Reply != null && Mycomment.Reply != undefined) {
                    if (validator.isMongoId(Mycomment.Reply))
                        this.populateReply(Mycomment.Reply, cb);
                }

            }

        } catch (error) {
            throw new Error("Error al querer popular populateReply()" + error.message)
        }


    }
    //END FEED
    async ActualizarPurchaseId(documentId, purchaseId, isCoupon) {

        console.log("documentId", documentId, "purchaseId", purchaseId, "isCoupon", isCoupon);
        if (isCoupon) {
            //verifico si es Coupon

            console.log("isCoupon: ", isCoupon);
            var coupon = await Coupon.findById({ _id: documentId });
            console.log("coupon: ", coupon);


            if (Array.isArray(coupon.purchases)) {
                console.log("es array");
                coupon.purchases.push(purchaseId);
            } else {
                console.log("NO es array");
                coupon.purchases = [];
                coupon.purchases.push(purchaseId);
            }

            console.log("coupon con id sumado: ", coupon);

            await Coupon.findOneAndUpdate({ _id: documentId }, coupon, { new: true }, (err, CouponUpdated) => {

                if (!err) {
                    console.log("cupon actualizado correctamente", CouponUpdated);
                    //actualizado correctamente

                } else {
                    //error al querer actualizar
                    console.log("cupon no se actualizo correctamente", err);
                }

            });


        } else {
            //verifico si es user
            console.log("isCoupon: ", isCoupon);
            var user = await User.findById({ _id: documentId });
            console.log("user: ", user);
            if (Array.isArray(user.purchases)) {
                console.log("es array");
                user.purchases.push(purchaseId);
            } else {
                console.log("NO es array");
                user.purchases = [];
                user.purchases.push(purchaseId);
            }

            await User.findOneAndUpdate({ _id: documentId }, user, { new: true }, (err, UserUpdate) => {

                if (!err) {
                    console.log("usuario actualizado correctamente", UserUpdate);
                    //actualizado correctamente

                } else {
                    //error al querer actualizar
                    console.log("usuario no se actualizo correctamente");
                }

            });
        }



    }

    verificarFormatoFiles(ext) {
        //console.log("ext",ext);
        if (!validator.isEmpty(ext))
            if (ext == "docx" || ext == "pdf" || ext == "mp3" || ext == "mp4" || ext == "avi")
                return true;
            else
                return false;
        else
            return false;
    }

    descomponerPath(fullPath, ToValidate = 'none') {

        const element = fullPath;
        //console.log("dentro del for", element);
        let so = properties.get('OS.OS.active');
        var ext = "";
        var filePath = element;

        if (so == "windows" || so == undefined) {
            if (element.includes('\\'))
                filePath = element.split('\\')[2];
        }
        else {
            if (element.includes('/'))
                filePath = element.split('/')[2];
        }
        ext = filePath.split('.')[1];

        if (ToValidate == 'image') {
            if (!this.verificarFormatoImagenes(ext)) {
                throw new Error('El formato de la imagen suministrada no es valida')
            }
        }
        else if (ToValidate == 'file')
            if (!this.verificarFormatoFiles(ext)) {
                throw new Error('El formato del File suministrado no es valido')
            }

        let respose = {
            fullPath: fullPath,
            imageWitExt: filePath,
            imageWitOext: filePath.split('.')[0],
            ext: ext
        };

        return respose;

    }

    verificarFormatoFiles(ext) {
        //console.log("ext",ext);
        if (!validator.isEmpty(ext))
            if (ext == "docx" || ext == "pdf" || ext == "mp3" || ext == "mp4" || ext == "avi")
                return true;
            else
                return false;
        else
            return false;
    }

    verificarFormatoImagenes(ext) {
        console.log("ext", ext);
        if (!validator.isEmpty(ext))
            if (ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "bmp")
                return true;
            else
                return false;
        else
            return false;
    }



} module.exports = Utils;