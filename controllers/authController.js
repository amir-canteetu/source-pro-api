import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';

// Create a __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the private key file
const privateKey = fs.readFileSync(path.join(__dirname, '../config/keys/ec_private.pem'), 'utf8');

const login = [
  // Validation and sanitization
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isString().trim().notEmpty().withMessage('Password is required'),

  // Controller logic
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      // Find the user by email
      const user = await User.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed. User not found.' });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
      }

      // Create JWT payload
      const payload = { email: user.email, id: user.id };

      // Sign the token
      const token = jwt.sign(payload, privateKey, { algorithm: 'ES256', expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  }
];

// Controller to handle user registration
const register = [
    // Validation and sanitization
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isString().trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  
    // Controller logic
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
      try {
        // Check if the email already exists
        const existingUser = await User.findUserByEmail(email);
        if (existingUser) {
          return res.status(400).json({ message: 'Email already taken' });
        }
  
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Create a new user
        const newUser = await User.createUser({ email, password: hashedPassword });
  
        // Respond with success message
        res.status(201).json({ message: 'User registered successfully', user: newUser });
      } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
      }
    }
  ];

export { login, register };
