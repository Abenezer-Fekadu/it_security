const fs = require("fs");
const multer = require("multer");
// const util = require("util");

const uploadFolder = "./public/files/uploads";

const createFolder = function (folder) {
  try {
    fs.accessSync(folder);
  } catch (e) {
    fs.mkdirSync(folder);
  }
};

createFolder(uploadFolder);

storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".pdf");
  },
});
// Filter function to accept only PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true); // Accept the file
  } else {
    cb(null, false); // Reject the file
  }
};

module.exports = multer({ storage, fileFilter: fileFilter });

// var uploadFilesMiddleware = util.promisify(uploadFiles);
// module.exports = uploadFilesMiddleware;
