'use strict'

const nodemailer = require('nodemailer');
require('dotenv').config();

this.enviarMail = (email, asunto, mensaje) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: asunto,
        html:
        `<html>
            <body>
            <h1>Tarea Creada</h1>
            <p>Se ha creado</p>
            </body>
        </html>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email enviado: ' + info.response);
        }
    });

};

module.exports = this;