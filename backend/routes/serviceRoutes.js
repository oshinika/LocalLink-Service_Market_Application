

import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import { 
  getAllServices, 
  createService, 
  updateService, 
  deleteService 
} from "../controllers/serviceController.js";

const router = express.Router();

// Setup multer storage
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

router.get("/", getAllServices);
router.post("/", upload.single("photo"), createService);
router.put("/:id", upload.single("photo"), updateService);
router.delete("/:id", deleteService);

export default router;