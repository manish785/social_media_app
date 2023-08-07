const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){


    let posts = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
        path: 'comments',
        populate:{
            path: 'user'
        }
    })
    .exec() 


    return res.json({
        message: "List of posts",
        posts: posts
    })
}

module.exports.destroy = async function(req, res){
    try{
         // .id means converting the object id into the string
        let post = await Post.findById(req.params.id)

       if(post.user == req.user.id){
            post.deleteOne();
            
    
            await Comment.deleteMany({post: req.params.id});
                

                // if(req.xhr){
                //     return res.status(200).json({
                //         data:{
                //             post_id: req.params.id
                //         },
                //         message: 'Post deleted ',
                //     })
                // }


                //req.flash('success', 'Post and associated comments deleted!');
            return res.json(200,{
                message: "Post and associated comments deleted successfully!",
            })
        }else{
            // this case will handle will the unauthorized user, only authorized users can delete the post
            return res.json(401, {
                message: 'You can not delete this post!'
            })
        }
       
    }catch(err){
        console.log('error in destroying post', err);
       req.flash('error', 'You can not delete this post');
        return res.json(500,{
             message: 'Internal Server Error',
        })
    } 
}



