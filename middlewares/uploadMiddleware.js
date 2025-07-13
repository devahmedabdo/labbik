// middlewares/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.fieldname + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const isAllowed = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (isAllowed) {
    cb(null, true);
  } else {
    cb(new Error({message:'صيغة الصورة غير مدعومه'}));
  }
};
const deleteLocalFile = (url) => {
  try {
    if(!url) return
    const filename = url?.split("/uploads/")[1];
    if (filename) {
      const filePath = path.join(__dirname, "../uploads", filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error({message:'خطأ اثناء حذف الصوره القديمة'});
  }
};

const upload = multer({
  storage,
  fileFilter
});

module.exports = {upload,deleteLocalFile};