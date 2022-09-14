const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
    content : {
        type : String,
        required: true
    },
    //comment belongd toa user
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required:'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        required:'Post'
    },
    likes : [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like'
        }
     ],
}, {
    timestamps: true

});
const Comment = mongoose.model('Comment',commentSchema);
module.exports =Comment;

