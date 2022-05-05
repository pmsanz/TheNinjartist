'use strict';
var propertiesReader = require('properties-reader');
var properties = propertiesReader('./env/properties.file');
/**
 * PayPal SDK dependency
 */
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

/**
 * PayPal HTTP client dependency
 */
const payPalClient = require('../Common/payPalClient');

/**
 * Setting up the JSON request body for creating the Order. The Intent in the
 * request body should be set as "CAPTURE" for capture intent flow.
 * 
 */


function validateSale(referenceID, amount, discount) {

    let nAmount = parseFloat(amount);
    let nDiscount = parseFloat(discount);
    let totalAmount = 0;

    if (!Number.isNaN(nAmount) && !Number.isNaN(nDiscount)) {

        if (nAmount < nDiscount)
            throw new Error("Amount is less than discount");

        if (referenceID == null || referenceID == undefined || referenceID == "")
            throw new Error("referenceID is null or empty");

        //parseo en decimales
        nAmount = nAmount / 100;
        nDiscount = nDiscount / 100;

        //totalAmount es el valor que se va a abonar, Si el producto vale 10$, y tengo un descuento de 5$, totalAmount, va a ser 5$.
        totalAmount = nAmount - nDiscount;

        console.log("Validating createOrder:",referenceID, totalAmount, nAmount, nDiscount);

        return buildMinimumRequestBody(referenceID,totalAmount.toString(10), nAmount.toString(10), nDiscount.toString(10));
    } else {

        throw new Error("Amount or discount , not are a number");
    }





}

function buildMinimumRequestBody(referenceId, totalAmount, amount, discount) {
    return {
        "intent": "CAPTURE",
        "application_context": {
            "return_url": properties.get('PAYPAL.API.URL_SUCCESS'),
            "cancel_url": properties.get('PAYPAL.API.URL_ERROR')
        },
        "purchase_units": [
            {
                "reference_id": "PEPES",
                "description": referenceId,
                "amount": {
                    "currency_code": "USD",
                    "value": totalAmount,
                    "breakdown": {
                        "item_total": {
                            "currency_code": "USD",
                            "value": amount
                        },
                        "shipping_discount": {
                            "currency_code": "USD",
                            "value": discount
                        }
                    }
                }
            }
        ]
    };
}


/**
 * This is the sample function which can be sued to create an order. It uses the
 * JSON body returned by buildRequestBody() to create an new Order.
 */
async function createOrder(referenceId,amount, discount, debug = false) {
    try {
        const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
        request.headers["prefer"] = "return=representation";
        request.requestBody(validateSale(referenceId,amount, discount));
        const response = await payPalClient.client().execute(request);
        if (debug) {
            console.log("Status Code: " + response.statusCode);
            console.log("Status: " + response.result.status);
            console.log("Order ID: " + response.result.id);
            console.log("Intent: " + response.result.intent);
            console.log("Links: ");
            response.result.links.forEach((item, index) => {
                let rel = item.rel;
                let href = item.href;
                let method = item.method;
                let message = `\t${rel}: ${href}\tCall Type: ${method}`;
                console.log(message);
            });
            console.log(`Gross Amount: ${response.result.purchase_units[0].amount.currency_code} ${response.result.purchase_units[0].amount.value}`);
            // To toggle print the whole body comment/uncomment the below line
            console.log(JSON.stringify(response.result, null, 4));
        }
        return response;
    }
    catch (e) {
        console.log(e)
    }

}

/**
 * This is the driver function which invokes the createOrder function to create
 * an sample order.
 */
if (require.main === module) {
    (async () => await createOrder(true))();
}

/**
 * Exports the Create Order function. If needed this can be invoked from the
 * order modules to execute the end to flow like create order, retrieve, capture
 * and refund(Optional)
 */

module.exports = { createOrder: createOrder };



