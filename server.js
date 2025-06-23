require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const sanitizeInput = require('./middlewares/sanitizeInputMiddleware');
// Local
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const issueRoutes = require('./routes/issueRoutes');
const planRoutes = require('./routes/planRoutes');

// Connect DB
connectDB();

// Global Middleware
// app.use(cors({ origin: ['https://your-frontend.com'], credentials: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
 app.use(sanitizeInput);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/users', userRoutes);
app.use('/issues', issueRoutes);
app.use('/plans', planRoutes);

// Static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 404
app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

// Error Handler
app.use(errorHandler);

// Start
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});