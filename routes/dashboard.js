const express = require("express");
const router = express.Router();
const path = require("path");
const verifyToken = require("../middleware/auth");

router.get("/", verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
