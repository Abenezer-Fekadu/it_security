const Joi = require("joi");
const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const authSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: 2,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: 255,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roles",
      default: "648f49c637a3949edfac070a",
    },
  },
  { timestamps: true }
);

authSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();

    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

authSchema.methods = {
  authenticate: function (txt) {
    return this.encryptPassword(txt) === this.hashedPassword;
  },
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

function validateUserSignup(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),

    password: Joi.string()
      .min(6)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    password_confirmation: Joi.string().required().valid(Joi.ref("password")),

    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    _csrf: Joi.string(),
  });

  try {
    var messages = {};
    let errors = schema.validate(user, { abortEarly: false });
    errors = errors.error.details;

    errors.forEach((error) => {
      messages[error.path] = error.message;
    });

    return messages;
  } catch (errors) {
    return;
  }
}

function validateUserSignIn(user) {
  const schema = Joi.object({
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    _csrf: Joi.string(),
  });

  try {
    var messages = {};
    let errors = schema.validate(user, { abortEarly: false });
    errors = errors.error.details;
    errors.forEach((error) => {
      messages[error.path] = error.message;
    });
    return messages;
  } catch (errors) {
    return;
  }
}
function validateUsers(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).allow(""),
    role: Joi.string(),
    _csrf: Joi.string(),
  });

  try {
    var messages = {};
    let errors = schema.validate(user, { abortEarly: false });
    errors = errors.error.details;
    errors.forEach((error) => {
      messages[error.path] = error.message;
    });
    return messages;
  } catch (errors) {
    return;
  }
}

exports.validateUsers = validateUsers;
exports.signupValidate = validateUserSignup;
exports.loginValidate = validateUserSignIn;
exports.User = mongoose.model("User", authSchema);
