const User = require('../models/user');
var validator = require('validator');
const EnviaMails = require('./EnviaMails');
var jwt = require('jsonwebtoken');
var express = require('express');
var propertiesReader = require('properties-reader');
var properties = propertiesReader('./env/properties.file');


module.exports = {
    enviarMail: async (req, res) => {

        var params = req.body;
        var subject = params.subject;
        var cuerpoMail = params.cuerpoMail;

        var datosValidos = !validator.isEmpty(subject) && !validator.isEmpty(cuerpoMail)

        if (datosValidos)
            sendEmail = new EnviaMails(subject, cuerpoMail);


        //  var property = properties.get('app.port');


        return res.send("mail sended!");
    },
    test: async (req, res) => {

        console.log(req.body);
        console.log(req.params);
        var params = req.body;
        //const sendEmail = new EnviaMails("titulo2","comentario2");


        //  var property = properties.get('app.port');


        return res.send("mail sended!");
    },
    create: async (req, res) => {

        console.log(req.body);
        var params = req.body;

        const user = await User.create({
            mail: params.mail,
            dateCreate: Date.now(),
            purchases: params.purchases

        });

        await user.save();
        return res.send(user.id);
    },
    get: async (req, res) => {
        console.log("dentro de getUsers");
        const Users = await User.find({});



        return res.send(Users);
    },
    update: async (req, res) => {


        var parameters = req.body;
        var id = req.params.id;

        console.log("id", id);
        console.log("mail", parameters.mail);
        console.log("dateCreate", parameters.dateCreate);
        console.log("purchases", parameters.purchases);


        //valido id y title
        var datosValidos = !validator.isEmpty(id) && validator.isEmail(parameters.mail)
        //valido content y imageFull
        var dateCreate = !validator.isEmpty(parameters.dateCreate);
        //valido iamgePreview1
        var purchases = !validator.isEmpty(parameters.purchases)

        console.log("User con datos minimos para actualizar", id);

        console.log(datosValidos);
        console.log("dateCreate", dateCreate);

        console.log("purchases", purchases);
        console.log(purchases);


        // //si los datos son validos
        if (datosValidos) {
            User.findOneAndUpdate({ _id: id }, parameters, { new: true }, (err, UserUpdate) => {

                if (!err) {

                    return res.status(200).send(UserUpdate);

                } else {
                    return res.status(500).send({
                        status: 'Error al querer actualizar User',
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
        User.findOneAndDelete({ '_id': id }, (err, UserDeleted) => {

            if (!err) {

                if (UserDeleted)
                    return res.status(200).send({
                        status: 'Se elimino el articulo :', UserDeleted: UserDeleted
                    });
                else
                    return res.status(200).send({
                        status: 'No existe elemento ', Elemento: id
                    });

            } else
                return res.status(200).send({
                    status: 'Error ! al querer eliminar User:' + id
                });

        });

    },
    login: async (req, res) => {

        console.log(req.body);
        console.log(req.params);

        let user = req.body.email;
        let password = req.body.password;

        if (!validator.isEmpty(user) && !validator.isEmpty(password)) {

            let userSearched = await User.byEmail(user);
            console.log("userSerached", userSearched);
            var Utils = require("./Utils");
            var uts = new Utils();

            if (!uts.isNullOrUndefined(userSearched))
                if (userSearched.password == password) {

                    const payload = {
                        check: true
                    };
                    let pass = properties.get('config.llave.token')
                    const token = jwt.sign(payload, pass, {
                        expiresIn: "1d"
                    });
                    let userInterface = {
                        id: userSearched._id,
                        email: userSearched.mail,
                        password: userSearched.password
                    }
                    //let jsonResponse = {id:token,user:userInterface}

                    return res.json({
                        id:token,user:userInterface
                    });
                }

            console.log("Es invalido");
            return res.status(403).json({ mensaje: "Usuario o contraseña incorrectos" })

            // var params = req.body;
            // const sendEmail = new EnviaMails("titulo2", "comentario2");


            // let user = { id: 'id_12345566hsjjd', mail: "pepe@gmail.com", password: "Gire123!" };
            // let token = "token_12321312312";

            // //  var property = properties.get('app.port');


            // return res.send({ id: token, user: user });
        }
    },
    logout: async (req, res) => {

        console.log(req.body);
        console.log(req.params);
        var params = req.body;
        //const sendEmail = new EnviaMails("titulo2","comentario2");


        //  var property = properties.get('app.port');


        return res.send("logout");
    },
    islogin: async (req, res) => {

        // console.log(req.body);
        // console.log(req.params);
        // var params = req.body;
        
        const token = req.params.id;
        //console.log("headers: ",req.headers)
       // console.log("token",token);
        if (token) {
           let pass = properties.get('config.llave.token')
           //console.log("pass",pass);
            jwt.verify(token,pass , (err, decoded) => {
                if (err) {
                    return res.json({ mensaje: 'Token invalida' + err , status: "Error"});
                } else {
                    res.json({ mensaje: 'OK', status: "OK" });
                    
                }
            });
        } else {
            res.status(403).send({
                mensaje: 'Token no proveida.'
            });
        }
    }


}