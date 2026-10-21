// COMP 3123 Assignment 1
// Zelda Pelletier
const fs = require("fs");
const path = require("path");
const logDir = path.join(__dirname, "..", "logs");
fs.mkdirSync(logDir, { recursive: true });
const logFile = path.join(logDir, "app.log");
function write(level, message)
{
    const line = new Date().toISOString() + " [" + level + "] " + message;
    console.log(line);
    fs.appendFile(logFile, line + "\n", () => {});
}
module.exports = {info: (message) => write("INFO", message), warn: (message) => write("WARN", message), error: (message) => write("ERROR", message)};