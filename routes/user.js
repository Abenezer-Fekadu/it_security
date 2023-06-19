const express = require("express");
const router = express.Router();
const upload = require("../utils/multerUtil");

const {
  AllFeedbacks,
  editFeedback,
  createFeedback,
  showFeedback,
  newFeedback,
  updateFeedback,
  deleteFeedback,
} = require("../controllers/user/feedback");

const { isUser, isAuth } = require("../controllers/auth");

// Feedbacks Views
router.get("/feedbacks", isAuth, isUser, AllFeedbacks);
router.get("/feedbacks/edit/:feedbackId", isAuth, isUser, editFeedback);
router.get("/feedbacks/create", isAuth, isUser, createFeedback);
router.get("/feedbacks/view/:feedbackId", isAuth, isUser, showFeedback);

// API
// Api Feedbacks
router.post("/feedbacks", isAuth, isUser, upload.single("file"), newFeedback);
router.put(
  "/feedbacks/update/:feedbackId",
  isAuth,
  isUser,
  upload.single("file"),
  updateFeedback
);
router.delete("/feedbacks/delete/:feedbackId", isAuth, isUser, deleteFeedback);

// Export
module.exports = router;
