// server.js
const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
// const path = require('path');
const authRoutes = require('./routes/authRoutes');
// const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middlewares/errorHandler');
const planRoutes = require('./routes/planRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require("cors");
dotenv.config();
const connectDB = require('./config/db');
connectDB();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Middleware
// app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // serve uploaded images
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/booking', bookingRoutes);
app.use('/api/plans', planRoutes);
// 
// Error handler
app.use(errorHandler);
// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
 app.listen(process.env.PORT, () => {
  console.log("Server is running " + process.env.PORT);
});
