// multer.js
import multer from "multer";
import os from "os";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, os.tmpdir()); // ✔ Use OS temp folder
  },
  filename: function (req, file, cb) {
    const uniqueName = file.originalname + "_" + Date.now();
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export default upload;
