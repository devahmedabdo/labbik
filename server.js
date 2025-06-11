// server.js
const express = require('express');
// const path = require('path');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
// const planRoutes = require('./routes/planRoutes');
// const adminRoutes = require('./routes/adminRoutes');
const app = express();
const dotenv = require('dotenv');
const cors = require("cors");
dotenv.config();
const connectDB = require('./config/db');
connectDB();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middlewares/errorHandler');

// Middleware
// app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // serve uploaded images
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use(express.json());
app.use('/api/booking', bookingRoutes);
// app.use('/api/plans', planRoutes);
// 
// Error handler
app.use(errorHandler);

 app.listen(process.env.PORT, () => {
  console.log("Server is running " + process.env.PORT);
});
