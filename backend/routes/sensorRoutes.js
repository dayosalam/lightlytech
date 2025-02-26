const express = require("express");
const { storeSensorReading, getSensorReadings } = require("../controllers/sensorController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Define sensor routes
router.post("/store", authMiddleware, storeSensorReading);
//router.get("/readings", authMiddleware, getSensorReadings);



module.exports = router;