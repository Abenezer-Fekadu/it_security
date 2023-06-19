const fs = require("fs");
const jwt = require("jsonwebtoken"); // to generate signed token

// Models
const { Feedback, validateFeedback } = require("../../models/feedback");

// Views
async function AllFeedbacks(req, res) {
  const user = jwt.decode(req.cookies.access_token);

  let feedbacks = await Feedback.find({ reviewer: user.id });

  res.render("user/feedback/index", {
    extractScripts: true,
    layout: "../views/layouts/user",
    feedbacks,
  });
}

async function createFeedback(req, res) {
  res.render("user/feedback/create", {
    extractScripts: true,
    layout: "../views/layouts/user",
    feedback: new Feedback(),
    errors: {},
  });
}

async function editFeedback(req, res) {
  const { feedbackId } = req.params;
  const feedback = await Feedback.findById(feedbackId);

  var user = req.profile;
  if (!feedback) {
    res.redirect("/user/feedbacks");
  }
  if (feedback.reviewer != user.id) {
    res.redirect("/user/feedbacks");
  }
  res.render("user/feedback/edit", {
    extractScripts: true,
    layout: "../views/layouts/admin",
    feedback,
    errors: {},
  });
}

async function showFeedback(req, res) {
  const { feedbackId } = req.params;
  const feedback = await Feedback.findById(feedbackId);

  var user = req.profile;
  if (!feedback) {
    res.redirect("/user/feedbacks");
  }
  if (feedback.reviewer != user.id) {
    res.redirect("/user/feedbacks");
  }
  res.render("user/feedback/show", {
    extractScripts: true,
    layout: "../views/layouts/user",
    feedback,
  });
}

// Apis
async function newFeedback(req, res) {
  const user = jwt.decode(req.cookies.access_token);
  req.body.reviewer = user.id;

  const messages = validateFeedback(req.body);
  if (messages)
    return res.render("user/feedback/create", {
      extractScripts: true,
      layout: "../views/layouts/user",
      feedback: req.body,
      errors: messages,
    });

  try {
    let feedback = new Feedback(req.body);
    if (req.file) {
      file = req.file;
      feedback.file = file.filename;
    }
    feedback = await feedback.save();

    res.redirect(`/user/feedbacks/view/${feedback.id}`);
  } catch (e) {
    res.redirect("/error");
  }
}

async function updateFeedback(req, res) {
  const { feedbackId } = req.params;
  const messages = validateFeedback(req.body);
  if (messages) return res.status(401).send(messages);
  try {
    let feedback = await Feedback.findById(feedbackId);
    // When Update
    if (req.file) {
      file = req.file;
      if (feedback["file"]) {
        fs.unlink("public/files/uploads/" + feedback["file"], (err) => {
          if (err) {
            console.log(err);
          }
          console.log(`Deleted ${feedback["file"]}`);
        });
      }
      feedback.file = file.filename;
    }

    feedback.name = req.body.name;
    feedback.email = req.body.email;
    feedback.comment = req.body.comment;
    await feedback.save();
    res.redirect(`/user/feedbacks/view/${feedbackId}`);
  } catch (e) {
    res.redirect("/error");
  }
}

async function deleteFeedback(req, res) {
  const { feedbackId } = req.params;
  let feedback = await Feedback.findById(feedbackId);

  try {
    if (feedback["file"]) {
      fs.unlink("public/files/uploads/" + feedback["file"], (err) => {
        if (err) {
          console.log(err);
        }
        console.log(`Deleted ${feedback["file"]}`);
      });
    }

    await feedback.remove();
    res.redirect("/user/feedbacks");
  } catch (e) {
    res.redirect("/error");
  }
}

async function storeFeedback(req, res) {
  console.log(req.body);
  try {
    let feedback = await Feedback.findById(req.body.feedback_id);
    file = req.files[0];
    // When Update
    if (feedback["file"]) {
      fs.unlink("public/files/uploads/" + feedback["file"], (err) => {
        if (err) {
          console.log(err);
        }
        console.log(`Deleted ${feedback["file"]}`);
      });
    }

    feedback.file = file.filename;
    await feedback.save();

    return res.status(200).json({ url: `/user/feedbacks/show/${feedback.id}` });
  } catch (e) {
    fil = req.files;
    if (fil) {
      fs.unlink("public/files/uploads/" + fil[0].filename, (err) => {
        if (err) {
          console.log(err);
        }
        console.log(`Deleted ${fil[0].filename}`);
      });
    }
    return res.status(500).json({ url: "/error" });
  }
}

exports.AllFeedbacks = AllFeedbacks;
exports.createFeedback = createFeedback;
exports.showFeedback = showFeedback;
exports.editFeedback = editFeedback;

// Apis
exports.newFeedback = newFeedback;
exports.updateFeedback = updateFeedback;
exports.deleteFeedback = deleteFeedback;
exports.storeFeedback = storeFeedback;
