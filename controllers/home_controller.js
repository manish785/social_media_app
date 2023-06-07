const Post = require('../models/post');

module.exports.home = async function(req, res){
    //console.log(req.cookies);
    //res.cookie('user_id', 25);
    try{
        // let posts = await Post.find({});
        //     return res.render('home', {
        //          title: 'Home',
        //          posts: posts
        //     });

        let posts = await Post.find({}).populate('user').exec();
        return res.render('home', {
                     title: 'Home',
                     posts: posts
                });
    }catch(err){
        console.log(err);
        return;
    }
}