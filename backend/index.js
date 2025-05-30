require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sensorRoutes = require("./routes/sensorRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const profileRoutes = require('./routes/profileRoutes');
const authRoutes = require("./routes/authRoutes");
const mqtt = require("mqtt");
const http = require("http");
const { Server } = require("socket.io");

// Initialize Express & HTTP Server
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3003;

// Middleware
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false, // Set to false for mobile app connections
  })
);
app.use(bodyParser.json());
app.use(express.static("public"));


// MQTT Settings
const MQTT_BROKER = "tcp://4.tcp.eu.ngrok.io:14728"; // Replace with your MQTT broker URL
// const MQTT_TOPIC_SUBSCRIBE = "sensor/data";
const MQTT_TOPIC_SUBSCRIBE = "esp32/power";
const MQTT_TOPIC_PUBLISH = "esp32/relays";

// Initialize MQTT Client
const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on("connect", () => {
  console.log("✅ Connected to MQTT Broker");
  mqttClient.subscribe(MQTT_TOPIC_SUBSCRIBE, (err) => {
    if (err) {
      console.error("❌ MQTT Subscription Error:", err.message);
    }
  });
});


// publish a message
mqttClient.publish(MQTT_TOPIC_PUBLISH, "Hello from MQTT!", (err) => {
  if (err) {
    console.error("❌ MQTT Publish Error:", err.message);
  } else {
    console.log("✅ Message published to MQTT Broker");
  }
});

// ** WebSocket Initialization **
let io;

function getIo() {
  if (!io) {
    throw new Error("❌ WebSocket `io` is not initialized yet.");
  }
  return io;
}

io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("⚡ A client connected via WebSocket");

  socket.on("disconnect", () => {
    console.log("❌ A client disconnected");
  });
});

// console.log("✅ WebSocket Server Initialized");

// Routes
app.use("/api/sensors", sensorRoutes);
app.use("/api/auth", authRoutes);
app.use('/api', profileRoutes);
app.use("/api/device", deviceRoutes);

// health
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

