const Joi = require("joi");
const mongoose = require("mongoose");

const permissionsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

function validatePermissions(permission) {
  const schema = Joi.object({
    title: Joi.string().min(2).required(),
    _csrf: Joi.string(),
  });

  try {
    var messages = {};
    let errors = schema.validate(permission, { abortEarly: false });
    errors = errors.error.details;
    errors.forEach((error) => {
      messages[error.path] = error.message;
    });
    return messages;
  } catch (errors) {
    return;
  }
}

exports.validatePermissions = validatePermissions;
const Permissions = mongoose.model("Permissions", permissionsSchema);
module.exports.Permissions = Permissions;
