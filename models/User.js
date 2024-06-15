const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  apellido: {
    type: String,
    required: true,
    unique: true,
  },
  nombreUsuario: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  correo: {
    type: String,
    required: true,
    unique: true,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
