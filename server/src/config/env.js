import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};

// Validate required environment variables
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];

for (const envVar of requiredEnvVars) {
  if (!env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

export default env;
