"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoiceHtml = generateInvoiceHtml;
exports.createAndSaveInvoice = createAndSaveInvoice;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pdf_service_1 = require("./pdf.service");
const Invoice_1 = __importDefault(require("../models/Invoice"));
const pricing_controller_1 = require("../controllers/pricing.controller");
const cloudinary_service_1 = require("./cloudinary.service");
async function generateInvoiceHtml(invoice, dynamicSignatureUrl) {
    const logoPath = path_1.default.join(__dirname, '../../uploads/invoice_assets/logo.png');
    const signaturePath = path_1.default.join(__dirname, '../../uploads/invoice_assets/signature.png');
    let logoBase64 = '';
    let signatureBase64 = '';
    try {
        if (fs_1.default.existsSync(logoPath)) {
            logoBase64 = fs_1.default.readFileSync(logoPath).toString('base64');
        }
        // Only use local signature if dynamic one is not provided
        if (!dynamicSignatureUrl && fs_1.default.existsSync(signaturePath)) {
            signatureBase64 = fs_1.default.readFileSync(signaturePath).toString('base64');
        }
    }
    catch (err) {
        console.error('Error reading invoice assets:', err);
    }
    // Use the dynamic signature URL if provided, otherwise use base64 of local file
    const signatureSrc = dynamicSignatureUrl || (signatureBase64 ? `data:image/png;base64,${signatureBase64}` : '');
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 40px; }
        .invoice-container { max-width: 800px; margin: auto; border: 1px solid #eee; padding: 30px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #06497f; padding-bottom: 20px; margin-bottom: 20px; }
        .logo { height: 60px; }
        .invoice-title { font-size: 28px; color: #06497f; font-weight: bold; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .info-col { flex: 1; }
        .info-col h3 { margin: 0 0 10px 0; font-size: 11px; text-transform: uppercase; color: #777; letter-spacing: 1px; }
        .info-col p { margin: 2px 0; font-size: 13px; color: #444; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
        th { background: #f8f9fa; border-bottom: 2px solid #eee; text-align: left; padding: 12px; font-size: 13px; color: #666; }
        td { padding: 12px; border-bottom: 1px solid #eee; font-size: 13px; }
        .total-section { display: flex; justify-content: flex-end; }
        .total-box { width: 220px; background: #f8f9fa; padding: 20px; border-radius: 8px; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
        .grand-total { font-weight: bold; font-size: 18px; color: #06497f; margin-top: 10px; border-top: 2px solid #ddd; padding-top: 10px; }
        .footer { margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #999; font-size: 11px; }
        .signature-container { margin-top: 50px; display: flex; flex-direction: column; align-items: flex-end; }
        .signature-img { height: 60px; margin-bottom: 5px; }
        .signature-label { font-size: 13px; color: #555; border-top: 1px solid #eee; padding-top: 5px; min-width: 150px; text-align: center; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          ${logoBase64 ? `<img src="data:image/png;base64,${logoBase64}" class="logo" />` : '<div class="logo">ResumeYatra</div>'}
          <div class="invoice-title">INVOICE</div>
        </div>
        
        <div class="info-row">
          <div class="info-col">
            <h3>From:</h3>
            <p><strong>ResumeYatra</strong></p>
            <p>India</p>
            <p>support@resumeyatra.com</p>
          </div>
          <div class="info-col">
            <h3>To:</h3>
            <p><strong>${invoice.userDetails.name}</strong></p>
            <p>${invoice.userDetails.email}</p>
            ${invoice.userDetails.phone ? `<p>${invoice.userDetails.phone}</p>` : ''}
          </div>
          <div class="info-col" style="text-align: right;">
            <h3>Invoice Details:</h3>
            <p><strong># ${invoice.invoiceNumber}</strong></p>
            <p>Date: ${new Date(invoice.createdAt).toLocaleDateString('en-IN')}</p>
            <p>Payment ID: ${invoice.paymentId}</p>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-weight: 500;">
                ${getItemDescription(invoice.type)}
              </td>
              <td style="text-align: right;">₹${invoice.amount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="total-section">
          <div class="total-box">
            <div class="total-row">
              <span style="color: #666;">Subtotal:</span>
              <span>₹${invoice.amount.toFixed(2)}</span>
            </div>
            <div class="total-row grand-total">
              <span>Total:</span>
              <span>₹${invoice.amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div class="signature-container">
          ${signatureSrc ? `<img src="${signatureSrc}" class="signature-img" />` : ''}
          <div class="signature-label">Authorized Signatory</div>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing ResumeYatra!</p>
          <p>This is a computer-generated invoice and doesn't require extra stamp.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
function getItemDescription(type) {
    const [mainType, addon] = (type || '').split(':');
    let description = '';
    switch (mainType) {
        case 'download':
            description = 'Resume Download Credit';
            break;
        case 'ai':
            description = 'AI Resume Optimization (includes 1 download)';
            break;
        case 'subscription_freelancer':
            description = 'Freelancer Subscription Plan';
            break;
        case 'subscription_candidate':
            description = 'Candidate Subscription Plan';
            break;
        default: description = mainType || 'ResumeYatra Service';
    }
    if (addon) {
        const addonLabel = addon === 'ai' ? 'AI Enhancement' : addon === 'download' ? 'Download Credit' : addon;
        return `<div>${description}</div><div style="font-size: 13px; color: #555; margin-top: 4px;">${addonLabel}</div>`;
    }
    return `<div>${description}</div>`;
}
async function createAndSaveInvoice(data) {
    try {
        // Generate invoice number
        const count = await Invoice_1.default.countDocuments();
        const invoiceNumber = `RY-${new Date().getFullYear()}-${(count + 1).toString().padStart(5, '0')}`;
        const invoice = new Invoice_1.default({
            ...data,
            invoiceNumber,
            createdAt: new Date()
        });
        const pricing = await (0, pricing_controller_1.getPricingConfig)();
        const html = await generateInvoiceHtml(invoice, pricing.adminSignature);
        const pdfBuffer = await (0, pdf_service_1.generatePdfBuffer)(html);
        const uploadResult = await (0, cloudinary_service_1.uploadBuffer)(pdfBuffer, `${invoiceNumber}.pdf`, 'invoices', 'image');
        console.log('Cloudinary URL returned for invoice:', uploadResult.secure_url);
        invoice.pdfUrl = uploadResult.secure_url;
        await invoice.save();
        return invoice;
    }
    catch (error) {
        console.error('Error in createAndSaveInvoice:', error);
        // Don't throw, just return null so payment flow isn't broken
        return null;
    }
}
