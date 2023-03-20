var nodemailer = require('nodemailer');

const dataUtils = require("../Utils/data.utils");
const user = require('../Controllers/user.controllers');

async function sendEmail(userId, subject, message) {
    const userData = await user.getUserEmailById(userId);

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
        to: userData.email,
        subject: subject,
        html: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(dataUtils.redConsoleLog("SMTP ERROR: ") + error.message);
        }
    });
}

module.exports = {
    sendEmail
};