const server = require('./app');
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_CONN_STR);
        console.log("DB Connection Successful");
    } catch (error) {
        console.log("Error in connecting to DB:", error.message);
        process.exit(1); // Exit if DB connection fails
    }
}

// Connect to DB first, then start server
connectDB().then(() => {
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
        console.log(`Server started on port: ${port}`);
    });
});