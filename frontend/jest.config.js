module.exports = {
  preset: 'react-native',
  
  // Use node instead of jsdom to avoid canvas dependency issues
  testEnvironment: 'node',
  
  // Set up transformers for various file types
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  
  // Handle non-JavaScript imports
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '^canvas$': '<rootDir>/__mocks__/canvas.js'
  },
  
  // Setup files that run before/after Jest is initialized
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // The pattern for finding test files
  testMatch: [
    '<rootDir>/__tests__/**/*.test.(js|jsx|ts|tsx)',
    '<rootDir>/src/**/?(*.)+(spec|test).(js|jsx|ts|tsx)'
  ],
  
  // Paths to modules that run code to configure the testing environment
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-gesture-handler)/)'
  ],
  
  // Add Mocha globals for VSCode extension tests
  globals: {
    "ts-jest": {
      babelConfig: true
    }
  },
  
  // Collect coverage information
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/coverage/**'
  ],
  coverageDirectory: 'coverage',
  
  // Automatically clear mock calls between every test
  clearMocks: true,
};
