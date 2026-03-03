"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    async sendEmail(options) {
        try {
            const mailOptions = {
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
                attachments: options.attachments,
            };
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error('Email sending failed:', error);
            throw new Error('Failed to send email');
        }
    }
    async sendResumeEmail(to, subject, body, resumeBuffer, filename) {
        await this.sendEmail({
            to,
            subject,
            html: body,
            attachments: [
                {
                    filename,
                    content: resumeBuffer,
                    contentType: 'application/pdf',
                },
            ],
        });
    }
}
exports.emailService = new EmailService();
