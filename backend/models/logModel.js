const fs = require("fs");
const path = require("path");

const LOG_FILE_PATH = path.join(__dirname, "../logs.txt");

const parseLogEntry = (entry) => {
    const regex = /^(\S+) - - \[([^\]]+)\] "(\S+) (\S+) (\S+)" (\d+) (\d+) "([^"]*)" "([^"]*)"/;
    const match = entry.match(regex);
    if (!match) return null;

    const timestamp = match[2];

    const cleanedTimestamp = timestamp.slice(0, -1);
    const colonIndex = cleanedTimestamp.indexOf(":");
    const date = cleanedTimestamp.slice(0, colonIndex);
    const time = cleanedTimestamp.slice(colonIndex + 1);

    const formattedTime = time.split(" ")[0];

    return {
        ipAddress: match[1],
        date: date,
        time: formattedTime,
        method: match[3],
        resource: match[4],
        httpVersion: match[5],
        statusCode: parseInt(match[6]),
        responseSize: parseInt(match[7]),
        referrer: match[8],
        userAgent: match[9],
    };
};

const readLogs = () => {
    const logData = fs.readFileSync(LOG_FILE_PATH, "utf-8");
    const logEntries = logData.split("\n");
    return logEntries.map(parseLogEntry).filter(Boolean);
};

module.exports = { readLogs };