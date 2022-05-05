const Item = require('../models/item');
const path = require('path');
const { isNullOrUndefined } = require('util');
var Utils = require('./Utils');
var validator = require('validator');
const fs = require('fs');
var propertiesReader = require('properties-reader');
const PropertiesReader = require('properties-reader');
var properties = propertiesReader('./env/properties.file');


module.exports = {


    test: async (req, res) => {

        return res.send("NODE js Services work!");
    },

    create: async (req, res) => {

        //creacion de variables y estado inicial
        let tittle = ""
        let image = ""
        let description = "";

        let parameters = req.body;
        let query = {};

        //asignacion de parametros
        description = parameters.description;
        tittle = parameters.tittle;
        image = parameters.image;


        //title throw error
        if (!validator.isEmpty(tittle))
            query.tittle = tittle;

        //image throw error
        if (!validator.isEmpty(image))
            query.image = image;

        //description puede venir vacio
        if (description != undefined && description != null)
            query.description = description;

        //create query
        const new_Feed = await Feed.create(query);

        await new_Feed.save();

        return res.send(new_Feed);
    },
    get: async (req, res) => {

        return res.send("NODE js Services work!");
    },
    getAll: async (req, res) => {
        
        const feeds = await Item.find({publicationType:"Feed"})
            // .populate("comments")
            .populate({
                path: "comments", // populate comments
                populate: {
                    path: "Reply", // in blogs, populate comments
                    // select: "commentID",
                    options: { sort: { 'createdAt': -1 } }

                }
            })
            .sort({ createdAt: -1 });

        return res.send({ "status": "OK", message: feeds });

    },
    addComment: async (req, res) => {

        //creacion de variables y estado inicial
        let commentId = ""
        let feedId = "";

        let parameters = req.body;
        let query = {};

        //asignacion de parametros
        commentId = parameters.commentID;
        feedId = parameters.feedID;

        if (!validator.isEmpty(feedId) && !validator.isEmpty(commentId)) {

            try {
                //actualizo el feed con el comentario
                let cb = function (result, error) {
                    if (!error)
                        return res.send({ "status": "OK", message: "feedId actualizado correctamente: " + feedId });
                    else
                        return res.send({ "status": "error", message: "error description: " + error });
                };

                let util = new Utils();
                util.addCommentToFeed(commentId, feedId, cb);

            } catch (error) {
                return res.send({ "status": "error", message: error });
            }


        }
    },
    delete: async (req, res) => {

        return res.send("NODE js Services work!");
    }


}