import * as nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

// Create transporter
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    // Production email service (e.g., SendGrid, AWS SES)
    return nodemailer.createTransport({
      service: 'SendGrid', // or your preferred service
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD,
      },
    });
  } else {
    // Development - use Ethereal Email for testing
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.ETHEREAL_EMAIL || 'ethereal.user@ethereal.email',
        pass: process.env.ETHEREAL_PASSWORD || 'ethereal.pass',
      },
    });
  }
};

const transporter = createTransporter();

export const sendVerificationEmail = async (
  email: string,
  name: string,
  verificationCode: string
) => {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@mindwell.app',
      to: email,
      subject: 'Verify Your MindWell Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #6B73FF 0%, #9C88FF 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🧠 MindWell</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your mental health companion</p>
          </div>
          
          <div style="padding: 40px 20px; background: white;">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome, ${name}!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              Thank you for joining MindWell. To complete your account setup, please verify your email address using the code below:
            </p>
            
            <div style="background: #F8F9FF; border: 2px dashed #6B73FF; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
              <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">Your verification code:</p>
              <h1 style="color: #6B73FF; margin: 0; font-size: 36px; letter-spacing: 8px; font-family: monospace;">
                ${verificationCode}
              </h1>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              This code will expire in 10 minutes. If you didn't create an account with MindWell, please ignore this email.
            </p>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 40px;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                This email was sent to ${email}. If you have any questions, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Verification email sent to ${email}:`, info.messageId);
    
    if (process.env.NODE_ENV === 'development') {
      logger.info('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
  } catch (error) {
    logger.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetToken: string
) => {
  try {
    const resetUrl = process.env.NODE_ENV === 'production'
      ? `https://your-app-domain.com/reset-password?token=${resetToken}`
      : `http://localhost:3000/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@mindwell.app',
      to: email,
      subject: 'Reset Your MindWell Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #6B73FF 0%, #9C88FF 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🧠 MindWell</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your mental health companion</p>
          </div>
          
          <div style="padding: 40px 20px; background: white;">
            <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              Hi ${name}, we received a request to reset your password for your MindWell account.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" 
                 style="background: #6B73FF; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
            </p>
            
            <p style="color: #999; font-size: 14px; margin-bottom: 20px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <span style="word-break: break-all;">${resetUrl}</span>
            </p>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 40px;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                This email was sent to ${email}. If you have any questions, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent to ${email}:`, info.messageId);
    
    if (process.env.NODE_ENV === 'development') {
      logger.info('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
  } catch (error) {
    logger.error('Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};