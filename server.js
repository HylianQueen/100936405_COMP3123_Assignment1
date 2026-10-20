// COMP 3123 Assignment 1
// Zelda Pelletier
require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const port = process.env.PORT || 3000;
async function startServer()
{
    try
    {
        await connectDB();
        app.listen(port, () =>
        {
            console.log("Server running on port " + port);
        });
    }
    catch (error)
    {
        console.log("Startup failed: " + error.message);
        process.exit(1);
    }
}
startServer();