const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/auth');

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).send('Usuario registrado');
  } catch (error) {
    res.status(400).send('Error registrando usuario');
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).send('Credenciales inválidas');
    }
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '1m' });
     res.json({ token });
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

router.get('/protected', verifyToken, (req, res) => {
  res.send(`Hola ${req.user.username}, esta es una ruta protegida.`);
});

module.exports = router;
