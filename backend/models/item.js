const mongoose  = require('mongoose');
// constructor(public titulo:string,public imagePreview:string,public imageFull:string,public contenido:string, public height:number,public width:number, public weight:number) { }
const ItemSchema = new mongoose.Schema({
    titulo:{
        type:String
    },
    contenido :{
        type: String
    },
    imageFull :
        [
            {type: String}
        ]
    ,
    imagePreview :{
        type:String
        
    },
    height :{
        type:Number
        
    },
    width :{
        type:Number
        
    },
    weight :{
        type:Number
        
    },
    price :{
        type:Number
        
    },
    publicationType: {
        type: String,
        enum : ['Store','Feed'],
        default: 'Store'
    },
    comments :
        [
            {type: mongoose.Schema.Types.ObjectId,ref:'Comment'}
        ],
    purchases : [
        {type: mongoose.Schema.Types.ObjectId,ref:'Purchase'}
    ]
},{
    timestamps:true
});
// Item (Titulo - Contenido - ImageFull - ImagePreview1- ImagePreview2 -ImagePreview3   )

module.exports = mongoose.model('Item',ItemSchema);