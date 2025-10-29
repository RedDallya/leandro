const axios = require('axios');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const whatsappClient = axios.create({
  baseURL: process.env.WHATSAPP_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP_HOST,
  port: Number(process.env.EMAIL_SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_SMTP_USER,
    pass: process.env.EMAIL_SMTP_PASS
  }
});

const sendWhatsapp = async ({ to, message, attachments = [] }) => {
  await whatsappClient.post('', {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: 'documento_viaje',
      language: { code: 'es' },
      components: [
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: message
            }
          ]
        }
      ]
    }
  });

  // A real implementation would upload the attachments to WhatsApp hosted media first
  return { success: true };
};

const sendEmail = async ({ to, subject, message, attachments = [] }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html: message,
    attachments
  });

  return { success: true };
};

module.exports = {
  sendWhatsapp,
  sendEmail
};
