const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  NODE_ENV: process.env.NODE_ENV || "development",
};

// Validate required variables — crash early if missing
const required = ["MONGO_URI", "JWT_SECRET", "GROQ_API_KEY"];

required.forEach((key) => {
  if (!env[key]) {
    console.error(`❌  Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

module.exports = env;