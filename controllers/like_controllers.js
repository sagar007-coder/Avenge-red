const mongoose = require('mongoose');
const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comments');
const { transformFunctionListItemReply } = require('@redis/client/dist/lib/commands/generic-transformers');


module.exports.toggleLike = async function(req, res){
    try{
        console.log("inside like",req.query.id);
        //req.query.id = mongoose.Types.ObjectId(req.query.id);
        

        //likes/toggle/?id=abcf&type=post
        let likeable;
        let deleted = false;

        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
          }  
          else{
            likeable = await Comment.findById(req.query.id).populate('likes');

            }

            //check if likes already exixts???
            let exixtingLike = await Like.findOne({
                likeable: req.query.id,
                onModel: req.query.type,
                user: req.user._id
            })

            //if a like already exists then delete it
            if(exixtingLike){
                likeable.likes.pull(exixtingLike._id);
                likeable.save();


                exixtingLike.remove();
            }else{
                //else make a new like

                let newLike = await Like.create({

                    user:req.user._id,
                    likeable: req.user.id,
                    onModel: req.query.type

                });

                likeable.likes.push(newLike._id);
                likeable.save();

                


            }

            return res.json(200,{
                message: "Request succesful",
                data:{
                    deleted: deleted
                }
            })

    }catch(err){
        console.log(err);
        return res.json(500,{
            message: 'Internal Server Error'
        });
    }
}