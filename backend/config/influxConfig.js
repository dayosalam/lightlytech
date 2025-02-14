const { InfluxDB } = require("@influxdata/influxdb-client");

const INFLUX_URL = process.env.INFLUX_URL || "http://localhost:8086";
const INFLUX_TOKEN = process.env.INFLUX_TOKEN;
const INFLUX_ORG = process.env.INFLUX_ORG || "Energy";
const INFLUX_BUCKET = process.env.INFLUX_BUCKET || "sensor";

const influxDB = new InfluxDB({ url: INFLUX_URL, token: INFLUX_TOKEN });

module.exports = {
    influxDB,
    INFLUX_ORG,
    INFLUX_BUCKET
};