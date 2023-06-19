// Imports
const express = require("express");
var methodOverride = require("method-override");
const ejs = require("ejs");
const cors = require("cors");
const csrf = require("csurf");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const fs = require("fs");

// Env Config
require("dotenv").config();
const PORT = process.env.PORT || 8000;

// App
const app = express();

app.use(express.urlencoded({ extended: false }));

// Middle-wares
app.use(methodOverride("_method"));
app.use(cors());

app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(csrf({ cookie: true }));

// Static Files
app.use(express.static(__dirname + "/public"));

// Set Template Engines
app.use(expressLayouts);
app.set("layout", "./layouts/app");
app.set("view engine", "ejs");

// Import Routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");

app.use(function (req, res, next) {
  res.locals.token = req.cookies;
  next();
});

app.use(function (req, res, next) {
  app.locals.csrf = req.csrfToken();
  next();
});

// DB Connect
mongoose
  .connect(process.env.DATABASE_URI, {})
  .then(() => console.log("Db Connected"))
  .catch((err) => console.log("Could not connect to mongoDB...", err));

// Rotes Middle-ware
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);

// Run Server
app.listen(PORT, () => console.log(`listening on port ${PORT}.....`));
