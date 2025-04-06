const request = require('supertest');
const express = require('express');
const { validateApkStructure } = require('../../core/services/ValidationService');
const fs = require('fs');
const uploadRoutes = require('../routes/upload.routes');
const httpMocks = require('node-mocks-http');
const path = require('path');
const { upload } = require('../middleware/multer.config');
const { handleApkUpload } = require('./upload.controller');
const { decompilationQueue } = require('../../core/jobs/queues');
const ApkAnalysisResult = require('../../core/models/ApkAnalysisResult.model');

// Mock dependencies
jest.mock('../../core/services/ValidationService');
jest.mock('../../core/models/ApkAnalysisResult.model');
jest.mock('../../core/jobs/queues');
jest.mock('fs');
jest.mock('../middleware/multer.config', () => ({
  upload: {
    single: jest.fn(() => (req, res, next) => {
      req.file = {
        path: '/tmp/uploads/test.apk',
        originalname: 'test.apk'
      };
      next();
    })
  }
}));

describe('Upload Controller', () => {
  let app;
  let req, res;
  const mockFile = {
    filename: 'test.apk',
    path: '/tmp/uploads/test.apk',
    mimetype: 'application/vnd.android.package-archive'
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Create fresh Express app for each test
    app = express();
    app.use(express.json());

    // Setup route
    app.use('/api', uploadRoutes);

    // Setup mocks
    validateApkStructure.mockResolvedValue({ valid: true });
    ApkAnalysisResult.create.mockResolvedValue({ 
      _id: 'test-analysis-id',
      status: 'Pending'
    });
    decompilationQueue.add.mockResolvedValue({});
    fs.unlinkSync.mockImplementation(() => {});

    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    req.file = mockFile;
    
    // Mock queue and model
    decompilationQueue.add.mockResolvedValue({ id: 'job123' });
    ApkAnalysisResult.create.mockResolvedValue({ 
      _id: 'analysis123',
      save: jest.fn().mockResolvedValue(true)
    });

    // Mock file system
    fs.existsSync.mockReturnValue(true);
  });

  it('should upload APK and create analysis', async () => {
    const response = await request(app)
      .post('/api/upload')
      .attach('apk', Buffer.from('mock apk content'), {
        filename: 'test.apk',
        contentType: 'application/vnd.android.package-archive'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.analysisId).toBeDefined();
    
    expect(ApkAnalysisResult.create).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'Pending',
        filename: 'test.apk'
      })
    );

    expect(decompilationQueue.add).toHaveBeenCalledWith(
      expect.objectContaining({
        analysisId: expect.any(String),
        filePath: expect.any(String)
      })
    );
  });

  it('should handle validation errors', async () => {
    validateApkStructure.mockResolvedValue({ 
      valid: false, 
      error: 'Invalid APK structure' 
    });

    const response = await request(app)
      .post('/api/upload')
      .attach('apk', Buffer.from('mock apk content'), {
        filename: 'test.apk',
        contentType: 'application/vnd.android.package-archive'
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBeDefined();
    expect(fs.unlinkSync).toHaveBeenCalledWith(expect.any(String));
    expect(ApkAnalysisResult.create).not.toHaveBeenCalled();
    expect(decompilationQueue.add).not.toHaveBeenCalled();
  });

  it('should handle missing file', async () => {
    // Override multer mock for this test to simulate missing file
    upload.single.mockImplementationOnce(() => (req, res, next) => {
      const error = new Error('Missing file');
      error.code = 'LIMIT_UNEXPECTED_FILE';
      next(error);
    });

    const response = await request(app)
      .post('/api/upload');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toMatch(/file/i);
  });

  it('should handle APK upload successfully', async () => {
    await handleApkUpload(req, res);

    expect(ApkAnalysisResult.create).toHaveBeenCalledWith({
      originalFilename: mockFile.filename,
      filePath: mockFile.path,
      mimeType: mockFile.mimetype,
      status: 'Uploaded'
    });

    expect(decompilationQueue.add).toHaveBeenCalledWith(
      'analyze',
      expect.objectContaining({
        analysisId: 'analysis123',
        filePath: mockFile.path
      })
    );

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'APK uploaded successfully',
      analysisId: 'analysis123'
    });
  });

  it('should handle missing file error', async () => {
    req.file = undefined;
    await handleApkUpload(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'No file uploaded'
    });
  });

  it('should handle queue error', async () => {
    const error = new Error('Queue error');
    decompilationQueue.add.mockRejectedValueOnce(error);

    await handleApkUpload(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Failed to process APK upload'
    });
  });

  it('should handle file upload successfully', async () => {
    await handleApkUpload(req, res);

    expect(ApkAnalysisResult.create).toHaveBeenCalledWith({
      originalFileName: 'test.apk',
      filePath: '/tmp/uploads/test.apk',
      status: 'Pending'
    });

    expect(decompilationQueue.add).toHaveBeenCalledWith('decompile-apk', {
      analysisId: 'test-analysis-id',
      filePath: '/tmp/uploads/test.apk'
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'APK file uploaded successfully',
      analysisId: 'test-analysis-id'
    });
  });

  it('should handle errors during file upload', async () => {
    const error = new Error('Database error');
    ApkAnalysisResult.create.mockRejectedValue(error);

    await handleApkUpload(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error processing APK upload',
      details: error.message
    });
  });

  it('should handle missing file in request', async () => {
    req.file = undefined;

    await handleApkUpload(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'No APK file provided'
    });
  });
});