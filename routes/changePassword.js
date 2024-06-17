const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/email");
const path = require("path");

const router = express.Router();

router.post("/", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ correo: email });

  if (!user) {
    return res.status(404).json({ message: "Email no encontrado" });
  }

  const token = jwt.sign({ email }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });

  const sendEmailToUser = await sendEmail(email, token);

  if (!sendEmailToUser) {
    return res.status(500).json({ message: "Error al enviar el correo" });
  }

  res.json({ message: `Correo enviado a ${email}` });
});

router.get("/formRecoverPassword", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "recoverPassword.html"));
});

router.get("/", async (req, res) => {
  const { token } = req.query;
  console.log(token);
  try {
    const validateToken = jwt.verify(token, process.env.SECRET_KEY);

    if (validateToken) {
      return res.sendFile(
        path.join(__dirname, "..", "views", "cambiarPassword.html")
      );
    }
  } catch (error) {
    console.log(error);
    res.redirect("/api/auth/login");
  }
});

router.post("/newPassword", async (req, res) => {
  const { newPassword, token } = req.body;
  try {
    const isValidToken = jwt.verify(token, process.env.SECRET_KEY);

    if (isValidToken) {
      const user = await User.findOne({ correo: isValidToken.email });

      if (!user) {
        return res.status(404).json({ message: "usuario no encontrado" });
      }

      user.password = newPassword;

      await user.save();

      return res.json({ message: "Password changed successfully", data: user });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
