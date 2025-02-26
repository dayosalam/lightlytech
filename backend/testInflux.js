const { influxDB, INFLUX_ORG, INFLUX_BUCKET } = require("./config/influxConfig");
const { Point } = require("@influxdata/influxdb-client");

const writeApi = influxDB.getWriteApi(INFLUX_ORG, INFLUX_BUCKET, "ns");

const testPoint = new Point("sensor_readings")
    .tag("user_id", "test-user")
    .floatField("value1", 23.5)
    .floatField("value2", 50.2)
    .floatField("value3", 13.4)
    .floatField("value4", 5.6)
    .timestamp(new Date());

writeApi.writePoint(testPoint);
writeApi
    .close()
    .then(() => console.log("✅ Test data written successfully"))
    .catch((err) => console.error("❌ Error writing test data:", err));