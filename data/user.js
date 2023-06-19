const { Roles } = require("../models/roles");
const { User } = require("../models/auth");

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1/security", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB");

    // Your code for creating the user with the 'admin' role
    const adminRole = await Roles.findOne({ name: "Admin" });

    const newUser = new User({
      name: "admin",
      email: "se.abenezer.fekadu@gmail.com",
      password: "admin123",
      role: adminRole.id,
    });

    await newUser.save();
    console.log("User created successfully.");

    mongoose.disconnect(); // Close the connection
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
