// Mock for @react-navigation/native
const reactNavigation = {
  NavigationContainer: ({ children }) => children,
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
    dispatch: jest.fn()
  })),
  useFocusEffect: jest.fn(),
  useRoute: jest.fn(() => ({ params: {} })),
  useIsFocused: jest.fn(() => true),
  createNavigatorFactory: jest.fn(Component => props => Component),
  DefaultTheme: {
    dark: false,
    colors: {
      primary: '#0000FF',
      background: '#FFFFFF',
      card: '#FFFFFF',
      text: '#000000',
      border: '#D3D3D3',
      notification: '#FF0000'
    }
  }
};

module.exports = reactNavigation;