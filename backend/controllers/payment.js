
const path = require('path');
const { isNullOrUndefined } = require('util');
var validator = require('validator');
const fs = require('fs');
var propertiesReader = require('properties-reader');
const PropertiesReader = require('properties-reader');
var properties = propertiesReader('./env/properties.file');
const { isTypeOnlyImportOrExportDeclaration } = require('typescript');

const createOrder = require('./../PayPal/createOrder').createOrder;
const captureOrder = require('./../PayPal/captureOrder').captureOrder;

module.exports = {


    test: async (req, res) => {

        return res.send("NODE js Services work!");
    },

    create: async (req, res) => {

        // let amount = req.body.amount;
        // let discount = 0;
        // let response = await createOrder(amount,discount,false);
        // console.log("Creating Order...");
        // let orderId = "";
        // if (response.statusCode === 201) {
        //     console.log("Created Successfully",response.result.id);
        //     orderId = response.result.id;
            
        //     return res.send("OrderId Created: https://www.sandbox.paypal.com/checkoutnow?token="+orderId);
        // }

        return res.send("Metodo deshabilitado");
    },
    capture: async (req, res) => {

        let orderId = req.body.orderId;

        
        try {
            console.log('Capturing Order... '+orderId);
            response = await captureOrder(orderId);
            // let captureId = "";
            if (response.statusCode === 201){
                
                return res.send({ "OrderId Captured Correctly!: ": orderId });
            }

        }
        catch (err) {

            return res.send({ "Error capturing: ": orderId, "error": err });
        }



    },
    authorize: async (req, res) => {


    }


}