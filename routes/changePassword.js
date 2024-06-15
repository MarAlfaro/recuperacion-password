const express = require("express");

const router = express.Router();

router.post("/", (req, res) => {
  const { email } = req.body;
  res.json({ message: `Email recibido ${email}` });
});

module.exports = router;
