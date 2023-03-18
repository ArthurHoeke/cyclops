var nodemailer = require('nodemailer');

async function sendEmail(email, subject, message) {
    let transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: true,
        auth: {
            user: SMTP_USERNAME,
            pass: SMTP_PASSWORD,
        },
    });

    let mailOptions = {
        from: '"Cyclops 👁️" <' + SMTP_USERNAME + '>',
        to: email,
        subject: subject,
        html: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error.message);
        }
    });
}

module.exports = {
    sendEmail
};