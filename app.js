// app.js

const express           = require('express');
const userRoutes        = require('./routes/userRoutes');
const tenderRoutes      = require('./routes/tenderRoutes'); // Import tender routes
const bodyParser        = require('body-parser');
const cors              = require('cors');

const app               = express();
const PORT              = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes); // Mount user routes under /api/users
app.use('/api/tenders', tenderRoutes); // Mount tender routes under /api/tenders

// Error handling middleware (example)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
