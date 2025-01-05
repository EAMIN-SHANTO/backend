import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { 
  getResources, 
  createResource, 
  deleteResource,
  updateDownloadCount,
  updateResource
} from '../controllers/resource.controller.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { checkRole } from '../middleware/role.js';
import Resource from '../models/resource.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'resources');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate('user', 'username email')
      .sort({ createdAt: -1 });
    console.log('Resources with users:', resources); // For debugging
    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', verifyToken, upload.single('img'), createResource);
router.delete('/:id', verifyToken, deleteResource);
router.put('/:id', verifyToken, updateResource);
router.put('/:id/download', updateDownloadCount);

export default router; 