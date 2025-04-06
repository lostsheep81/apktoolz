const express = require('express');
const uploadController = require('../controllers/upload.controller');
const { upload, handleMulterError } = require('../middleware/multer.config');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Changed route from '/upload' to '/'
router.post('/', 
  authMiddleware, // Ensure the user is authenticated
  upload.single('apkFile'), // Middleware for handling single file upload with field name 'apkFile'
  handleMulterError, // Custom error handler for multer errors
  uploadController.uploadApk
);

module.exports = router;
