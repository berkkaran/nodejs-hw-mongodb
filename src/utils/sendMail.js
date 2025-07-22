import nodemailer from 'nodemailer';
import { env } from './env.js';

const transporter = nodemailer.createTransport({
  host: env('SMTP_HOST'),
  port: Number(env('SMTP_PORT')),
  auth: {
    user: env('SMTP_USER'),
    pass: env('SMTP_PASSWORD'),
  },
});

export const sendEmail = async (options) => {
  try {
    const emailOptions = {
      ...options,
      from: env('SMTP_FROM'),
    };
    await transporter.sendMail(emailOptions);
  } catch (err) {
    console.error('Failed to send email: ', err);
    throw new Error('Failed to send email');
  }
};
