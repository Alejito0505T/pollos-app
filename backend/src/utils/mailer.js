const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function enviarCorreo({ asunto, html }) {
    await transporter.sendMail({
        from: `"Pollos App" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_DESTINO,
        subject: asunto,
        html
    });
}

module.exports = { enviarCorreo };