const Joi = require("joi");
const mongoose = require("mongoose");

const rolesSchema = new mongoose.Schema(
  {
    role: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      unique: true,
      required: true,
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permissions",
        nullable: true,
      },
    ],
  },
  { timestamps: true }
);

function validateRoles(role) {
  const schema = Joi.object({
    title: Joi.string().min(2).required(),
    permissions: Joi.array().required(),
    _csrf: Joi.string(),
  });

  try {
    var messages = {};
    let errors = schema.validate(role, { abortEarly: false });
    errors = errors.error.details;
    errors.forEach((error) => {
      messages[error.path] = error.message;
    });
    return messages;
  } catch (errors) {
    return;
  }
}

exports.validateRoles = validateRoles;
exports.Roles = mongoose.model("Roles", rolesSchema);
