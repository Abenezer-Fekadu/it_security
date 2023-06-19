const fs = require("fs");
// Models
const { Feedback } = require("../../models/feedback");

// Views
async function AllFeedbacks(req, res) {
  let feedbacks = await Feedback.find();

  res.render("admin/feedback/index", {
    extractScripts: true,
    layout: "../views/layouts/admin",
    feedbacks,
  });
}

async function showFeedback(req, res) {
  const { feedbackId } = req.params;
  const feedback = await Feedback.findById(feedbackId);

  if (!feedback) {
    res.redirect("/admin/feedbacks");
  }
  res.render("admin/feedback/show", {
    extractScripts: true,
    layout: "../views/layouts/admin",
    feedback,
  });
}

const path = require("path");

async function getFile(req, res) {
  const filename = req.params.filename;
  const filePath = path.join(
    process.cwd(),
    "public",
    "files",
    "uploads",
    filename
  );

  fs.access("public/files/uploads/" + filename, (err) => {
    if (err) {
      // File does not exist
      return res.status(404).send("File not found");
    }
    // File exists, send it in the response
    res.sendFile(filePath);
  });
}

exports.AllFeedbacks = AllFeedbacks;
exports.showFeedBack = showFeedback;
exports.getFile = getFile;
