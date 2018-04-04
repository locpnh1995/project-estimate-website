const nodemailer = require('nodemailer');

function sendMail(receiver, content) {
    // Create a SMTP transporter object
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'teamcode.mail@gmail.com',
            pass: '01696868157Do!'
        }
    });
    // Message object
    let message = {
        from: `"TeamCode 👻" <teamcode.mail@gmail.com>`,
        to: `${receiver}`,
        subject: 'You are invited to join teamcode.tk ✔',
        html: `${content}`
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('Error occurred. ' + err.message);
            return process.exit(1);
        }
        console.log('Message sent: %s', info.messageId);

    });
}

module.exports = sendMail;