// Models
const { User } = require("../../models/auth");
const { Feedback } = require("../../models/feedback");

// Views
async function home(req, res) {
  let users = await User.count();
  let feedbacks = await Feedback.count();

  const status = "Welcome To The Admin Page";

  res.render("admin/home", {
    extractScripts: true,
    layout: "../views/layouts/admin",
    users,
    feedbacks,
    status,
  });
}

// Views
exports.home = home;
