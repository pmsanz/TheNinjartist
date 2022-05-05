const mongoose = require('mongoose');
// constructor(public titulo:string,public imagePreview:string,public imageFull:string,public contenido:string, public height:number,public width:number, public weight:number) { }
const CommentSchema = new mongoose.Schema({
    commentID: {
        type: Number, default:0
    },
    email: {
        type: String
    },
    userName: {
        type: String
    },
    comment: {
        type: String
    },
    Reply:
        [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }
        ]
}, {
    timestamps: true
});

CommentSchema
    .pre('save', function (next) {
        var doc = this;
        //busco el ID
        //asigno y pongo next

        let cb = function(err,number){
            if(err)
            console.log("error al querer buscar commentID",err);
            doc.commentID = number[0].commentID + 1;
            next();
        };

        let Comment = mongoose.model('Comment', CommentSchema);
        Comment.find(cb).sort({commentID:-1}).limit(1);
            
       
    });
// .post('save', autoIncrement)

module.exports = mongoose.model('Comment', CommentSchema);