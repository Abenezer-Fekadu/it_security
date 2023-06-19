const mongoose = require("mongoose");
const { Roles } = require("../models/roles");
const { Permissions } = require("../models/permissions");

mongoose
  .connect("mongodb://127.0.0.1/security", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB");

    // Find the permissions from the 'permissions' collection
    const permissions = await Permissions.find();

    // Create a new role and assign the permissions
    const newRole = new Roles({
      title: "Admin",
      permissions: permissions.map((permission) => permission.id),
      role: 1,
    });

    await newRole.save();
    console.log("Role created successfully.");

    mongoose.disconnect(); // Close the connection
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
