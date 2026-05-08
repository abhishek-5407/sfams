import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // 1. Create a transporter
  // For testing, we use Ethereal (or you can use Gmail with App Password)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: `SFAMS Admin <noreply@sfams.edu>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // 3. Send email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
