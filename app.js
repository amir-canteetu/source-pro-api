import express from "express";
import userRoutes from "@userModule/routes/userRoutes.js";
import authRoutes from "@userModule/routes/authRoutes.js";
import { verifyToken } from "@userModule/middleware/authMiddleware.js";
import tenderRoutes from "./modules/procurement/routes/tenderRoutes.js";
import companyRoutes from "./modules/organization/routes/companyRoutes.js";
import errorHandler from "./modules/middleware/errorHandler.js";
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
const isProduction = process.env.NODE_ENV === "production";
const __dirname = dirname(fileURLToPath(import.meta.url));
const accessLogStream = fs.createWriteStream(join(__dirname, "access.log"), {
  flags: "a",
});
const logFormat = isProduction ? "combined" : "dev";
const logStream = isProduction ? accessLogStream : undefined;

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

// Routes
app.use("/v1/api/auth", authRoutes); // Authentication routes
app.use("/v1/api/users", userRoutes); // User routes with JWT authentication
app.use("/v1/api/tenders", verifyToken, tenderRoutes);
app.use("/v1/api/companies", verifyToken, companyRoutes);

app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
