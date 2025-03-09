const mqtt = require("mqtt");
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config();

// Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Subscribe to real-time updates
supabase
  .channel("realtime:sensor-data")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "data_records" },
    (payload) => {
      console.log("New sensor data received:", payload.new);
    }
  )
  .subscribe();

// MQTT Configuration
const MQTT_BROKER = "mqtt://localhost";
const MQTT_TOPIC_SUBSCRIBE = "sensor/data";
const MQTT_TOPIC_PUBLISH = "sensor/data2";

const client = mqtt.connect(MQTT_BROKER);

// MQTT Connection
client.on("connect", () => {
  console.log("Connected to MQTT Broker");
  client.subscribe(MQTT_TOPIC_SUBSCRIBE, (err) => {
    if (!err) {
      console.log(`Subscribed to topic: ${MQTT_TOPIC_SUBSCRIBE}`);
    }
  });
});

// Handling Incoming Sensor Data
client.on("message", async (topic, message) => {
  if (topic === MQTT_TOPIC_SUBSCRIBE) {
    try {
      const data = JSON.parse(message.toString());
      const { timestamp, values, user_id } = data;

      const { error } = await supabase.from("data_records").insert([
        {
          user_id,
          values,
          created_at: timestamp,
        },
      ]);

      if (error) {
        console.error("Error inserting data into Supabase:", error);
      } else {
        console.log("Sensor data stored successfully");
      }
    } catch (err) {
      console.error("Error processing MQTT message:", err);
    }
  }
});

// API Endpoint: Store Sensor Data

const storeSensorData = async (req, res) => {
  let { values } = req.body;
  const user_id = req.user.id; // Get authenticated user ID

  if (!user_id || !values) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Ensure `values` is an array of floats
    if (typeof values === "string") {
      values = JSON.parse(values); // Convert from string to array if needed
    }

    if (
      !Array.isArray(values) ||
      !values.every((val) => typeof val === "number")
    ) {
      return res
        .status(400)
        .json({ error: "Values must be an array of numbers (floats)" });
    }

    // Publish to MQTT
    client.publish(MQTT_TOPIC_PUBLISH, JSON.stringify({ user_id, values }));

    // Insert into Supabase
    const { error } = await supabase.from("data_records").insert([
      {
        user_id,
        values, // Must be an array of floats
      },
    ]);

    if (error) throw error;

    return res.status(201).json({ message: "Sensor data stored successfully" });
  } catch (error) {
    console.error("Error storing sensor data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// API Endpoint: Retrieve Sensor Data for a User

const getSensorData = async (req, res) => {
  const user_id = req.user.id; // Get authenticated user ID

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const { data, error } = await supabase
      .from("data_records")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving sensor data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = { storeSensorData, getSensorData, client };
