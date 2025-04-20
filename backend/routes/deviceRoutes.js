const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { toggleDeviceState } = require("../controllers/deviceController");

router.put("/toggle-device", authMiddleware, toggleDeviceState);

module.exports = router;