const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path')




let transpoter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth:{
        user: 'ksagar00721@gmail.com',
        pass: '#Avenger007'

    }

});

let renderTemplate = (data,relativePath)=>{
    let mailHtml;
    ejs.renderFile(
        path.join(__dirname, '../views/mailer', relativePath),
        data,
        function(err, template){
            if(err){console.log('error in rnedering template'); return}

            mailHtml = template; 
        }
    )
    return mailHtml;
}

module.exports ={
    transpoter: transpoter,
    renderTemplate: renderTemplate
}