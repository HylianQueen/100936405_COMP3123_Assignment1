// COMP 3123 Assignment 1
// Zelda Pelletier
require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const logger = require("./utils/logger");
const port = process.env.PORT || 3000;
async function startServer()
{
    try
    {
        await connectDB();
        app.listen(port, () =>
        {
            logger.info("Server running on port " + port);
        });
    }
    catch (error)
    {
        logger.log("Startup failed: " + error.message);
        process.exit(1);
    }
}
startServer();