'use strict'

var express = require('express');
var FeedController = require('../controllers/feed');
var router = express.Router();
var Utils = require('../controllers/Utils');
var utils = new Utils();

function securizar (req, res, next) {

    return utils.securizar(req,res,next);
   
};

router.get('/test',FeedController.test);
router.post('/create',FeedController.create);
router.get('/getAll',FeedController.getAll);
router.post('/addComment',FeedController.addComment);


module.exports = router;