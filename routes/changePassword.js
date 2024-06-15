const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/email");

const router = express.Router();

router.post("/", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ correo: email });

  if (!user) {
    return res.status(404).json({ message: "Email no encontrado" });
  }

  const token = jwt.sign(email, process.env.SECRET_KEY, { expiresIn: "7m" });

  const sendEmailToUser = await sendEmail(email, token);

  if (!sendEmailToUser) {
    return res.status(500).json({ message: "Error al enviar el correo" });
  }

  res.json({ message: `Correo enviado a ${email}` });
});

router.get("/:token", async (req, res) => {
  const { token } = req.params;
  console.log(token);
  const validateToken = jwt.verify(token, process.env.SECRET_KEY);

  if (validateToken) {
    return res.status(200).json({ message: "Cambiar contraseña" });
  }

  return res.status(401).json({ message: "Token invalid" });
});

module.exports = router;
