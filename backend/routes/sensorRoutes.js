const express = require("express");
const { saveSensorData, getUserSensorData } = require("../controllers/sensorController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/receive_data", authMiddleware, saveSensorData);
router.get("/user_data", authMiddleware, getUserSensorData);

module.exports = router;