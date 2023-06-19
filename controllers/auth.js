// Imports
const { User, signupValidate, loginValidate } = require("../models/auth");
const { Roles } = require("../models/roles");
const Permissions = require("../models/permissions");

const jwt = require("jsonwebtoken"); // to generate signed token
const expressJwt = require("express-jwt"); // for authorization check

// Apis
async function signUp(req, res) {
  if (req.body.isAdmin === "true") {
    console.log("Potential Hacker");
  }
  delete req.body.isAdmin;

  // Validate the user
  const messages = signupValidate(req.body);
  if (messages)
    return res.render("auth/register", {
      extractScripts: true,
      errors: messages,
    });

  // Check if the user exists
  try {
    let user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (user)
      return res.render("auth/register", {
        extractScripts: true,
        errors: { email: "User Already Exists" },
      });

    // Save User
    user = new User(req.body);
    await user.save();

    user.salt = undefined;
    user.hashedPassword = undefined;

    return res.redirect("/auth/login");
  } catch (err) {
    console.log(err);
    res.redirect("/error");
  }
}

async function login(req, res) {
  // Validate the user
  const messages = loginValidate(req.body);
  if (messages)
    return res.render("auth/login", {
      extractScripts: true,
      errors: messages,
    });

  // Get User
  const { password } = req.body;
  const email = req.body.email.toLowerCase();
  try {
    // check User
    let user = await User.findOne({ email }).populate("role");
    if (!user)
      return res.render("auth/login", {
        extractScripts: true,
        errors: { email: "User does not exist" },
      });

    if (!user.authenticate(password)) {
      return res.render("auth/login", {
        extractScripts: true,
        errors: { password: "Email or password is incorrect" },
      });
    }
    if (!user.isActive) {
      return res.render("auth/login", {
        extractScripts: true,
        errors: { email: "Your Account has been Deactivated" },
      });
    }
    // Generate Token
    const token = jwt.sign(
      { id: user.id, role: user.role.id },
      process.env.JWT_SECRET
    );

    res.cookie("access_token", token, {
      expire: new Date() + 9999,
      httpOnly: true,
    });

    if (user.role.role == 1) {
      res.redirect("/admin");
    } else {
      res.redirect("/user/feedbacks");
    }
    // next();
  } catch (err) {
    res.redirect("/error");
  }
}

async function logout(req, res) {
  res.clearCookie("access_token");
  res.redirect("/auth/login");
}

// Views
function loginPage(req, res) {
  res.render("auth/login", { extractScripts: true, errors: {} });
}
function signUpPage(req, res) {
  res.render("auth/register", { extractScripts: true, errors: {} });
}

exports.requireSignIn = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});

exports.isAuth = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.redirect("/auth/login");
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findById(data.id)
      .select("-hashedPassword -salt")
      .populate("role");
    if (!user) {
      return res.redirect("/auth/login");
    }
    check =
      data.id.toString() && user.role.id.toString() == data.role.toString();

    if (!check) {
      return res.redirect("/auth/login");
    }

    let roles = await Roles.findById(data.role).populate("permissions");
    permissions = [];
    roles["permissions"].forEach((per) => {
      permissions.push(per.title);
    });

    res.locals.access = permissions;
    req.profile = user;
    next();
  } catch (err) {
    return res.redirect("/auth/login");
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role.role != 1) {
    res.redirect("/user/feedbacks");
  }

  next();
};
exports.isUser = (req, res, next) => {
  if (req.profile.role.role != 0) {
    res.redirect("/admin");
  }
  next();
};

// exports.getToken = (req, res, next) => {
//   console.log(req.cookies);
//   res.locals.token = req.cookies;
// };

// Export
exports.signUpPage = signUpPage;
exports.loginPage = loginPage;

exports.signUp = signUp;
exports.login = login;
exports.logout = logout;
