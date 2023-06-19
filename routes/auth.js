// Imports
const express = require("express");
const router = express.Router();

// Controllers
const {
  requireSignIn,
  signUpPage,
  loginPage,
  signUp,
  login,
  logout,
} = require("../controllers/auth");

// Views
router.get("/login", loginPage);
router.get("/register", signUpPage);

// Apis
router.post("/register", signUp);
router.post("/login", login);
router.get("/logout", logout);

// Export
module.exports = router;
