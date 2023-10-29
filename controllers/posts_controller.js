const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const { validateToken } = require('../services/authentication')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secret = process.env.SECRET;


module.exports.usersCreatePost = async (req, res) => {
   
    return res.render('user_create_post', {
        title: 'Create Post',
    }); 
};


module.exports.postCreated = async (req, res) => {
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

module.exports.fetchPostDetails = async function(req, res){
    const token = req.cookies.token;

    try{
         // .id means converting the object id into the string
        if (!token) {
            throw new Error('Token is missing');
        }
       
        validateToken(token);
        let post = await Post.findById(req.params.id);
        return res.status(200).json({
            message : 'Post find successfully',
            post
        })
               
    }catch(err){
        console.error(err); // Log the error for debugging
        req.flash('error', 'You can not delete this post ' + err.message);
    } 
}

module.exports.fetchAllPostDetails= async function(req, res){
    const token = req.cookies.token;

    try{
        if (!token) {
            throw new Error('Token is missing');
        }

        validateToken(token);
        let post = await Post.find({});
        return res.status(200).json({
            message : 'All Post has been fetched successfully',
            post
        })
            
    }catch(err){
        console.error(err); // Log the error for debugging
        req.flash('error', 'Error, while finding post ' + err.message);
    } 
}

module.exports.updatePost = async function(req, res){
    const token = req.cookies.token;

    try{
         // .id means converting the object id into the string
        const { content } = req.body;
      
        let post = await Post.findById(req.params.id);
        if (!post) {
            throw new Error('Post not found or you do not have permission to update it');
        }

        post.content = content;
        let data = await post.save();

        return res.status(200).json({
            message: 'Post updated successfully!',
            data
        });
 
    }catch(err){
        console.error(err); // Log the error for debugging
        req.flash('error', 'You can not update this post ' + err.message);
    } 
}

module.exports.destroyPost = async function(req, res){
    const token = req.cookies.token;

    try{
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
            
        }
    }catch(err){
        req.flash('error', 'You can not delete this post');
        return res.redirect('back');
    } 
}

module.exports.destroyAllPost= async function(req, res){
    const token = req.cookies.token;

    try{
        if (!token) {
            throw new Error('Token is missing');
        }

        validateToken(token);
        await Post.deleteMany();
        return res.status(200).json({
            message : 'All the post has been deleted successfully'
        })    
    }catch(err){
        console.error(err); // Log the error for debugging
        req.flash('error', 'You can not delete this post ' + err.message);
        return res.redirect('back');
    } 
}