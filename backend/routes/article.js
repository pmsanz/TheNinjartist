'use strict'


var express = require('express');


var ArticleController = require('../controllers/article');
var multiparty = require('connect-multiparty');
var md_upload = multiparty({uploadDir:'./upload/articles/'});

var router = express.Router();

router.get('/testControlladorGet',ArticleController.testGet);
router.post('/testControlladorPost',ArticleController.testPost);


router.get('/save',ArticleController.save);
router.post('/save',ArticleController.save);

router.post('/getArticles',ArticleController.getArticles);
router.post('/getArticle',ArticleController.getArticle);

router.put('/article/:id',ArticleController.update);
router.delete('/article/:id',ArticleController.delete);

router.post('/upload-image/:id',md_upload ,ArticleController.upload);


router.get('/getImage/:image',ArticleController.getImage);
router.get('/search/:search',ArticleController.search);


module.exports = router;