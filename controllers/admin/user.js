// Models
const { User, validateUsers } = require("../../models/auth");
const { Roles } = require("../../models/roles");

// Views
async function AllUsers(req, res) {
  let users = await User.find().populate("role");

  res.render("admin/users/index", {
    extractScripts: true,
    layout: "../views/layouts/admin",
    users,
  });
}

async function createUser(req, res) {
  let roles = await Roles.find();

  res.render("admin/users/create", {
    extractScripts: true,
    layout: "../views/layouts/admin",
    roles,
    user: new User(),
    errors: {},
  });
}
async function editUser(req, res) {
  const { userId } = req.params;
  let roles = await Roles.find();
  const user = await User.findById(userId).populate("role");

  if (!user) {
    res.redirect("/admin/home");
  }
  res.render("admin/users/edit", {
    extractScripts: true,
    layout: "../views/layouts/admin",
    user,
    roles,
    errors: {},
  });
}

async function showUser(req, res) {
  const { userId } = req.params;
  const user = await User.findById(userId).populate("role");

  if (!user) {
    res.redirect("/admin/home");
  }
  res.render("admin/users/show", {
    extractScripts: true,
    layout: "../views/layouts/admin",
    user,
  });
}

// Apis
async function newUser(req, res) {
  req.body.email = req.body.email.toLowerCase();
  const messages = validateUsers(req.body);
  let roles = await Roles.find();

  if (messages)
    return res.render("admin/users/create", {
      extractScripts: true,
      layout: "../views/layouts/admin",
      roles,
      user: req.body,
      errors: messages,
    });

  try {
    const email = req.body.email.toLowerCase();
    let user = await User.findOne({ email });

    if (user)
      return res.render("admin/users/create", {
        extractScripts: true,
        layout: "../views/layouts/admin",
        user: req.body,
        roles,
        errors: { email: "User Already Exists" },
      });

    user = new User(req.body);
    user = await user.save();

    res.redirect(`/admin/users/show/${user.id}`);
  } catch (e) {
    res.render("/error");
  }
}

async function updateUser(req, res) {
  const { userId } = req.params;
  const messages = validateUsers(req.body);
  let user = await User.findById(userId).populate("role");
  let roles = await Roles.find();

  if (messages)
    return res.render("admin/users/edit", {
      extractScripts: true,
      layout: "../views/layouts/admin",
      roles,
      user: user,
      errors: messages,
    });

  try {
    if (!req.body.password) {
      user.email = req.body.email.toLowerCase();
      user.name = req.body.name;
      user.role = req.body.role;
      user.save();
    } else {
      user = await User.findOneAndUpdate({ _id: userId }, req.body);
    }
    if (!user) {
      res.render(`/admin/users/edit/${id}`);
    }
    res.redirect("/admin/users");
  } catch (e) {
    res.redirect("/error");
  }
}

async function deactivateUser(req, res) {
  const { userId } = req.params;

  try {
    await User.findByIdAndUpdate(userId, { isActive: false });

    res.redirect("/admin/users");
  } catch (e) {
    res.redirect("/error");
  }
}
async function activateUser(req, res) {
  const { userId } = req.params;

  try {
    await User.findByIdAndUpdate(userId, { isActive: true });

    res.redirect("/admin/users");
  } catch (e) {
    res.redirect("/error");
  }
}

async function deleteUser(req, res) {
  const { userId } = req.params;
  let user = await User.findById(userId);
  try {
    await user.remove();
    res.redirect("/admin/users");
  } catch (e) {
    res.redirect("/error");
  }
}

exports.AllUsers = AllUsers;
exports.createUser = createUser;
exports.showUser = showUser;
exports.editUser = editUser;

// Apis
exports.newUser = newUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.activateUser = activateUser;
exports.deactivateUser = deactivateUser;
