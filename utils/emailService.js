const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "anarish.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  pool: true, // Use connection pooling for better performance
  maxConnections: 5, // Maximum number of concurrent connections
  // connectionTimeout: 10000, // Increase timeout (in ms)
  // greetingTimeout: 20000, // Increase greeting timeout (in ms)
});

const sendEmail = (to,cc, subject, html) => {
    console.log("email send called")
  const mailOptions = { 
    from: { name: "Anarish Innovations", address: process.env.EMAIL_USER },
    to,
    cc,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;