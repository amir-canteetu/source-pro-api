
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import authenticateJWT from './middleware/authMiddleware.js';
import tenderRoutes from './routes/tenderRoutes.js';  
import companyRoutes from './routes/companyRoutes.js';  
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from "helmet";
import morgan from 'morgan';

const app               = express();
const PORT              = process.env.PORT || 3000;

app.use(morgan('tiny'));

/*
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});

app.use(limiter);
*/

/*
const cors = require('cors');

const corsOptions = {
  origin: 'https://yourfrontenddomain.com', // Replace with your frontend domain
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));
*/

app.use(helmet());

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use('/v1/api/users', (req, res, next) => {
  //this function will be called on this path only
  next() 
})

// Routes
app.use('/v1/api/auth', authRoutes); // Authentication routes
app.use('/v1/api/users', authenticateJWT, userRoutes); // User routes with JWT authentication
app.use('/v1/api/tenders', authenticateJWT,tenderRoutes); 
app.use('/v1/api/companies', authenticateJWT,companyRoutes); 

// Error handling 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
