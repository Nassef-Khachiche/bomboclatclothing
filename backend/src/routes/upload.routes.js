const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authRequired, adminRequired } = require("../middleware/auth");

const router = express.Router();

const uploadDir = path.resolve(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const upload = multer({ storage });

router.post("/", authRequired, adminRequired, upload.single("image"), (req, res) => {
  const fileUrl = `${process.env.API_BASE_URL || "http://localhost:5000"}/uploads/${req.file.filename}`;
  return res.status(201).json({ url: fileUrl });
});

module.exports = router;
