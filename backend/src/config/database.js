const mongoose = require("mongoose");
const env = require("./env");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);

    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌  MongoDB connection failed: ${error.message}`);
    process.exit(1); // Exit process — app is useless without DB
  }
};

// Log when mongoose loses connection after initial connect
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️   MongoDB disconnected");
});

module.exports = connectDB;