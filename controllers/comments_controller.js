const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');
const jwt = require('jsonwebtoken');
const secret = 'Manish@9876';



module.exports.usersCreateComment = async (req, res) => {
  const post = await Post.findById(req.params.id); 

  return res.render('user_create_comment', {
      title: 'Create Comment',
      post
  }); 
};


module.exports.create = async function(req, res){

  const token = req.cookies.token;

    // try{
    // }catch(err){
        
    // }
    // Post.findById(req.body.post)
    //   .then(post => {
    //       if(post){
    //           return Comment.create({
    //               content: req.body.content,
    //               post: req.body.post,
    //               user: req.user._id,
    //           });
    //       } else {
    //           throw new Error('Post not found');
    //       }
    //   })
    //   .then(comment => {
    //      // console.log(comment)
    //       post.comment.push(comment);
    //      // console.log(post)
    //       return post.save();
    //   })
    //   .then(() => {
    //       res.redirect('/');
    //   })
    //   .catch(err => {
    //       console.log('error', err);
    //   });
    try {
      const post = await Post.findById(req.params.id);
      // console.log('elon bhai1', post);

      if (!token) {
        throw new Error('Token is missing');
      }

      const decoded = jwt.verify(token, secret);
      const user = await User.findOne( {email : decoded.email})
      if (!user) {
          throw new Error('User data is missing in the token');
      }

    
      if (post) {
        var comment = await Comment.create({
          content: req.body.content,
          // here, linking comment through postId and userId
          post: post._id,
          user: user._id,
        });
        
        console.log('comments', comment);
        post.comments.push(comment);
        await post.save();
    
        comment = await comment.populate({ path: 'user', select: 'name email' });
    
       // commentsMailer.newComment(comment);
        // let job = queue.create('emails', comment).save(function(err){
        //   if(err){
        //     console.log('error in sending to the queue', err);
        //     return;
        //   }

        //   console.log('job enqueued', job.id);
        // });

        return res.status(200).json({
          data: {
            comment: comment,
          },
          message: "Comment created successfully!",
        });
        
    
      }
    } catch (err) {
      console.log('error', err);
      return;
    }      
}

module.exports.getComment = async function(req, res){

    try {
      const comment = await Comment.findById(req.params.id);
    
      return res.status(200).json({
        data: {
          comment: comment.content,
        },
        message: "Comment Fetched Successfully!",
      });
    } catch (err) {
      console.log('error', err);
      return;
    }      
}

module.exports.updateComment = async function(req, res){

  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);

    if(comment){
      comment.content = content;
      
      return res.status(200).json({
        data: {
          comment: comment.content,
        },
        message: "Comment Fetched Successfully!",
      });
    }

  } catch (err) {
    console.log('error', err);
    return;
  }      
}

module.exports.destroy = async function(req, res){
  const token = req.cookies.token;

  try{
      let comment = await Comment.findById(req.params.id);
      
      if(!token){
          throw new Error('Token is missing');
      }

      const decoded = jwt.verify(token, secret);
      const user = await User.findOne ({email : decoded.email});
     
      if(!user){
        throw new Error('User data is missing in the token');
      }
      
      // post.user.equals(user._id)
      if (comment.user.equals(user._id)){
          
          let postId = comment.post;
          comment.deleteOne();
          let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

          // CHANGE :: destroy the associated likes for this comment
          // await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});


          // send the comment id which was deleted back to the views
         
          // return res.status(200).json({
          //     data: {
          //         comment_id: req.params.id
          //     },
          //     message: "Post deleted"
          // });
         

         return res.status(200).json({
           message : 'Comments Deleted Successfully!'
         })
      }else{
          req.flash('error', 'Unauthorized');
          return res.redirect('back');
      }
  }catch(err){
      req.flash('error', err);
      return;
  } 
}