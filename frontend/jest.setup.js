// Jest setup for React component testing
import '@testing-library/jest-dom';

// Import VSCode extension test shim
import './__mocks__/vscode-test-shim';

// The following modules are mocked via the __mocks__ directory:
// - react-native
// - react-native-gesture-handler
// - canvas
// - @react-native-async-storage/async-storage

// Add global fetch mock if your app uses fetch
global.fetch = jest.fn(() => 
  Promise.resolve({
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    ok: true,
  })
);

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});