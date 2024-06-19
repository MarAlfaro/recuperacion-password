const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = require("../middleware/auth");
const path = require("path");
const { hashPassword, comparePassword } = require("../utils/hashPassword");

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "login.html"));
});

router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "register.html"));
});

router.post("/register", async (req, res) => {
  const { nombre, apellido, nombreUsuario, password, correo } = req.body;
  try {
    const newUser = new User({
      nombre,
      apellido,
      nombreUsuario,
      password: await hashPassword(password),
      correo,
    });
    await newUser.save();
    res.status(201).send("Usuario registrado");
  } catch (error) {
    console.log(error);
    res.status(400).send("Error registrando usuario");
  }
});

router.post("/login", async (req, res) => {
  const { nombreUsuario, password } = req.body;
  try {
    const user = await User.findOne({ nombreUsuario });
    if (!user) {
      return res.status(400).json("credenciales inválidas");
    }
    if (!(await comparePassword(password, user.password))) {
      return res.status(400).json("credenciales inválidas");
    }

    const token = jwt.sign(
      { id: user._id, username: user.nombreUsuario },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).send("Error en el servidor");
  }
});

router.get("/protected", verifyToken, (req, res) => {
  res.send(`Hola ${req.user.username}, esta es una ruta protegida.`);
});

module.exports = router;
