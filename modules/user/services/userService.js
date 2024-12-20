const User = require("@userModule/models/userModel.js");
const bcrypt = require("bcrypt");
const logger = require("@root/services/logger.js");

const createUser = async (userData) => {
  try {
    const existingUser = await User.findUserByEmail(userData.email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already taken" });
    }

    const { email, password, role } = userData;
    const attributes = {
      roles: [role],
    };

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.createUser({
      email,
      password_hash: hashedPassword,
      attributes,
    });

    return user;
  } catch (error) {
    logger.error(`Error creating user: ${error.message}`);
    res
      .status(500)
      .json({ message: "An error occurred while creating the user" });
  }
};

module.exports = { createUser };
