import app from "./src/app.js";
import { connectDB, env } from "./src/config/index.js";

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    const server = app.listen(env.PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Employee Management System API                       ║
║                                                           ║
║   Server:     http://localhost:${env.PORT}                     ║
║   Environment: ${env.NODE_ENV.padEnd(10)}                           ║
║   Database:   MongoDB Connected                           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("❌ Unhandled Rejection:", err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      console.error("❌ Uncaught Exception:", err.message);
      process.exit(1);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
