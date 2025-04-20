// Updated MQTT handler + POST endpoint for sensor data in sensorController.js
const mqtt = require("mqtt");
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// 🔁 Realtime subscription to data_records inserts
supabase
  .channel("realtime:sensor-data")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "data_records" },
    (payload) => {
      console.log("📡 New sensor data (Realtime):", payload.new);
    }
  )
  .subscribe();

const MQTT_BROKER = "mqtt://localhost";
const MQTT_TOPIC_SUBSCRIBE = "sensor/data";
const MQTT_TOPIC_PUBLISH = "sensor/data2";

const client = mqtt.connect(MQTT_BROKER);

const BAND_RATES = {
  A: 209.5,
  B: 225.0,
  C: 250.0,
};

client.on("connect", () => {
  console.log("Connected to MQTT Broker");
  client.subscribe(MQTT_TOPIC_SUBSCRIBE, (err) => {
    if (!err) console.log(`Subscribed to topic: ${MQTT_TOPIC_SUBSCRIBE}`);
  });
});

client.on("message", async (topic, message) => {
  if (topic !== MQTT_TOPIC_SUBSCRIBE) return;

  try {
    const data = JSON.parse(message.toString());
    const { voltage, currents, user_id } = data;
    const now = new Date();

    if (!voltage || !Array.isArray(currents) || !user_id) {
      console.error("Invalid payload");
      return;
    }

    // Fetch user's devices
    const { data: devices } = await supabase
      .from("devices")
      .select("id, name, sensor_index")
      .eq("user_id", user_id);

    if (!devices || devices.length === 0) {
      console.warn("No devices found for user:", user_id);
      return;
    }

    // Get time elapsed since last reading
    const { data: lastRecords } = await supabase
      .from("data_records")
      .select("created_at")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(1);

    let time_elapsed_hours = 1 / 60;
    if (lastRecords && lastRecords.length > 0) {
      const lastTimestamp = new Date(lastRecords[0].created_at);
      const diffMs = now - lastTimestamp;
      time_elapsed_hours = diffMs / (1000 * 60 * 60);
    }

    // Calculate energy for each device
    const deviceReadings = devices.map((device) => {
      const current = currents[device.sensor_index] || 0;
      const power = voltage * current;
      const energy = (power * time_elapsed_hours) / 1000;
      return {
        device_id: device.id,
        name: device.name,
        current,
        power,
        energy,
      };
    });

    const total_energy = deviceReadings.reduce((sum, d) => sum + d.energy, 0);

    const { data: profile } = await supabase
      .from("profiles")
      .select("band")
      .eq("user_id", user_id)
      .single();

    const band = profile?.band || "A";
    const rate = BAND_RATES[band] || BAND_RATES["A"];
    const bill = parseFloat((total_energy * rate).toFixed(2));

    // ✅ Save reading
    const { error } = await supabase.from("data_records").insert([
      {
        user_id,
        voltage,
        currents,
        total_energy,
        bill,
        device_readings: deviceReadings,
        created_at: now.toISOString(),
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
    } else {
      console.log(`Stored reading for user ${user_id} | Bill: ₦${bill}`);
    }
  } catch (err) {
    console.error("MQTT processing error:", err);
  }
});

// POST endpoint for storing sensor data with billing
const storeSensorData = async (req, res) => {
  const user_id = req.user.id;
  let { voltage, currents } = req.body;
  const now = new Date();

  if (!voltage || !Array.isArray(currents) || !user_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { data: devices } = await supabase
      .from("devices")
      .select("id, name, sensor_index")
      .eq("user_id", user_id);

    if (!devices || devices.length === 0) {
      return res.status(400).json({ error: "No devices found for user" });
    }

    const { data: lastRecords } = await supabase
      .from("data_records")
      .select("created_at")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(1);

    let time_elapsed_hours = 1 / 60;
    if (lastRecords && lastRecords.length > 0) {
      const lastTimestamp = new Date(lastRecords[0].created_at);
      const diffMs = now - lastTimestamp;
      time_elapsed_hours = diffMs / (1000 * 60 * 60);
      console.log("⏱️ Last reading timestamp:", lastTimestamp);
      console.log("⏱️ Current time:", now);
      console.log("⏱️ Time diff ms:", diffMs);
      console.log("⏱️ Time elapsed (hours):", time_elapsed_hours.toFixed(4));
    }

    const deviceReadings = devices.map((device) => {
      const current = currents[device.sensor_index] || 0;
      const power = voltage * current;
      const energy = (power * time_elapsed_hours) / 1000;
      return {
        device_id: device.id,
        name: device.name,
        current,
        power,
        energy,
      };
    });

    const total_energy = deviceReadings.reduce((sum, d) => sum + d.energy, 0);

    const { data: profile } = await supabase
      .from("profiles")
      .select("band")
      .eq("user_id", user_id)
      .single();

    const band = profile?.band || "A";
    const rate = BAND_RATES[band] || BAND_RATES["A"];
    const bill = parseFloat((total_energy * rate).toFixed(2));

    const { error } = await supabase.from("data_records").insert([
      {
        user_id,
        voltage,
        currents,
        total_energy,
        bill,
        device_readings: deviceReadings,
        created_at: now.toISOString(),
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: "Database insert failed" });
    }

    return res.status(201).json({
      message: "Sensor data stored successfully",
      bill,
      total_energy,
      device_readings: deviceReadings,
    });
  } catch (err) {
    console.error("Error processing sensor data:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getSensorData = async (req, res) => {
  const user_id = req.user.id;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const { data, error } = await supabase
      .from("data_records")
      .select("id, currents, device_readings, total_energy, bill, created_at")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      user_id,
      sensor_readings: data,
    });
  } catch (error) {
    console.error("Error retrieving sensor data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { storeSensorData, getSensorData, client };
