const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (email, token) => {
  const info = await transporter.sendMail({
    from: `Admin user ${process.env.EMAIL_USER}`,
    to: email,
    subject: "Cambiar contraseña",
    text: `Para cambiar la contraseña haga click en el siguiente enlace: http://localhost:3000/api/recuperarPassword?token=${token}`,
  });

  console.log("Correo enviado: ", info.messageId);

  return info.messageId;
};

module.exports = { sendEmail };
