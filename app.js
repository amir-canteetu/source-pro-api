import express from "express";
import userRoutes from "./modules/user/routes/userRoutes.js";
import authRoutes from "./modules/user/routes/authRoutes.js";
import { verifyToken } from "./modules/user/middleware/authMiddleware.js";
import tenderRoutes from "./modules/procurement/routes/tenderRoutes.js";
import companyRoutes from "./modules/organization/routes/companyRoutes.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const accessLogStream = fs.createWriteStream(join(__dirname, "access.log"), {
  flags: "a",
});
const logFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
const logStream =
  process.env.NODE_ENV === "production" ? accessLogStream : undefined;

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN,
  methods: "GET,POST",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(morgan(logFormat, { stream: logStream }));
app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

const isProduction = process.env.NODE_ENV === "production";

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: isProduction ? "Internal Server Error" : err.message,
  });
});

// Routes
app.use("/v1/api/auth", authRoutes); // Authentication routes
app.use("/v1/api/users", verifyToken, userRoutes); // User routes with JWT authentication
app.use("/v1/api/tenders", verifyToken, tenderRoutes);
app.use("/v1/api/companies", verifyToken, companyRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
