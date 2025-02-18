const { readLogs } = require("../models/logModel");

// const filterLogsByDate = (logs, date) => {
//     return logs.filter((log) => {
//         return log?.date === date;
//     });
// };

const getDistinctIPs = (req, res) => {
    try {
        // const date = req.query.date;
        const logs = readLogs();
        // const filteredLogs = filterLogsByDate(logs, date);

        const ipCounts = logs.reduce((acc, log) => {
            acc[log.ipAddress] = (acc[log.ipAddress] || 0) + 1;
            return acc;
        }, {});

        const result = Object.keys(ipCounts).map((ip) => ({
            ipAddress: ip,
            occurrences: ipCounts[ip],
        }));

        result.sort((a, b) => b.occurrences - a.occurrences);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const getHourlyTraffic = (req, res) => {
    try {
        const logs = readLogs();

        const hourlyCounts = logs.reduce((counts, log) => {
            const hour = Number(log.time?.split(":")[0]);
            counts[hour]++;
            return counts;
        }, Array(24).fill(0));

        const result = hourlyCounts.map((count, hour) => ({
            hour: String(hour).padStart(2, "0"),
            visitors: count,
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const getTopIPs = (req, res) => {
    try {
        const logs = readLogs();

        const ipCounts = {};
        logs.forEach((log) => {
            ipCounts[log.ipAddress] = (ipCounts[log.ipAddress] || 0) + 1;
        });

        const totalTraffic = logs.length;
        const sortedIPs = Object.entries(ipCounts).sort((a, b) => b[1] - a[1]);

        let cumulativeTraffic = 0;
        const result = [];
        for (const [ip, count] of sortedIPs) {
            cumulativeTraffic += count;
            result.push({ ipAddress: ip, occurrences: count });
            if (cumulativeTraffic / totalTraffic >= 0.85) break;
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const getTopHours = (req, res) => {
    try {
        const logs = readLogs();
        const hourlyCounts = Array(24).fill(0);
        logs.forEach((log) => {
            const hour = Number(log.time?.split(":")[0]);
            hourlyCounts[hour]++;
        });

        const totalTraffic = logs.length;
        const sortedHours = hourlyCounts
            .map((count, hour) => ({ hour: String(hour).padStart(2, "0"), count }))
            .sort((a, b) => b.count - a.count);

        let cumulativeTraffic = 0;
        const result = [];
        for (const { hour, count } of sortedHours) {
            cumulativeTraffic += count;
            result.push({ hour, visitors: count });
            if (cumulativeTraffic / totalTraffic >= 0.7) break;
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { getDistinctIPs, getHourlyTraffic, getTopIPs, getTopHours };