'use strict'


var express = require('express');
var ItemController = require('../controllers/item');
var ItemControllerFree = require('../controllers/itemFree');
var multiparty = require('connect-multiparty');
var md_upload = multiparty({uploadDir:'./upload/items/'});
var router = express.Router();
var Utils = require('../controllers/Utils');
var utils = new Utils();

function securizar (req, res, next) {

    return utils.securizar(req,res,next);
   
};

router.get('/test',ItemControllerFree.test);
router.get('/getStore',ItemControllerFree.getStore);
router.get('/getFeed',ItemControllerFree.getFeed);
router.get('/getImage/:image',ItemControllerFree.getImage);

router.get('/getSecure/:id',securizar,ItemController.getSecure);
router.get('/getSecure',securizar,ItemController.getAllSecure);

router.post('/create',securizar,ItemController.create);
router.post('/upload/:id?',md_upload,ItemController.upload);
router.post('/update/:id',securizar,ItemController.update);
router.post('/deleteImage/:id',securizar,ItemController.deleteImage);
router.post('/delete/:id',securizar,ItemController.delete);
router.post('/createNew',ItemController.createNew);


module.exports = router;