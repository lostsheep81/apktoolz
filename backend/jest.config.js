module.exports = {
  // Specifies the test environment
  testEnvironment: 'node',

  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
      'src/**/*.js',
      '!src/api/app.js', // Exclude main server entry point if not testable directly
      '!src/config/**/*.js', // Exclude config files
      '!src/core/jobs/queues.js', // May be harder to unit test directly if it connects immediately
      '!src/worker/worker.js', // Exclude worker entry point
      '!**/node_modules/**',
      '!**/vendor/**',
      '!**/coverage/**',
      '!jest.config.js',
      '!jest.setup.js',
  ],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8', // or 'babel'

  // A list of paths to modules that run some code to configure or set up the testing framework before each test file in the suite is executed
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // The root directory that Jest should scan for tests and modules within
  roots: ['<rootDir>/src'],

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: [
      '/node_modules/',
      '/coverage/'
  ],

  // This option allows use of a custom resolver
  // resolver: undefined,

  // Automatically reset mock state before every test
  resetMocks: true, // Consider using this instead of clearMocks for better isolation

  // Automatically restore mock state and implementation before every test
  restoreMocks: true, // Ensures mocks don't leak between tests

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    // Example: mapping aliases if you use them
    // '^@/(.*)$': '<rootDir>/src/$1',
  },

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: ['/node_modules/', '\\.pnp\\.[^\\/]+$'],

  // Use babel-jest to transform js/jsx files
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Ensure babel-jest is installed and configured
  },

  // Increase timeout for potentially long-running tests (e.g., involving I/O mocks)
  testTimeout: 15000, // 15 seconds

  // Detect open handles that prevent Jest from exiting gracefully
  detectOpenHandles: true, // Helps identify leaks

  // Force exit after tests completed (use with caution, prefer fixing leaks)
  // forceExit: true,
};
