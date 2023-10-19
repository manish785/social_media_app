const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const secret = 'Manish@9876';



module.exports.usersCreatePost = async (req, res) => {
    const token = req.cookies.token;

    try {
        if (!token) {
            throw new Error('Token is missing');
        }
        const decoded = jwt.verify(token, secret);
        const user = await User.findOne( {email : decoded.email})
    
        if (!user) {
            throw new Error('User data is missing in the token');
        }

        return res.render('user_create_post', {
            user,
            title: 'Create Post',
        });
    } catch (err) {
        console.log('error', err);
        return res.status(401).json({ error: 'Token is invalid or expired' });
    }
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
            data:{
                post: post
            },
            message: 'Post created successfully!'
        })
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');    
    }
};

module.exports.destroy = async function(req, res){
    try{
         // .id means converting the object id into the string
        let post = await Post.findById(req.params.id)

        if(post.user == req.user.id){
            console.log(post.user);
            console.log(req.user.id);
            post.deleteOne();
            
            try{
                await Comment.deleteMany({post: req.params.id});
                

                if(req.xhr){
                    return res.status(200).json({
                        data:{
                            post_id: req.params.id
                        },
                        message: 'Post deleted ',
                    })
                }


                //req.flash('success', 'Post and associated comments deleted!');
                return res.redirect('back');
            }catch(err){
               // console.log('error in deleting post', err);
                req.flash('error', err);
                return res.redirect('back');
            }
        }
    }catch(err){
        //console.log('error in destroying post', err);
        req.flash('error', 'You can not delete this post');
        return res.redirect('back');
    } 
}