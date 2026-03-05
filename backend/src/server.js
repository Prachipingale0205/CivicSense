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

    // Keep Render free tier alive — pings self every 10 minutes
    // Render spins down after 15 min inactivity — this prevents that
    if (env.NODE_ENV === "production" && process.env.RENDER_URL) {
      setInterval(() => {
        const https = require("https");
        https
          .get(`${process.env.RENDER_URL}/api/health`, (res) => {
            console.log(`🏓  Self-ping OK — status ${res.statusCode}`);
          })
          .on("error", (err) => {
            console.warn(`⚠️  Self-ping failed: ${err.message}`);
          });
      }, 10 * 60 * 1000); // every 10 minutes

      console.log(`🏓  Self-ping active — keeping Render awake`);
    }
  });
};

// Handle any unhandled promise rejections — safety net
process.on("unhandledRejection", (err) => {
  console.error("❌  Unhandled Rejection:", err.message);
  process.exit(1);
});

start();
