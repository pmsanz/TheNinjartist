'use strict'


var express = require('express');


var PruchasesController = require('../controllers/purchase');
var multiparty = require('connect-multiparty');
var md_upload = multiparty({uploadDir:'./upload/items/'});

var router = express.Router();

router.get('/test',PruchasesController.test);
router.get('/get',PruchasesController.get);
router.post('/create',PruchasesController.create);
router.post('/update/:id',PruchasesController.update);
router.post('/download/:id',PruchasesController.download);
router.post('/getById/:id',PruchasesController.getById);
router.post('/verificarCoupon',PruchasesController.verificarCoupon);
router.post('/downloadByOrderId',PruchasesController.downloadByOrderId);
router.post('/crearCompra',PruchasesController.crearCompra);
router.post('/asociarCompra',PruchasesController.asociarCompra);
router.post('/setAprove',PruchasesController.setAprove);
router.post('/captureOrder',PruchasesController.captureOrder);
router.post('/delete/:id',PruchasesController.delete);

module.exports = router;