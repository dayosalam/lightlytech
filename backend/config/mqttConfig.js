const mqtt = require("mqtt");
const MQTT_BROKER = "mqtt://localhost";
const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on("connect", () => {
    console.log("✅ Connected to MQTT Broker");
});

module.exports = mqttClient;