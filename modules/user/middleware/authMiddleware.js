import jwt from "jsonwebtoken";
import fs from "fs";

const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH, "utf8");
export const publicKey = fs.readFileSync(process.env.PUBLIC_KEY_PATH, "utf8");

const accessTokenExpiresIn = process.env.accessTokenExpiresIn || "15m";
const refreshTokenExpiresIn = process.env.refreshTokenExpiresIn || "7d";

// Helper function to generate tokens
export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    privateKey,
    { algorithm: "ES256", expiresIn: accessTokenExpiresIn },
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    privateKey,
    { algorithm: "ES256", expiresIn: refreshTokenExpiresIn },
  );
};

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access token missing" });

  jwt.verify(token, publicKey, { algorithms: ["ES256"] }, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Invalid or expired access token" });
    }

    req.user = decoded;
    next();
  });
};

export const verifyRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res
        .status(403)
        .json({ message: "Access forbidden: insufficient permissions" });
    }
    next();
  };
};
