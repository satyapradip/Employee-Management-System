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
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",

  // Email configuration
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_SECURE: process.env.SMTP_SECURE,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM,
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
