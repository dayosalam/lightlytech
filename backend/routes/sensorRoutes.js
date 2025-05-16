const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const { storeSensorData, getSensorData, sendInstruction } = require("../controllers/sensorController.js");
const router = express.Router();

// Define sensor routes
router.post("/store", authMiddleware, storeSensorData);
router.get("/readings", authMiddleware, getSensorData);
router.post("/relay", sendInstruction);

module.exports = router;
