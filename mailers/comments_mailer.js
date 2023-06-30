const nodeMailer = require('../config/nodemailer');


// this is another way of exporting a method
exports.newComment = (comment) =>{
    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from: 'kumarachilish1997@gmail.com',
        //to: comment.user.email,
        to:  'kumarachilish1997@gmail.com',
        subject: "New Comment Published!",
        html:  htmlString,
        auth: {
            user: 'kumarachilish1997@gmail.com', // Update with your Gmail address
            pass: 'ojdvucevqhhludtw', // Update with the generated application-specific password
          },
    },(err, info)=>{
        if(err){
            console.log('error is  sending email', err);
            return;
        }

       // console.log('Message sent', info);
        return;
    });
}