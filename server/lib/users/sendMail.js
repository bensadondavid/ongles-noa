const nodemailer = require("nodemailer");

const sendMail = async(email, subject, htmlContent)=>{
    try{
        const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "amouyalnoa25@gmail.com",
            pass: process.env.NODEMAILER_PASSWORD,
        },
        });
        const info = await transporter.sendMail({
        from: '"Noa Bensadon" <amouyalnoa25@gmail.com>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        html: htmlContent
        });
    }
    catch(error){
        console.log(error);
    }
}

module.exports = sendMail