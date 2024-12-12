const express = require("express");
require("module-alias/register");
const userRoutes = require("@userModule/routes/userRoutes.js");
const authRoutes = require("@userModule/routes/authRoutes.js");
const { verifyToken } = require("@userModule/middleware/authMiddleware.js");
const tenderRoutes = require("./modules/procurement/routes/tenderRoutes.js");
const companyRoutes = require("./modules/organization/routes/companyRoutes.js");
const errorHandler = require("./modules/middleware/errorHandler.js");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  {
    flags: "a",
  },
);
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

module.exports = app;
