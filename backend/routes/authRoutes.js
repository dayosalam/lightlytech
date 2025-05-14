const express = require("express");
const { register, signIn, logout, changePassword, changeEmail } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/signin", signIn);
router.post("/logout", logout);
router.post("/change-password", authMiddleware, changePassword);
router.post("/change-email", authMiddleware, changeEmail);

module.exports = router;