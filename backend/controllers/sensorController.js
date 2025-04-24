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

const MQTT_BROKER = "mqtt://5.tcp.eu.ngrok.io:13087";
const MQTT_TOPIC_SUBSCRIBE = "esp32/power";
const MQTT_TOPIC_PUBLISH = "esp32/control";

const client = mqtt.connect(MQTT_BROKER);

const BAND_RATES = {
  A: 250.0,
  B: 225.0,
  C: 209.5,
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
    const { voltage, currents } = data;
    const user_id = "37172b12-b000-4752-ab17-d430f4996fec";
    const now = new Date();

    if (!voltage || !Array.isArray(currents) || !user_id) {
      console.error("Invalid payload");
      return;
    }

    // Get the most recent record for this user to calculate time difference
    // and to retrieve accumulated values
    const { data: lastRecords } = await supabase
      .from("data_records")
      .select("*") // Select all fields to get accumulated values
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(1);

    // Calculate time elapsed since last reading
    let time_elapsed_hours = 1 / 60; // Default to 1 minute if no previous record
    if (lastRecords && lastRecords.length > 0) {
      const lastTimestamp = new Date(lastRecords[0].created_at);
      const diffMs = now - lastTimestamp;
      time_elapsed_hours = diffMs / (1000 * 60 * 60);
    }

    // Calculate current power and energy for this reading
    const power_watts = currents.map((c) => voltage * c);
    const incremental_energy_kwh = power_watts.map((p) => (p * time_elapsed_hours) / 1000);
    const incremental_total_energy = incremental_energy_kwh.reduce((a, b) => a + b, 0);

    // Get the user's tariff band
    const { data: profile } = await supabase
      .from("profiles")
      .select("band")
      .eq("user_id", user_id)
      .single();

    const band = profile?.band || "A";
    const rate = BAND_RATES[band] || BAND_RATES["A"];

    // Initialize accumulated values
    let accumulated_energy = incremental_total_energy;
    let accumulated_bill = parseFloat((incremental_total_energy * rate).toFixed(2));

    // If we have a previous record, add to the accumulated values
    if (lastRecords && lastRecords.length > 0) {
      const lastRecord = lastRecords[0];
      
      // If previous accumulated values exist, add the new incremental values
      if (lastRecord.accumulated_energy !== undefined) {
        accumulated_energy = parseFloat(lastRecord.accumulated_energy) + incremental_total_energy;
        accumulated_bill = parseFloat(lastRecord.accumulated_bill) + parseFloat((incremental_total_energy * rate).toFixed(2));
      }
    }

    // Format values to prevent floating point issues
    accumulated_energy = parseFloat(accumulated_energy.toFixed(4));
    accumulated_bill = parseFloat(accumulated_bill.toFixed(2));
    

    // First, get the most recent record for this user to update
    const { data: latestRecord } = await supabase
      .from("data_records")
      .select("id")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(1);

    // Prepare record with both current and accumulated values
    const recordToUpsert = {
      user_id,
      voltage,
      currents,
      power_watts,
      energy_kwh: incremental_energy_kwh,
      total_energy: incremental_total_energy,
      // Add accumulated fields
      accumulated_energy,
      accumulated_bill,
      bill: accumulated_bill, // Set bill to the accumulated value
      created_at: now.toISOString(),
    };

    // Add the ID if we found an existing record
    if (latestRecord && latestRecord.length > 0) {
      recordToUpsert.id = latestRecord[0].id;
    }

    // Perform the upsert
    const { error } = await supabase
      .from("data_records")
      .upsert([recordToUpsert], { 
        onConflict: 'id' 
      });

    if (error) {
      console.error("Supabase insert error:", error);
    } else {
      console.log(`Stored reading for user ${user_id} | Current Energy: ${incremental_total_energy.toFixed(4)} kWh | Accumulated Energy: ${accumulated_energy.toFixed(4)} kWh | Bill: ₦${accumulated_bill.toFixed(2)}`);
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

    const power_watts = currents.map((c) => voltage * c);
    const energy_kwh = power_watts.map((p) => (p * time_elapsed_hours) / 1000);
    const total_energy = energy_kwh.reduce((a, b) => a + b, 0);
    console.log(`⏱️ Time elapsed (hrs):`, time_elapsed_hours.toFixed(4));
    console.log(`🔋 Total energy (kWh):`, total_energy.toFixed(4));

    const { data: profile } = await supabase
      .from("profiles")
      .select("band")
      .eq("user_id", user_id)
      .single();

    const band = profile?.band || "A";
    const rate = BAND_RATES[band] || BAND_RATES["A"];
    const bill = parseFloat((total_energy * rate).toFixed(2));

    // First, get the most recent record for this user
    const { data: latestRecord } = await supabase
      .from("data_records")
      .select("id")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(1);

    // If record exists, update it. Otherwise, create a new one
    const recordToUpsert = {
      user_id,
      voltage,
      currents,
      power_watts,
      energy_kwh,
      total_energy,
      bill,
      created_at: now.toISOString(),
    };

    // Add the ID if we found an existing record
    if (latestRecord && latestRecord.length > 0) {
      recordToUpsert.id = latestRecord[0].id;
    }

    // Perform the upsert
    const { error } = await supabase
      .from("data_records")
      .upsert([recordToUpsert], { 
        onConflict: 'id' 
      });

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: "Database insert failed" });
    }

    return res.status(201).json({
      message: "Sensor data stored successfully",
      bill,
      total_energy,
      energy_kwh,
    });
  } catch (err) {
    console.error("Error processing sensor data:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// get sensor data
const getSensorData = async (req, res) => {
  const user_id = req.user.id;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const { data, error } = await supabase
      .from("data_records")
      .select(
        "id, currents, power_watts, energy_kwh, bill, total_energy, created_at"
      )
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


const INSTRUCTION_TOPIC = "esp/instructions"; 

const sendInstruction = async (req, res) => {
  try {
    const { code } = req.params;

    
    // Validate that the code is a binary string
    if (!/^[01]+$/.test(code)) {
      return res.status(400).json({ error: "Code must be a binary string." });
    }
    console.log("code", code)

    // Publish the code to the MQTT topic
    client.publish(INSTRUCTION_TOPIC, code, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to send instruction to ESP." });
      }
      return res.json({ success: true, message: "Instruction sent to ESP.", code });
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { storeSensorData, getSensorData, sendInstruction, client };
