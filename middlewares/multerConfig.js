const multer = require("multer");

const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./assets/images/profile");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    let ext = file.originalname.slice(file.originalname.lastIndexOf("."));
    cb(null, uniqueSuffix + "_" + ext);
  },
});

const profile = multer({ storage: profileStorage });

const profileUpload = profile.single("pfp");

module.exports = { profileUpload };
