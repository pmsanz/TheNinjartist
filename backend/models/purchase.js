const mongoose = require('mongoose');
const PurchaseSchema = new mongoose.Schema({
    purchaseCod: {
        type: Number,
        required: '{PATH} is required!'
    },
    totalImages: {
        type: String
    },
    codeCoupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon'
    },
    state: {
        type: String,
        default: "NOT VERIFIED"
    },
    orderId: {
        type: String,
        default: ""
    },
    payerId: {
        type: String,
        default: ""
    },
    totalAmount: {
        type: Number,
        default: 0
    },
    items: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }
    ],
    user:
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dateCreate: { type: Date, default: Date.now },
}, {
    timestamps: true
})
// Compra ( id - Total imagenes - Codigo coupon - fecha compra 
// Compra-Item
PurchaseSchema.statics.byCodeAndUser = function (codeId, userId) {
    // console.log("codeId:", codeId);
    // console.log("userId:", userId);
    return this.find({
        user: userId,
        codeCoupon: codeId
    });
};

PurchaseSchema.statics.byOrderID = function (orderId) {
    // console.log("codeId:", codeId);
    // console.log("userId:", userId);
    return this.find({
        orderId: orderId
    });
};

module.exports = mongoose.model('Purchase', PurchaseSchema);