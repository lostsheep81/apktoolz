// Mock for @react-navigation/native-stack
const nativeStack = {
  createNativeStackNavigator: jest.fn(() => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children
  }))
};

module.exports = nativeStack;