// Mock for React Native
const reactNative = jest.createMockFromModule('react-native');

// Add any specific implementations needed
reactNative.NativeModules = {
  // Add any native modules that your tests need
  StatusBarManager: { height: 20 },
  RNGestureHandlerModule: {
    attachGestureHandler: jest.fn(),
    createGestureHandler: jest.fn(),
    dropGestureHandler: jest.fn(),
    updateGestureHandler: jest.fn(),
    State: {},
    Directions: {}
  }
};

// Mock the Platform API
reactNative.Platform = {
  OS: 'ios',
  select: jest.fn(obj => obj.ios),
  Version: 123,
  isTesting: true
};

// Mock the Dimensions API
reactNative.Dimensions = {
  get: jest.fn(() => ({ width: 375, height: 812 })),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  removeEventListener: jest.fn()
};

// Mock the Animated API
reactNative.Animated = {
  Value: jest.fn(() => ({
    setValue: jest.fn(),
    interpolate: jest.fn(() => ({
      __getValue: jest.fn(() => 0),
    })),
    addListener: jest.fn(),
    removeListener: jest.fn()
  })),
  View: 'Animated.View',
  Text: 'Animated.Text',
  Image: 'Animated.Image',
  createAnimatedComponent: jest.fn(component => component),
  timing: jest.fn(() => ({
    start: jest.fn(cb => cb && cb({ finished: true })),
  })),
  spring: jest.fn(() => ({
    start: jest.fn(cb => cb && cb({ finished: true })),
  })),
  parallel: jest.fn(() => ({
    start: jest.fn(cb => cb && cb({ finished: true })),
  }))
};

// Add StyleSheet implementation
reactNative.StyleSheet = {
  create: styles => styles,
  hairlineWidth: 1,
  flatten: jest.fn(style => style),
  compose: jest.fn((style1, style2) => ({ ...style1, ...style2 })),
  absoluteFill: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }
};

// Add Alert implementation
reactNative.Alert = {
  alert: jest.fn()
};

// Add basic component mocks
reactNative.View = 'View';
reactNative.Text = 'Text';
reactNative.Image = 'Image';
reactNative.ScrollView = 'ScrollView';
reactNative.TouchableOpacity = 'TouchableOpacity';
reactNative.TouchableHighlight = 'TouchableHighlight';
reactNative.TouchableWithoutFeedback = 'TouchableWithoutFeedback';
reactNative.TextInput = 'TextInput';
reactNative.Button = 'Button';
reactNative.SafeAreaView = 'SafeAreaView';
reactNative.FlatList = jest.fn(props => props.data.map(props.renderItem));
reactNative.SectionList = jest.fn(props => props.sections.map(section => section.data.map(props.renderItem)));
reactNative.ActivityIndicator = 'ActivityIndicator';

module.exports = reactNative;