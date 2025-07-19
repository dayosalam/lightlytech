// Updated MQTT handler + POST endpoint for sensor data in sensorController.js
const mqtt = require("mqtt");
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const { generateUserAlerts } = require("../utils/helpers");
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

  const MQTT_BROKER = "tcp://4.tcp.eu.ngrok.io:14728"; // Replace with your MQTT broker URL
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

  console.log("Received message:", message.toString());

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
  const { period } = req.query; // e.g., "Today", "1 M", "1 Y", "All time"

  console.log(period);

  const decodedPeriod = decodeURIComponent(period);

  console.log("decodedPeriod", decodedPeriod);

  // Calculate date range based on period
  let startDate;
  const now = new Date();
  switch (decodedPeriod) {
    case "Today":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "1 M":
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      break;
    case "1 Y":
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      break;
    case "All time":
    default:
      startDate = null; // No filter
  }

  try {
    let query = supabase
      .from("data_records")
      .select("id, currents, power_watts, energy_kwh, bill, total_energy, created_at")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (startDate) {
      query = query.gte("created_at", startDate.toISOString());
    }

    const { data, error } = await query;
    if (error) throw error;

    // Calculate total_energy, bill, etc. for the period
    const total_energy = data.reduce((sum, r) => sum + (r.total_energy || 0), 0);
    const bill = data.reduce((sum, r) => sum + (r.bill || 0), 0);


    console.log("Total energy")

    // Calculate percent change vs last year if period is "1 Y"
    let percentChange = null;
    if (decodedPeriod === "1 Y") {
      // Fetch last year's data for the same period
      const lastYearStart = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      const lastYearEnd = new Date(now.getFullYear() - 1, now.getMonth() + 1, now.getDate());
      const { data: lastYearData } = await supabase
        .from("data_records")
        .select("total_energy")
        .eq("user_id", user_id)
        .gte("created_at", lastYearStart.toISOString())
        .lte("created_at", lastYearEnd.toISOString());
      const lastYearTotal = (lastYearData || []).reduce((sum, r) => sum + (r.total_energy || 0), 0);
      if (lastYearTotal > 0) {
        percentChange = ((total_energy - lastYearTotal) / lastYearTotal) * 100;
      }
    }

    return res.status(200).json({
      user_id,
      total_energy,
      bill,
      percentChange,
      sensor_readings: data,
    });
  } catch (error) {
    console.error("Error retrieving sensor data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


const INSTRUCTION_TOPIC = "esp32/relays"; 

const sendInstruction = async (req, res) => {
  try {
    const { relays } = req.body;

    // Validate input
    if (
      !Array.isArray(relays) ||
      relays.length !== 4 ||
      !relays.every(r => r === 0 || r === 1)
    ) {
      return res.status(400).json({
        error: "relays must be an array of 4 binary values (0 or 1).",
      });
    }

    // Convert JS object to JSON string
    const payload = JSON.stringify({ relays });

    console.log("Publishing JSON:", payload);

    // Publish to MQTT
    client.publish(INSTRUCTION_TOPIC, payload, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to send instruction to ESP." });
      }

      return res.json({
        success: true,
        message: "Instruction sent to ESP.",
        payload: JSON.parse(payload), // just to echo back the sent object
      });
    });
  } catch (error) {
    console.error("MQTT sendInstruction error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// get user energy alerts 
const getUserAlerts = async (req, res) => {
    try {
        const userId = req.user.id;
        const alerts = await generateUserAlerts(userId);
        return res.status(200).json(alerts);
    } catch (error) {
        console.error("Error generating user alerts:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};



module.exports = { storeSensorData, getSensorData, sendInstruction, client, getUserAlerts };
