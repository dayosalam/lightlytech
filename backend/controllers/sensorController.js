const { Point } = require("@influxdata/influxdb-client");
const {
  influxDB,
  INFLUX_ORG,
  INFLUX_BUCKET,
} = require("../config/influxConfig");
const mqttClient = require("../config/mqttConfig"); // Restore MQTT
const { getIo } = require("../index"); // ✅ Import `getIo()` instead of `io`

const writeApi = influxDB.getWriteApi(INFLUX_ORG, INFLUX_BUCKET);
writeApi.useDefaultTags({ app: "iot-nodejs-app" });

// MQTT Topics
const MQTT_TOPIC_PUBLISH = "sensor/data2";

/**
 * Save Sensor Data to InfluxDB & MQTT
 */
exports.saveSensorData = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ error: "Unauthorized: No user found" });
    }

    const userId = String(req.user.id); // Ensure user_id is stored correctly
    const { timestamp, values } = req.body;
    const parsedValues = JSON.parse(values);

    console.log(`📡 Received Sensor Data for User ${userId}`);

    // Construct InfluxDB Point
    const point = new Point("sensor_reading")
      .tag("user_id", userId) // Ensure user_id is stored as a tag
      .timestamp(new Date(timestamp).getTime() * 1e6)
      .floatField("value1", parseFloat(parsedValues[0]))
      .floatField("value2", parseFloat(parsedValues[1]))
      .floatField("value3", parseFloat(parsedValues[2]))
      .floatField("value4", parseFloat(parsedValues[3]));

    // Write to InfluxDB
    writeApi.writePoint(point);
    await writeApi.flush();
    console.log(`✅ Data saved to InfluxDB for user: ${userId}`);

    // **MQTT Publish**
    const mqttPayload = JSON.stringify({
      userId,
      timestamp,
      values: parsedValues,
    });
    mqttClient.publish(MQTT_TOPIC_PUBLISH, mqttPayload, { qos: 1 }, (err) => {
      if (err) console.error("❌ MQTT Publish Error:", err);
      else console.log(`📡 MQTT Sent -> Topic: ${MQTT_TOPIC_PUBLISH}`);
    });

    // **WebSocket Emit**
    try {
      const io = getIo(); // ✅ Get io dynamically when needed
      io.emit("mqtt_message", {
        data: { userId, timestamp, values: parsedValues },
      });
      console.log("📡 WebSocket event emitted");
    } catch (error) {
      console.error("❌ WebSocket `io` is not initialized yet.");
    }

    res
      .status(200)
      .json({ message: "Data written to InfluxDB successfully", userId });
  } catch (error) {
    console.error("❌ Error saving sensor data:", error);
    res
      .status(500)
      .json({ error: "Error saving sensor data", details: error.message });
  }
};

/**
 * Retrieve User-Specific Sensor Data from InfluxDB
 */
exports.getUserSensorData = async (req, res) => {
  if (!req.user) {
    return res.status(403).json({ error: "Unauthorized: No user found" });
  }

  const userId = String(req.user.id);
  console.log(`🔍 Fetching data for user_id: ${userId}`);

  const queryApi = influxDB.getQueryApi(INFLUX_ORG);
  const query = `
        from(bucket: "${INFLUX_BUCKET}")
        |> range(start: -1d)
        |> filter(fn: (r) => r._measurement == "sensor_reading")
        |> filter(fn: (r) => r["user_id"] == "${userId}")
    `;

  const rows = [];
  queryApi.queryRows(query, {
    next(row, tableMeta) {
      const data = tableMeta.toObject(row);
      console.log("🔹 Query Result Row:", data);
      rows.push({
        time: data._time,
        values: [data.value1, data.value2, data.value3, data.value4],
      });
    },
    error(err) {
      console.error("❌ InfluxDB Query Error:", err);
      res
        .status(500)
        .json({ error: "Error querying InfluxDB", details: err.message });
    },
    complete() {
      console.log("✅ Query Completed. Found rows:", rows.length);

      // **MQTT Response Publish**
      const mqttTopic = `sensor/${userId}/response`;
      mqttClient.publish(mqttTopic, JSON.stringify(rows), { qos: 1 }, (err) => {
        if (err) console.error("❌ MQTT Response Publish Error:", err);
        else console.log(`📡 MQTT Response Sent -> Topic: ${mqttTopic}`);
      });

      res.json(rows);
    },
  });
};
