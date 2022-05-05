'use strict'

var express = require('express');
var userController = require('../controllers/user');
var multiparty = require('connect-multiparty');
var jwt = require('jsonwebtoken');
var propertiesReader = require('properties-reader');
var properties = propertiesReader('./env/properties.file');
var router = express.Router();
//rutas protegidas con jwt
function securizar (req, res, next) {
        
        const token = req.headers['access-token'];
        if (token) {
            console.log("es base")
            let pass = properties.get('config.llave.token')
            jwt.verify(token, pass, (err, decoded) => {
                if (err) {
                    return res.json({ mensaje: 'Token inválida' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.send({
                mensaje: 'Token no proveída.'
            });
        }
};

router.get('/test', userController.test);
router.get('/get', userController.get);
router.post('/create', userController.create);
router.post('/update/:id', userController.update);
router.post('/enviarMail', userController.enviarMail);
router.post('/login',userController.login);
router.get('/isLogin/:id',userController.islogin);
router.post('/logout', userController.logout);
router.delete('/delete/:id', userController.delete);

module.exports = router;