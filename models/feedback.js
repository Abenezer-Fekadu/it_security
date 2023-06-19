const Joi = require("joi");
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      nullable: true,
    },
  },
  { timestamps: true }
);

function validateFeedback(feedback) {
  const schema = Joi.object({
    reviewer: Joi.string().hex().length(24),
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    comment: Joi.string().required(),
    photo: Joi.string(),
    _csrf: Joi.string(),
  });

  try {
    var messages = {};
    let errors = schema.validate(feedback, { abortEarly: false });
    errors = errors.error.details;
    errors.forEach((error) => {
      messages[error.path] = error.message;
    });
    return messages;
  } catch (errors) {
    return;
  }
}

exports.validateFeedback = validateFeedback;
exports.Feedback = mongoose.model("Feedback", feedbackSchema);
