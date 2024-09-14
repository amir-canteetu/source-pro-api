import jwt from 'jsonwebtoken';
import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';

// Create a __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const privateKey = fs.readFileSync(path.join(__dirname, '../config/keys/ec_private.pem'), 'utf8');

const login = [

  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isString().trim().notEmpty().withMessage('Password is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {

      const user = await User.findUserByEmail(email);

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const payload = { email: user.email, id: user.id };

      // Sign the token
      const token = jwt.sign(payload, privateKey, { algorithm: 'ES256', expiresIn: '1h' });

      const userWithoutSensitiveInfo = _.omit(user, ['password_hash', 'bio']);
      res.json({ token:token, user: userWithoutSensitiveInfo});

    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  }
];

const register = [

    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password')
    .isString()
    .trim()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/\d/).withMessage('Password must contain at least one digit')
    .matches(/[\W_]/).withMessage('Password must contain at least one special character (e.g., @, #, $, etc.)'),

    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
      try {

        const existingUser = await User.findUserByEmail(email);
        if (existingUser) {
          return res.status(400).json({ message: 'Email already taken' });
        }  

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.createUser({ email, password_hash: hashedPassword });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
      } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
      }
    }
  ];

  const logout = (req,res) => {

  };
 

export { login, logout, register };
