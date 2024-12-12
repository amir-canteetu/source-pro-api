const jwt = require("jsonwebtoken");
const fs = require("fs");

const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH, "utf8");
const publicKey = fs.readFileSync(process.env.PUBLIC_KEY_PATH, "utf8");

const accessTokenExpiresIn = process.env.accessTokenExpiresIn || "15m";
const refreshTokenExpiresIn = process.env.refreshTokenExpiresIn || "7d";

// Helper function to generate tokens
const generateAccessToken = (user) => {
  try {
    if (!user || !user.id || !user.username || !user.role) {
      throw new Error(
        "Invalid user object. Expected an object with 'id', 'username', and 'role' properties.",
      );
    }

    return jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      privateKey,
      { algorithm: "ES256", expiresIn: accessTokenExpiresIn },
    );
  } catch (error) {
    throw error;
  }
};

const generateRefreshToken = (user) => {
  try {
    if (!user || !user.id || !user.username || !user.role) {
      throw new Error(
        "Invalid user object. Expected an object with 'id', 'username', and 'role' properties.",
      );
    }

    return jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      privateKey,
      { algorithm: "ES256", expiresIn: refreshTokenExpiresIn },
    );
  } catch (error) {
    throw error;
  }
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access token missing" });

  jwt.verify(token, publicKey, { algorithms: ["ES256"] }, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Invalid or expired access token" });
    }

    req.user = decoded;
    next();
  });
};

const verifyRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res
        .status(403)
        .json({ message: "Access forbidden: insufficient permissions" });
    }
    next();
  };
};

module.exports = {
  publicKey,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  verifyRole,
};
