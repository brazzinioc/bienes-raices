import nodemailer from 'nodemailer';
import { SESClient, SendRawEmailCommand } from '@aws-sdk/client-ses';
import { defaultProvider } from '@aws-sdk/credential-provider-node';

const registerEmail = async (data) => {
    const sesClient = new SESClient({
        apiVersion: '2012-12-01',
        region: 'us-east-1',
        defaultProvider,
    });

    const transporter = nodemailer.createTransport({
        SES: { 
            ses: sesClient, 
            aws: { SendRawEmailCommand } 
        },
    });

    const { email, name, token } = data;

    const sendMail = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Confirma tu cuenta en BienesRaices.com",
        text: "Confirma tu cuenta en BienesRaices.com",
        html: `
            <p>Hola ${name}, comprueba tu cuenta en BienesRaices.coms</p>
            <p>Tu cuenta ya está lista, sólo debes confirmarla en el siguiente enlace: <a href="${process.env.PROJECT_URL}:${process.env.PROJECT_PORT ?? 3000}/auth/confirm/${token}">Confirmar Cuenta</a> </p>
            <p>Sí tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `,
    });

    return sendMail;
}

export {
    registerEmail,
}