'use strict'

var express = require('express');
var PaymentController = require('../controllers/payment');
var router = express.Router();
var Utils = require('../controllers/Utils');
var utils = new Utils();

function securizar (req, res, next) {

    return utils.securizar(req,res,next);
   
};

router.get('/test',PaymentController.test);
router.post('/create',PaymentController.create);
router.post('/capture',PaymentController.capture);
router.post('/authorize',PaymentController.authorize);



module.exports = router;