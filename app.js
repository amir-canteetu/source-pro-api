
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import authenticateJWT from './middleware/authMiddleware.js';
import tenderRoutes from './routes/tenderRoutes.js'; // Import tender routes
import bodyParser from 'body-parser';
import cors from 'cors';

const app               = express();
const PORT              = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/users', authenticateJWT, userRoutes); // User routes with JWT authentication
app.use('/api/tenders', authenticateJWT,tenderRoutes); // Mount tender routes under /api/tenders

// Error handling middleware (example)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
