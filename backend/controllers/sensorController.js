const { Point } = require("@influxdata/influxdb-client");
const { influxDB, INFLUX_ORG, INFLUX_BUCKET } = require("../config/influxConfig");

const writeApi = influxDB.getWriteApi(INFLUX_ORG, INFLUX_BUCKET);
writeApi.useDefaultTags({ app: "iot-nodejs-app" });

exports.saveSensorData = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(403).json({ error: "Unauthorized: No user found" });
        }

        const userId = req.user.id; // Get user ID from request
        const { timestamp, values } = req.body;

        const parsedValues = JSON.parse(values);
        const point = new Point("sensor_reading")
            .tag("user_id", userId) // Attach user ID as a tag
            .timestamp(new Date(timestamp).getTime() * 1e6)
            .floatField("value1", parseFloat(parsedValues[0]))
            .floatField("value2", parseFloat(parsedValues[1]))
            .floatField("value3", parseFloat(parsedValues[2]))
            .floatField("value4", parseFloat(parsedValues[3]));

        await writeApi.writePoint(point);
        await writeApi.flush();

        res.status(200).json({ message: "Data written to InfluxDB successfully", userId });
    } catch (error) {
        res.status(500).json({ error: "Error saving sensor data", details: error.message });
    }
};

exports.getUserSensorData = async (req, res) => {
    if (!req.user) {
        return res.status(403).json({ error: "Unauthorized: No user found" });
    }

    const userId = req.user.id;
    const queryApi = influxDB.getQueryApi(INFLUX_ORG);

    const query = `
        from(bucket: "${INFLUX_BUCKET}")
        |> range(start: -1d)
        |> filter(fn: (r) => r._measurement == "sensor_reading")
        |> filter(fn: (r) => r.user_id == "${userId}")
    `;

    const rows = [];
    queryApi.queryRows(query, {
        next(row, tableMeta) {
            const data = tableMeta.toObject(row);
            rows.push({
                time: data._time,
                values: [data.value1, data.value2, data.value3, data.value4]
            });
        },
        error(err) {
            res.status(500).json({ error: "Error querying InfluxDB", details: err.message });
        },
        complete() {
            res.json(rows);
        }
    });
};