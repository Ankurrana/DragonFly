var nodemailer = require('nodemailer');

function sendEmail(reciever,subject,body) {
    // Not the movie transporter!
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'yourtaskkeeper@gmail.com', // Your email id
            pass: 'Task233p3r' // Your password
        }
    });

    var mailOptions = {
        from: 'yourtaskkeeper@gmail.com', // sender address
        to: reciever, // list of receivers
        subject: subject, // Subject line
        text: body //, // plaintext body
        // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
    };


    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            // res.json({yo: 'error'});
        }else{
            // console.log('Message sent: ' + info.response);
        //    / res.json({yo: info.response});
        };
    });
}



module.exports = sendEmail;
