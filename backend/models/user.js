const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    mail :{
        type:String,
        required: '{PATH} is required!'
    },
    password :{
        type:String
       
    },
    dateCreate: {
        type: Date, default: Date.now
    },
    purchases : [
        {type: mongoose.Schema.Types.ObjectId,ref:'Purchase'}
    ]
},{
    timestamps: true
})

UserSchema.statics.byEmail = function(email) {
   // console.log("email schema:",email);
    return this.findOne({ mail: new RegExp(email, 'i') });
  };

module.exports = mongoose.model('User',UserSchema);