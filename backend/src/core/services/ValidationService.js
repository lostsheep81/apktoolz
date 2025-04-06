const yauzl = require('yauzl');
const fs = require('fs');
const logger = require('../../config/logger');

const validateApkStructure = (filePath) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      return reject({ isValid: false, reason: 'FILE_NOT_FOUND' });
    }

    yauzl.open(filePath, { lazyEntries: true }, (err, zipfile) => {
      if (err) {
        logger.error({ error: err }, 'Error opening APK file');
        return reject({ isValid: false, reason: 'INVALID_ZIP_STRUCTURE' });
      }

      let hasManifest = false;
      
      zipfile.on('entry', (entry) => {
        if (entry.fileName === 'AndroidManifest.xml') {
          hasManifest = true;
        }
        zipfile.readEntry();
      });

      zipfile.on('end', () => {
        if (!hasManifest) {
          resolve({ isValid: false, reason: 'MISSING_MANIFEST' });
        } else {
          resolve({ isValid: true });
        }
      });

      zipfile.on('error', (error) => {
        logger.error({ error }, 'Error reading ZIP entries');
        reject({ isValid: false, reason: 'INVALID_ZIP_STRUCTURE' });
      });

      zipfile.readEntry();
    });
  });
};

module.exports = {
  validateApkStructure
};