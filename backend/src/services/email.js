const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        // For production, use Gmail/SendGrid
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'your-email@gmail.com',
                pass: process.env.EMAIL_PASS || 'your-app-password'
            }
        });
    }

    async sendRequestConfirmation(email, requestTitle, requestId) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '✅ Service Request Confirmed',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Service Request Confirmed</h2>
          <p>Your service request has been received and is being processed.</p>
          <div style="background: #f8f9fa; padding: 1rem; border-radius: 4px;">
            <p><strong>Request Title:</strong> ${requestTitle}</p>
            <p><strong>Request ID:</strong> ${requestId}</p>
            <p><strong>Status:</strong> PENDING</p>
          </div>
          <p>We will notify you when your request is completed.</p>
          <p>Thank you for choosing our hotel!</p>
        </div>
      `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email sent to ${email}`);
        } catch (error) {
            console.error('Email error:', error);
        }
    }

    async sendRequestCompleted(email, requestTitle, requestId) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '✨ Your Service Request is Complete',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Service Request Completed</h2>
          <p>Your service request has been completed successfully!</p>
          <div style="background: #d4edda; padding: 1rem; border-radius: 4px; color: #155724;">
            <p><strong>Request Title:</strong> ${requestTitle}</p>
            <p><strong>Request ID:</strong> ${requestId}</p>
            <p><strong>Status:</strong> COMPLETED</p>
          </div>
          <p>If you have any feedback, please let us know.</p>
          <p>Thank you for your business!</p>
        </div>
      `
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Email error:', error);
        }
    }

    async sendBookingConfirmation(email, bookingDetails) {
        const { roomType, checkIn, checkOut, totalPrice, bookingId } = bookingDetails;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '🏨 Booking Confirmation',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Booking Confirmed</h2>
          <p>Thank you for your booking!</p>
          <div style="background: #f8f9fa; padding: 1rem; border-radius: 4px;">
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Room Type:</strong> ${roomType}</p>
            <p><strong>Check-in:</strong> ${new Date(checkIn).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> ${new Date(checkOut).toLocaleDateString()}</p>
            <p><strong>Total Price:</strong> $${totalPrice.toFixed(2)}</p>
          </div>
          <p>We look forward to your stay!</p>
        </div>
      `
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Email error:', error);
        }
    }

    async sendPaymentReceipt(email, paymentDetails) {
        const { amount, method, date, transactionId } = paymentDetails;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '💰 Payment Receipt',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Payment Receipt</h2>
          <p>Thank you for your payment!</p>
          <div style="background: #d4edda; padding: 1rem; border-radius: 4px; color: #155724;">
            <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> ${method}</p>
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
            <p><strong>Transaction ID:</strong> ${transactionId}</p>
          </div>
          <p>Your receipt has been attached to this email.</p>
        </div>
      `
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Email error:', error);
        }
    }
}

module.exports = new EmailService();