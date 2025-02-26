const { Point } = require("@influxdata/influxdb-client");
const { influxDB, INFLUX_ORG, INFLUX_BUCKET } = require("../config/influxConfig");

const writeApi = influxDB.getWriteApi(INFLUX_ORG, INFLUX_BUCKET);
writeApi.useDefaultTags({ app: "iot-nodejs-app" });

exports.storeSensorReading = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(403).json({ error: "Unauthorized: No user found" });
        }

        const userId = req.user.id; // Get user ID from request
        const { timestamp, values } = req.body;

        // Ensure `values` is an array, not a string
        const parsedValues = Array.isArray(values) ? values : JSON.parse(values);

        const point = new Point("sensor_reading")
            .tag("user_id", userId) // Attach user ID as a tag
            .timestamp(new Date(timestamp).getTime() * 1e6)
            .floatField("value1", parseFloat(parsedValues[0] || 0))
            .floatField("value2", parseFloat(parsedValues[1] || 0))
            .floatField("value3", parseFloat(parsedValues[2] || 0))
            .floatField("value4", parseFloat(parsedValues[3] || 0));

        await writeApi.writePoint(point);
        await writeApi.flush();

        console.log(`✅ Sensor data saved for user: ${userId}`);
        res.status(200).json({ message: "Data written to InfluxDB successfully", userId });
    } catch (error) {
        console.error("❌ Error saving sensor data:", error);
        res.status(500).json({ error: "Error saving sensor data", details: error.message });
    }
};

exports.getSensorReadings = async (req, res) => {
    if (!req.user) {
        return res.status(403).json({ error: "Unauthorized: No user found" });
    }

    const userId = req.user.id;
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
            rows.push({
                time: data._time,
                values: [data._value]
            });
        },
        error(err) {
            console.error("❌ Error querying InfluxDB:", err);
            res.status(500).json({ error: "Error querying InfluxDB", details: err.message });
        },
        complete() {
            console.log(`✅ Retrieved sensor data for user: ${userId}`);
            res.json(rows);
        }
    });
};

