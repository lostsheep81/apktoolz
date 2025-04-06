const fs = require('fs');
const path = require('path');
const crypto = require('crypto'); // Added missing import
const { v4: uuidv4 } = require('uuid');
const { validateApkStructure } = require('../../core/services/ValidationService');
const logger = require('../../config/logger');
const { decompilationQueue } = require('../../core/jobs/queues');
const ApkAnalysisResult = require('../../core/models/ApkAnalysisResult.model');

// Mock user authentication for now
const getAuthenticatedUser = (req) => {
  return req.user || { id: 'mock-user-id' }; // Replace with actual authentication logic
};

exports.uploadApk = async (req, res) => {
  try {
    const user = getAuthenticatedUser(req);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_FILE_UPLOADED',
          message: 'No file was uploaded.'
        }
      });
    }

    const uniqueId = uuidv4();
    const filePath = path.resolve(req.file.path);
    const originalName = req.file.originalname;

    try {
      const validation = await validateApkStructure(filePath);
      if (!validation.isValid) {
        // Clean up invalid file
        fs.unlinkSync(filePath);
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: validation.reason
          }
        });
      }
    } catch (validationError) {
      // Clean up file if validation throws an error
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validationError.reason
        }
      });
    }

    // Calculate APK hash for deduplication
    const apkHash = crypto.createHash('sha256')
      .update(fs.readFileSync(filePath))
      .digest('hex');

    // Create analysis record
    const analysis = await ApkAnalysisResult.create({
      userId: user.id,
      apkName: originalName,
      apkHash,
      status: 'Queued'
    });

    // Queue the decompilation job
    await decompilationQueue.add('decompile', {
      analysisId: analysis._id,
      filePath,
    }, {
      removeOnComplete: true,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000
      }
    });

    // Simulate saving file metadata to the database
    const fileMetadata = {
      id: uniqueId,
      userId: user.id,
      filePath,
      originalName,
      uploadedAt: new Date()
    };

    // Log metadata (replace with actual DB save logic)
    console.log('File metadata saved:', fileMetadata);

    res.status(200).json({
      success: true,
      data: {
        message: 'File uploaded and queued for analysis.',
        analysisId: analysis._id,
        fileId: uniqueId
      }
    });
  } catch (error) {
    logger.error('Error processing upload:', error);
    
    // Clean up file if exists
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        logger.error('Error cleaning up file:', cleanupError);
      }
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while processing the upload.'
      }
    });
  }
};
