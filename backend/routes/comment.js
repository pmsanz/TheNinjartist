'use strict'

var express = require('express');
var CommentController = require('../controllers/comment');
var router = express.Router();
var Utils = require('../controllers/Utils');
var utils = new Utils();

function securizar (req, res, next) {

    return utils.securizar(req,res,next);
   
};

router.get('/test',CommentController.test);
router.post('/create',CommentController.create);
router.post('/report',CommentController.report);
// router.get('/getFeed',ItemControllerFree.getFeed);
// router.get('/getImage/:image',ItemControllerFree.getImage);



module.exports = router;