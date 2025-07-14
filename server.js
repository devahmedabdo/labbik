require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
// const sanitizeInput = require('./middlewares/sanitizeInputMiddleware');
// Local
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const issueRoutes = require("./routes/issueRoutes");
const planRoutes = require("./routes/planRoutes");
const Booking = require("./models/Booking");

// Connect DB
connectDB();

// Global Middleware
// app.use(cors({ origin: ['https://your-frontend.com'], credentials: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
//  app.use(sanitizeInput);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));

// Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/users", userRoutes);
app.use("/issues", issueRoutes);
app.use("/plans", planRoutes);
app.router.get("/mapping", async (req, res) => {
  const booking = await Booking.find();
  for (let i = 0; i < booking.length; i++) {
    if (booking[i].visa) {
      booking[i].visa = booking[i].visa.replace("http://31.97.155.136", "");
    }
    if (booking[i].pass_image) {
      booking[i].pass_image = booking[i].pass_image.replace("http://31.97.155.136", "");
    }
    if (booking[i].companions.length) {
      booking[i].companions.forEach((com) => {
        if (com.visa) {
          com.visa = com.visa.replace("http://31.97.155.136", "");
        }
        if (com.pass_image) {
          com.pass_image = com.pass_image.replace("http://31.97.155.136", "");
        }
      });
    }
    await booking[i].save()
  }
  
  res.status(201).send(booking);
});
// Static
app.use("/uploads", express.static("/var/www/labbik/uploads"));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// 404
app.use((req, res) => res.status(404).json({ message: "Not Found" }));

// Error Handler
app.use(errorHandler);

// Start
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
