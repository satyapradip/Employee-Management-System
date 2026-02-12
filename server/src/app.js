import express from "express";
import cors from "cors";
import { env } from "./config/index.js";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import hpp from "hpp";

const app = express();

// ===========================================
// MIDDLEWARE (Optimized Order)
// ===========================================

// Parse allowed origins
const allowedOrigins = env.CLIENT_URL.split(",").map((url) => url.trim());

// 1. CORS - Must come BEFORE helmet to avoid conflicts
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(null, env.NODE_ENV === "development"); // Strict in production
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// 2. Security Headers - Environment-aware configuration
if (env.NODE_ENV === "production") {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", ...allowedOrigins],
          fontSrc: ["'self'", "data:"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginResourcePolicy: { policy: "cross-origin" },
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
    }),
  );
} else {
  // Development - More permissive for easier debugging
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disable strict CSP in dev
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );
}

// 3. Compression - Reduce bandwidth
app.use(compression());

// 4. Body Parsers - Parse incoming requests
app.use(express.json({ limit: "10kb" })); // Prevents large payload attacks
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// 4. HTTP Parameter Pollution Protection
app.use(hpp());

// 5. Data Sanitization
app.use(mongoSanitize()); // Remove $ and . from req.body/params/query
app.use(xss()); // Clean user input from malicious HTML

// 6. Global Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.NODE_ENV === "development" ? 1000 : 100, // Very lenient in dev
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
});
app.use(globalLimiter);

// 7. Route-Specific Rate Limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.NODE_ENV === "development" ? 100 : 5, // Lenient in dev, strict in prod
  message: {
    success: false,
    message: "Too many login attempts, please try again later",
  },
  skipSuccessfulRequests: true, // Don't count successful logins
  standardHeaders: true,
  legacyHeaders: false,
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: env.NODE_ENV === "development" ? 50 : 3,
  message: {
    success: false,
    message: "Too many password reset requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.NODE_ENV === "development" ? 50 : 5,
  message: {
    success: false,
    message: "Too many password reset attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply route-specific limiters
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/forgot-password", forgotPasswordLimiter);
app.use("/api/auth/reset-password/:token", resetPasswordLimiter);

// 8. Request Logging (Development only)
if (env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
}

// 9. Production Logging
if (env.NODE_ENV === "production") {
  app.use(morgan("combined")); // Apache-style logs
}

// ===========================================
// ROUTES
// ===========================================

app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Employee Management System API",
    version: "1.0.0",
    docs: "/api/health",
  });
});

// ===========================================
// ERROR HANDLING
// ===========================================

app.use(notFound);
app.use(errorHandler);

export default app;
