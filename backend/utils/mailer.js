const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendOtpEmail(toEmail, otp) {
  await transporter.sendMail({
    from: `"Payroll Analytics" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Password Reset OTP',
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #e91e63;">Payroll Analytics — Password Reset</h2>
        <p>Your OTP code is:</p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p>This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
      </div>
    `
  });
}

module.exports = { sendOtpEmail };
