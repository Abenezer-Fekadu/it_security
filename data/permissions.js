const mongoose = require("mongoose");

const { Permissions } = require("../models/permissions");
// Establish a connection to MongoDB
mongoose
  .connect("mongodb://127.0.0.1/security", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    // Insert the permissions
    const permissions = [
      { title: "user_management_access" },
      { title: "permission_access" },
      { title: "role_access" },
      { title: "user_access" },
      { title: "feedback_access" },
    ];

    Permissions.insertMany(permissions)
      .then(() => {
        console.log("Permissions inserted successfully.");
        mongoose.disconnect(); // Close the connection
      })
      .catch((error) => {
        console.error("Error occurred:", error);
        mongoose.disconnect(); // Close the connection
      });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
