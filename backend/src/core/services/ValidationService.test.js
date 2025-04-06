const fs = require('fs');
const path = require('path');
const { validateApkStructure } = require('./ValidationService');

jest.mock('yauzl');
jest.mock('fs');
jest.mock('../../config/logger');

describe('validateApkStructure', () => {
  let mockZipfile;

  beforeEach(() => {
    jest.clearAllMocks();
    mockZipfile = {
      on: jest.fn(),
      readEntry: jest.fn()
    };
  });

  it('should return invalid if the file is not a valid ZIP', async () => {
    const yauzl = require('yauzl');
    yauzl.open.mockImplementation((path, options, callback) => {
      callback(new Error('Invalid ZIP file'));
    });
    fs.existsSync.mockReturnValue(true);

    await expect(validateApkStructure('invalid.zip')).rejects.toEqual({
      isValid: false,
      reason: 'INVALID_ZIP_STRUCTURE'
    });
  });

  it('should return invalid if AndroidManifest.xml is missing', async () => {
    const yauzl = require('yauzl');
    fs.existsSync.mockReturnValue(true);

    yauzl.open.mockImplementation((path, options, callback) => {
      callback(null, mockZipfile);

      // Simulate ZIP processing
      const entryHandler = mockZipfile.on.mock.calls.find(call => call[0] === 'entry')[1];
      const endHandler = mockZipfile.on.mock.calls.find(call => call[0] === 'end')[1];

      // Process a non-manifest file
      entryHandler({ fileName: 'other.xml' });
      // Signal end of ZIP
      endHandler();
    });

    const result = await validateApkStructure('test.apk');
    expect(result).toEqual({
      isValid: false,
      reason: 'MISSING_MANIFEST'
    });
  });

  it('should return valid if AndroidManifest.xml is present', async () => {
    const yauzl = require('yauzl');
    fs.existsSync.mockReturnValue(true);

    yauzl.open.mockImplementation((path, options, callback) => {
      callback(null, mockZipfile);

      // Simulate ZIP processing
      const entryHandler = mockZipfile.on.mock.calls.find(call => call[0] === 'entry')[1];
      const endHandler = mockZipfile.on.mock.calls.find(call => call[0] === 'end')[1];

      // Process manifest file
      entryHandler({ fileName: 'AndroidManifest.xml' });
      // Signal end of ZIP
      endHandler();
    });

    const result = await validateApkStructure('test.apk');
    expect(result).toEqual({ isValid: true });
  });

  it('should return FILE_NOT_FOUND if file does not exist', async () => {
    fs.existsSync.mockReturnValue(false);

    await expect(validateApkStructure('nonexistent.apk')).rejects.toEqual({
      isValid: false,
      reason: 'FILE_NOT_FOUND'
    });
  });

  it('should handle ZIP read errors', async () => {
    const yauzl = require('yauzl');
    fs.existsSync.mockReturnValue(true);

    yauzl.open.mockImplementation((path, options, callback) => {
      callback(null, mockZipfile);

      // Simulate ZIP error
      const errorHandler = mockZipfile.on.mock.calls.find(call => call[0] === 'error')[1];
      errorHandler(new Error('ZIP read error'));
    });

    await expect(validateApkStructure('corrupted.apk')).rejects.toEqual({
      isValid: false,
      reason: 'INVALID_ZIP_STRUCTURE'
    });
  });
});