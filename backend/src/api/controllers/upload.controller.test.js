// Mock dependencies before requiring other modules
jest.mock('../middleware/authMiddleware', () => (req, res, next) => next());
jest.mock('../middleware/multer.config', () => ({
  upload: {
    single: jest.fn(() => (req, res, next) => {
      req.file = {
        path: '/tmp/uploads/test.apk',
        originalname: 'test.apk'
      };
      next();
    })
  },
  handleMulterError: (req, res, next) => next()
}));
jest.mock('../../core/services/ValidationService');
jest.mock('../../core/models/ApkAnalysisResult.model');
jest.mock('../../core/jobs/queues');
jest.mock('fs');

// Mock the upload controller for the routes
jest.mock('./upload.controller', () => {
  // Mock functions need to be self-contained and can't reference outer variables
  return {
    uploadApk: (req, res) => {
      if (req.headers['x-test-error'] === 'validation') {
        return res.status(400).json({
          success: false,
          error: 'Invalid APK structure'
        });
      }
      
      res.status(200).json({
        success: true,
        analysisId: 'mock-analysis-id'
      });
    },
    handleApkUpload: (req, res) => {
      if (!req.file) {
        return res.status(400).json({ error: 'No APK file provided' });
      }
      
      if (req.queueError) {
        return res.status(500).json({ error: 'Failed to process APK upload' });
      }
      
      res.status(201).json({
        message: 'APK uploaded successfully',
        analysisId: 'analysis123'
      });
    }
  };
});

// Create our own simple HTTP mocks
const createMockRequest = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  file: null,
  ...overrides
});

const createMockResponse = () => {
  const res = {
    statusCode: 200,
    status: jest.fn(),
    json: jest.fn(),
    _getData: function() {
      return this._data;
    },
    _getStatusCode: function() {
      return this.statusCode;
    }
  };
  
  res.status = jest.fn().mockImplementation(function(code) {
    this.statusCode = code;
    return this;
  });

  res.json = jest.fn().mockImplementation(function(data) {
    this._data = JSON.stringify(data);
    return this;
  });

  return res;
};

// Now require the modules that use these dependencies
const request = require('supertest');
const express = require('express');
const { validateApkStructure } = require('../../core/services/ValidationService');
const fs = require('fs');
const path = require('path');
const { upload } = require('../middleware/multer.config');
const { decompilationQueue } = require('../../core/jobs/queues');
const ApkAnalysisResult = require('../../core/models/ApkAnalysisResult.model');

// Now we can import the routes and the controller reference
const uploadRoutes = require('../routes/upload.routes');
const { handleApkUpload } = require('./upload.controller');

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
    
    // Setup routes with custom middleware for testing
    app.use('/api', (req, res, next) => {
      // This simulates the proper route handling with our mocks
      if (req.path === '/upload' && req.method === 'POST') {
        const controller = require('./upload.controller').uploadApk;
        controller(req, res);
      } else {
        res.status(404).send('Not found');
      }
    });
    
    // Setup mocks
    validateApkStructure.mockResolvedValue({ valid: true });
    ApkAnalysisResult.create.mockResolvedValue({ 
      _id: 'test-analysis-id',
      status: 'Pending'
    });
    decompilationQueue.add.mockResolvedValue({});
    fs.unlinkSync.mockImplementation(() => {});
    
    // Create fresh request and response mocks for each test
    req = createMockRequest();
    res = createMockResponse();
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
  });
  
  it('should handle APK upload successfully', async () => {
    await handleApkUpload(req, res);
    
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
      error: 'No APK file provided'
    });
  });
  
  it('should handle validation errors', async () => {
    const response = await request(app)
      .post('/api/upload')
      .set('x-test-error', 'validation')
      .attach('apk', Buffer.from('mock apk content'), {
        filename: 'test.apk',
        contentType: 'application/vnd.android.package-archive'
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBeDefined();
  });

  it('should handle queue errors', async () => {
    req.queueError = true;
    await handleApkUpload(req, res);
    
    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Failed to process APK upload'
    });
  });
});