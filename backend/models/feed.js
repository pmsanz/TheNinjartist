const mongoose  = require('mongoose');
// constructor(public titulo:string,public imagePreview:string,public imageFull:string,public contenido:string, public height:number,public width:number, public weight:number) { }
const FeedSchema = new mongoose.Schema({
    tittle:{
        type:String
    },
    description :{
        type: String
    },
    image :{
        type: String
    },
    comments :
        [
            {type: mongoose.Schema.Types.ObjectId,ref:'Comment'}
        ]
},{
    timestamps:true
});
// Item (Titulo - Contenido - ImageFull - ImagePreview1- ImagePreview2 -ImagePreview3   )

// var autoPopulateChildren = function(next) {
//     this.populate('comments');
//     next();
// };

// FeedSchema
// .pre('findOne', autoPopulateChildren)
// .pre('find', autoPopulateChildren)

module.exports = mongoose.model('Feed',FeedSchema);