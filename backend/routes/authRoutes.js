const express = require("express");
const { register, signIn, logout } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/signin", signIn);
router.post("/logout", logout);

module.exports = router;