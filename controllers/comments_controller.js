const Comment = require('../models/comments');
const Post = require('../models/post');
const commentsMailer = require('../mailer/comments.mailer');
const Like = require('../models/like');

module.exports.create = async function(req, res){
    try{
        let post =await Post.findById(req.body.post);

            if (post){
            
                let comment =await Comment.create({
                    content: req.body.content,
                    post: req.body.post,
                    user: req.user._id
                }); 
                    // handle error
    
                    post.comments.push(comment);
                    post.save();


                    comment = await comment.populate(['user']);
                    commentsMailer.newComment(comment);

                    if(req.xhr){
                        //similar for comments to fetch the user's id!!
                        //comment = await comment.populate('user', 'name').execPopulate();

                        return res.status(200).json({
                            data:{
                                comment : comment
                            },
                            message : "Post Created!!!"
                        });
                    }
    
                    //res.flash('Success', 'Comment published!!');

                    res.redirect('/');
                }
        } catch(err){
           console.log('error',err);
            return;
    }
}
    

 

module.exports.destroy = async function(req ,res){
    try{
        let comment = await Comment.findById(req.params.id );            
        if (comment.user == req.user.id){
    
    
                let postId = comment.post;
    
                comment.remove();
    
                let post= await Post.findByIdAndUpdate(postId, {$pull : {comments: req.params.id}});


                await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});
                 // send the comment id which was deletd back to the views
                if (req.xhr){
                    return res.status(200).json({
                        data: {
                            comment_id: req.params.id
                        },
                        message: "Post deleted"
                    });
                }
    
    
                req.flash('success', 'Comment deleted!');
    
                return res.redirect('back');
                    
        }
            else{
                req.flash('error', 'Unauthorized');
                return res.redirect('back');
        };
        
    
    }catch(err){
        req.flash('error', err);
        return;
    }
  

}