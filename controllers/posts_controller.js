const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const secret = 'Manish@9876';



module.exports.usersCreatePost = async (req, res) => {
   
    return res.render('user_create_post', {
        title: 'Create Post',
    }); 
};


module.exports.postCreate = async (req, res) => {
    const token = req.cookies.token;
    
    try{
        const { content } = req.body;
        if (!token) {
            throw new Error('Token is missing');
        }

        const decoded = jwt.verify(token, secret);
        const user = await User.findOne( {email : decoded.email})
        if (!user) {
            throw new Error('User data is missing in the token');
        }

        const post = await Post.create({
            content,
            user: user._id,
        });
        
        return res.status(200).json({
            message: 'Post created successfully!'
        })
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');    
    }
};

module.exports.destroy = async function(req, res){
    const token = req.cookies.token;

    try{
         // .id means converting the object id into the string
        let post = await Post.findById(req.params.id)
        if (!token) {
            throw new Error('Token is missing');
        }

        const decoded = jwt.verify(token, secret);
        const user = await User.findOne( {email : decoded.email})
        if (!user) {
            throw new Error('User data is missing in the token');
        }

        if (post.user.equals(user._id)){
            await post.deleteOne();

            req.flash('success', 'Post and associated comments deleted!');
            return res.redirect('back');
            
            // try{
            //     await Comment.deleteMany({post: req.params.id});
                
            //     res.status(200).json({
            //         data:{
            //             post_id: req.params.id
            //         },
            //         message: 'Post deleted ',
            //     })
        
            //     req.flash('success', 'Post and associated comments deleted!');
            //     return res.redirect('back');
            // }catch(err){
            //    // console.log('error in deleting post', err);
            //     req.flash('error', err);
            //     return res.redirect('back');
            // }
        }
    }catch(err){
        req.flash('error', 'You can not delete this post');
        return res.redirect('back');
    } 
}