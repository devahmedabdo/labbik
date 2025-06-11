// middlewares/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Make sure upload folder exists
const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const isAllowed = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (isAllowed) {
    cb(null, true);
  } else {
    cb(new Error('Only jpeg, jpg, png, and pdf files are allowed!'));
  }
};

const upload = multer({
  storage,
  fileFilter
});

module.exports = upload;
