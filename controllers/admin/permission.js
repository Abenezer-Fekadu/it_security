// Models
const {
  Permissions,
  validatePermissions,
} = require("../../models/permissions");
// Views
async function AllPermissions(req, res) {
  let permissions = await Permissions.find();

  res.render("admin/permission/index", {
    extractScripts: true,
    layout: "../views/layouts/admin",
    permissions,
  });
}

async function createPermission(req, res) {
  res.render("admin/permission/create", {
    extractScripts: true,
    layout: "../views/layouts/admin",
    permission: new Permissions(),
    errors: {},
  });
}
async function editPermission(req, res) {
  const { permissionId } = req.params;
  const permission = await Permissions.findById(permissionId);

  res.render("admin/permission/edit", {
    extractScripts: true,
    layout: "../views/layouts/admin",
    permission,
    errors: {},
  });
}
async function showPermission(req, res) {
  const { permissionId } = req.params;
  const permission = await Permissions.findById(permissionId);

  res.render("admin/permission/show", {
    extractScripts: true,
    layout: "../views/layouts/admin",
    permission,
  });
}

// Apis
async function newPermission(req, res) {
  console.log(req.body);
  // Validate the Permission
  const messages = validatePermissions(req.body);
  console.log(messages);
  if (messages)
    return res.render("admin/permission/create", {
      extractScripts: true,
      layout: "../views/layouts/admin",
      permission: req.body,
      errors: messages,
    });

  try {
    let permission = await Permissions.findOne({ title: req.body.title });

    if (permission)
      return res.render("admin/permission/create", {
        extractScripts: true,
        layout: "../views/layouts/admin",

        permission: req.body,
        errors: { title: "Permission Already Exists" },
      });

    permission = new Permissions(req.body);
    permission = await permission.save();

    res.redirect(`/admin/permissions/show/${permission.id}`);
  } catch (e) {
    res.render("/error");
  }
}

async function updatePermission(req, res) {
  const messages = validatePermissions(req.body);
  const { permissionId } = req.params;

  if (messages)
    return res.render(`/admin/permission/edit/${permission.id}`, {
      extractScripts: true,
      layout: "../views/layouts/admin",
      errors: messages,
    });

  try {
    const permission = await Permissions.findOneAndUpdate(
      { _id: permissionId },
      req.body,
      {
        new: true,
      }
    );

    if (!permission) {
      res.redirect(`/admin/permissions/edit/${permissionId}`);
    }

    res.redirect(`/admin/permissions/show/${permission.id}`);
  } catch (e) {
    res.redirect("/error");
  }
}

async function deletePermission(req, res) {
  const { permissionId } = req.params;

  try {
    let permission = await Permissions.findById(permissionId);
    await permission.remove();

    res.redirect("/admin/permissions");
  } catch (e) {
    res.redirect("/error");
  }
}

exports.AllPermissions = AllPermissions;
exports.createPermission = createPermission;
exports.showPermission = showPermission;
exports.editPermission = editPermission;

// Apis
exports.newPermission = newPermission;
exports.updatePermission = updatePermission;
exports.deletePermission = deletePermission;
