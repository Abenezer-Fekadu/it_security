// Models
const { Roles, validateRoles } = require("../../models/roles");
const { Permissions } = require("../../models/permissions");
// Views
async function AllRoles(req, res) {
  let roles = await Roles.find()
    .populate("permissions")
    .select("title role permissions");

  res.render("admin/role/index", {
    extractScripts: true,
    layout: "../views/layouts/admin",
    roles,
  });
}

async function createRole(req, res) {
  let permissions = await Permissions.find();

  res.render("admin/role/create", {
    extractScripts: true,
    layout: "../views/layouts/admin",
    role: new Roles(),
    permissions,
    errors: {},
  });
}

async function editRole(req, res) {
  const { roleId } = req.params;

  let permissions = await Permissions.find();
  const role = await Roles.findById(roleId).populate("permissions");

  res.render("admin/role/edit", {
    extractScripts: true,
    layout: "../views/layouts/admin",
    permissions,
    role,
    errors: {},
  });
}

async function showRole(req, res) {
  const { roleId } = req.params;

  const role = await Roles.findById(roleId).populate("permissions");

  if (!role) {
    res.redirect("/admin/roles");
  }

  res.render("admin/role/show", {
    extractScripts: true,
    layout: "../views/layouts/admin",
    role,
  });
}

// Apis
async function newRole(req, res) {
  if (!Array.isArray(req.body.permissions)) {
    req.body.permissions = [req.body.permissions];
  }

  const messages = validateRoles(req.body);
  let permissions = await Permissions.find();

  if (messages)
    return res.render("admin/role/create", {
      extractScripts: true,
      layout: "../views/layouts/admin",
      permissions,
      role: req.body,
      errors: messages,
    });

  try {
    let role = await Roles.findOne({ title: req.body.title });

    if (role)
      return res.render("admin/role/create", {
        extractScripts: true,
        layout: "../views/layouts/admin",
        role: req.body,
        permissions,
        errors: { title: "Role Already Exists" },
      });

    role = new Roles(req.body);
    role = await role.save();

    res.redirect(`/admin/roles/show/${role.id}`);
  } catch (e) {
    console.log(e);
    res.render("/error");
  }
}

async function updateRole(req, res) {
  if (!Array.isArray(req.body.permissions)) {
    req.body.permissions = [req.body.permissions];
  }

  const { roleId } = req.params;
  const messages = validateRoles(req.body);

  let permissions = await Permissions.find();

  let rl = await Roles.findById(roleId);
  if (messages)
    res.render("admin/role/edit", {
      extractScripts: true,
      layout: "../views/layouts/admin",
      permissions,
      role: rl,
      errors: messages,
    });

  try {
    const role = await Roles.findOneAndUpdate({ _id: roleId }, req.body, {
      new: true,
    });
    if (!role) {
      res.redirect(`/admin/roles/edit/${roleId}`);
    }

    res.redirect(`/admin/roles/show/${role.id}`);
  } catch (e) {
    res.redirect("/error");
  }
}

async function deleteRole(req, res) {
  const { roleId } = req.params;
  let role = await Roles.findById(roleId);

  try {
    await role.remove();
    res.redirect("/admin/roles");
  } catch (e) {
    res.redirect("/error");
  }
}

exports.AllRoles = AllRoles;
exports.createRole = createRole;
exports.showRole = showRole;
exports.editRole = editRole;

// Apis
exports.newRole = newRole;
exports.updateRole = updateRole;
exports.deleteRole = deleteRole;
