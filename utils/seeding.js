const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();
console.log(process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    const admin = await new User({
      password: "sss",
      email: "devahmedabdo@gmail.com",
      name: "ahmed abdo",
      role: "admin",
      super: true,
    });
    await admin.save();
    console.error("succsefull creat initial data:");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error creating initial data:", err);
    mongoose.connection.close();
  });
