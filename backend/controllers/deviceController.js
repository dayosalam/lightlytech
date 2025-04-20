const { createClient } = require("@supabase/supabase-js");
const mqtt = require("mqtt");
require("dotenv").config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const client = mqtt.connect("mqtt://localhost"); // Use your actual broker if not local

const toggleDeviceState = async (req, res) => {
  const user_id = req.user.id;
  const { device_id, is_on } = req.body;

  if (!device_id || typeof is_on !== "boolean") {
    return res.status(400).json({ error: "Missing or invalid fields" });
  }

  try {
    // ✅ Update device state
    const { data, error } = await supabase
      .from("devices")
      .update({ is_on })
      .eq("id", device_id)
      .eq("user_id", user_id)
      .select("mqtt_topic");

    if (error || !data || data.length === 0) throw error;

    const topic = data[0].mqtt_topic || `device/control/${device_id}`;

    // ✅ Publish to MQTT
    client.publish(topic, JSON.stringify({ device_id, is_on }));

    return res.status(200).json({ message: `Device ${is_on ? "ON" : "OFF"}` });
  } catch (err) {
    console.error("Toggle error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = { toggleDeviceState };