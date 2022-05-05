const Comment = require('../models/comment');
const path = require('path');
const { isNullOrUndefined } = require('util');
const EnviaMails = require('./EnviaMails');
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
        let userName = ""
        let comment = "";
        let Reply = undefined;
        let parameters = req.body;
        let query = {};

        //asignacion de parametros
        Reply = parameters.Reply;
        comment = parameters.comment;
        userName = parameters.userName;

        //userName

        if (userName != undefined) {
            if (!validator.isEmpty(userName))
                query.userName = userName;
            else
                return res.send({ status: "ERROR", message: "userName is empty!" });
        }

        //comment
        if (comment != undefined) {
            if (!validator.isEmpty(comment))
                query.comment = comment;
            else
                return res.send({ status: "ERROR", message: "comment is empty!" });
        }
        //Reply
        if (Reply != undefined && Reply != null && Reply != '') {
            if (validator.isMongoId(Reply._id))
                query.Reply = Reply._id;
            else
                return res.send({ status: "ERROR", message: "Reply has wrong id!" });
        }

        //create query
        const new_comment = await Comment.create(query);

        // await new_comment.save();
        return res.send({ status: "OK", message: new_comment });
    },
    get: async (req, res) => {

        return res.send("NODE js Services work!");
    },
    delete: async (req, res) => {

        return res.send("NODE js Services work!");
    },

    report: async (req, res) => {

        console.log("reporting comment");

        //creacion de variables y estado inicial
        let commentID = ""
        let commentMessage = ""

        let parameters = req.body;
        let query = {};

        //asignacion de parametros
        commentID = parameters.commentID;
        commentMessage = parameters.commentMessage;

        //commentID

        if (!validator.isEmpty(commentID))
            query.commentID = commentID;
        else
            return res.send({ status: "ERROR", message: "commentID is empty!" });


        //commentMessage

        if (!validator.isEmpty(commentMessage))
            query.commentMessage = commentMessage;
        else
            return res.send({ status: "ERROR", message: "commentMessage is empty!" });


        //create query
        var subject = "Comment Reported!!! Comment ID:" + commentID;
        var cuerpoMail = "A user report this next comment: \r\n CommentID: " + commentID
            + "\r\n With the message: \r\n \r\n" + commentMessage;

        var datosValidos = !validator.isEmpty(commentID) && !validator.isEmpty(commentMessage);

        try {
            if (datosValidos)
                sendEmail = new EnviaMails(subject, cuerpoMail);

            let msgResponse = "The comment CommentID: " + commentID + " was reported, successfully!";
            // await new_comment.save();
            return res.send({ status: "OK", message: msgResponse });
        } catch (error) {

            console.log("Error al querer enviar Mail en Comment.Report");
            return res.send({ status: "ERROR", message: "Error sending mail!" });
        }

    }


}