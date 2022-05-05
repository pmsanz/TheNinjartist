'use strict'

var express = require('express');
var CouponController = require('../controllers/coupon');
var multiparty = require('connect-multiparty');
var md_upload = multiparty({ uploadDir: './upload/files/' });
var router = express.Router();


router.get('/test', CouponController.test);
router.get('/get', CouponController.get);
router.post('/create', CouponController.create);
router.post('/update/:id', CouponController.update);
router.post('/upload', md_upload, CouponController.upload);
router.post('/uploadMessage', md_upload, CouponController.uploadMessage);
router.post('/verificarCoupon', CouponController.verificarCoupon);
router.delete('/delete/:id', CouponController.delete);

module.exports = router;