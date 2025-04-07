// Renaming this file to jest.config.cjs to resolve the ReferenceError issue.
const baseConfig = require('../jest.config.base');

module.exports = {
  ...baseConfig,
  
  // Backend-specific settings
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/api/app.js',           // Exclude main server entry
    '!src/config/**/*.js',        // Exclude configuration files
    '!src/core/jobs/queues.js',   // Exclude job queues
    '!src/worker/worker.js',      // Exclude worker entry point
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/coverage/**',
    '!jest.config.js',
    '!jest.setup.js',
  ],
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/coverage/'],
  resetMocks: true,
  restoreMocks: true,
  moduleNameMapper: {},
  transformIgnorePatterns: ['/node_modules/', '\\.pnp\\.[^\\/]+$'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  testTimeout: 15000,
  detectOpenHandles: true,
};
