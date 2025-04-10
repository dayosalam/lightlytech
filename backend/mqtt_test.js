// mqtt_test.js
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost"); // ✅ Define before using

client.on("connect", () => {
  console.log("✅ Connected to broker");

  const payload = {
    voltage: 230,
    currents: [7.2,9.5, 8.4, 5.6],
    user_id: "9f597885-d868-4a36-80ff-dcd2ae55d175"  // ✅ Replace with valid UUID in Supabase
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