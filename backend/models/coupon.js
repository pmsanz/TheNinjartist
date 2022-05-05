const mongoose = require('mongoose');
const CouponSchema = new mongoose.Schema({
    codeCoupon: {
        type: String,
        required: '{PATH} is required!'
    },
    dateCreated: { type: Date, default: Date.now },
    dateUsed: { type: Date },
    discount: { type: Number , default:0 },
    purchases: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' }
    ]
}, {
    timestamps: true
})
CouponSchema.statics.byCode = function (code) {
    // console.log("email schema:",email);
    return this.find({ codeCoupon: new RegExp(code, 'i') }).exec();
};

//( CodeCoupon - fecha creación - fecha used)
module.exports = mongoose.model('Coupon', CouponSchema);