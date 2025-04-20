// mqtt_test.js
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost"); // ✅ Define before using

client.on("connect", () => {
  console.log("✅ Connected to broker");

  const payload = {
    voltage: 230,
    currents: [0.2,0.5, 0.4, 0.6],
    user_id: "1f87412a-50d8-409a-bf63-4fd3e7d34457"  // ✅ Replace with valid UUID in Supabase
  };

  client.publish("sensor/data", JSON.stringify(payload), {}, (err) => {
    if (err) {
      console.error("❌ Failed to publish:", err);
    } else {
      console.log("✅ MQTT message sent successfully");
    }
    client.end();
  });
});