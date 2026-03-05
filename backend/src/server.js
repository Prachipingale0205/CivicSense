const app = require("./app");
const connectDB = require("./config/database");
const env = require("./config/env");

const start = async () => {
  // Connect to MongoDB first — server should not start without DB
  await connectDB();

  // Start Express server only after DB is connected
  app.listen(env.PORT, () => {
    console.log(`🚀  CivicSense API running on port ${env.PORT}`);
    console.log(`🌍  Environment: ${env.NODE_ENV}`);
    console.log(`🔗  Health: http://localhost:${env.PORT}/api/health`);
  });
};

// Handle any unhandled promise rejections — safety net
process.on("unhandledRejection", (err) => {
  console.error("❌  Unhandled Rejection:", err.message);
  process.exit(1);
});

start();