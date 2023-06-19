const express = require("express");
const router = express.Router();
const upload = require("../utils/multerUtil");

// Controllers
const {
  AllPermissions,
  editPermission,
  createPermission,
  showPermission,

  newPermission,
  updatePermission,
  deletePermission,
} = require("../controllers/admin/permission");
const {
  AllRoles,
  editRole,
  createRole,
  showRole,

  newRole,
  updateRole,
  deleteRole,
} = require("../controllers/admin/role");

const {
  AllUsers,
  editUser,
  createUser,
  showUser,

  newUser,
  updateUser,
  deleteUser,
  deactivateUser,
  activateUser,
} = require("../controllers/admin/user");

const { home } = require("../controllers/admin/home");
const { isAdmin, isAuth } = require("../controllers/auth");
const {
  AllFeedbacks,
  showFeedBack,
  getFile,
} = require("../controllers/admin/feedback");

// Views
router.get("/", isAuth, home);
// Permission Views
router.get("/permissions", isAuth, isAdmin, AllPermissions);
router.get("/permissions/edit/:permissionId", isAuth, isAdmin, editPermission);
router.get("/permissions/create", isAuth, isAdmin, createPermission);
router.get("/permissions/show/:permissionId", isAuth, isAdmin, showPermission);
// Role Views
router.get("/roles", isAuth, isAdmin, AllRoles);
router.get("/roles/edit/:roleId", isAuth, isAdmin, editRole);
router.get("/roles/create", isAuth, isAdmin, createRole);
router.get("/roles/show/:roleId", isAuth, isAdmin, showRole);
// Users Views
router.get("/users", isAuth, isAdmin, AllUsers);
router.get("/users/edit/:userId", isAuth, isAdmin, editUser);
router.get("/users/create", isAuth, isAdmin, createUser);
router.get("/users/show/:userId", isAuth, isAdmin, showUser);
// Feedback Views
router.get("/feedbacks", isAuth, isAdmin, AllFeedbacks);
router.get("/feedbacks/view/:feedbackId", isAuth, isAdmin, showFeedBack);
router.get("/files/:filename", isAuth, getFile);

// API
// Api Permissions
router.post("/permissions", isAuth, isAdmin, newPermission);
router.put("/permissions/update/:permissionId", isAdmin, updatePermission);
router.delete("/permissions/delete/:permissionId", isAdmin, deletePermission);
// // Api Roles
router.post("/roles", isAuth, isAdmin, newRole);
router.put("/roles/update/:roleId", isAuth, isAdmin, updateRole);
router.delete("/roles/delete/:roleId", isAuth, isAdmin, deleteRole);
// Api Users
router.get("/users/activate/:userId", isAuth, isAdmin, activateUser);
router.get("/users/deactivate/:userId", isAuth, isAdmin, deactivateUser);
router.post("/users", isAuth, isAdmin, newUser);
router.put("/users/update/:userId", isAuth, isAdmin, updateUser);
router.delete("/users/delete/:userId", isAuth, isAdmin, deleteUser);

// Export
module.exports = router;
