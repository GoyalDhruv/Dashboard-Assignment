const express = require("express");
const {
    getDistinctIPs,
    getHourlyTraffic,
    getTopIPs,
    getTopHours,
} = require("../controllers/logController");

const router = express.Router();

router.get("/distinct-ips", getDistinctIPs);
router.get("/hourly-traffic", getHourlyTraffic);
router.get("/top-ips", getTopIPs);
router.get("/top-hours", getTopHours);

module.exports = router;