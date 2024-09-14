
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import authenticateJWT from './middleware/authMiddleware.js';
import tenderRoutes from './routes/tenderRoutes.js';  
import companyRoutes from './routes/companyRoutes.js';  
import cors from 'cors';
import helmet from "helmet";
import morgan from 'morgan';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';

dotenv.config();

const app               = express();
const PORT              = process.env.PORT || 3000;
const __dirname         = dirname(fileURLToPath(import.meta.url));

// Middleware
const accessLogStream = fs.createWriteStream(join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Error handling 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: isProduction ? 'Internal Server Error' : err.message,
  });
});

// Routes
app.use('/v1/api/auth', authRoutes); // Authentication routes
app.use('/v1/api/users', authenticateJWT, userRoutes); // User routes with JWT authentication
app.use('/v1/api/tenders', authenticateJWT,tenderRoutes); 
app.use('/v1/api/companies', authenticateJWT,companyRoutes); 

const isProduction = process.env.NODE_ENV === 'production';

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;

/*ToDo For Production:
1. ensure auth cookie is https; see controllers/authController.js
*/
