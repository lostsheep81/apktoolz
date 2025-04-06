// Mock for react-native-keychain
const keychain = {
  SECURITY_LEVEL_ANY: 'SECURITY_LEVEL_ANY',
  SECURITY_LEVEL_SECURE_HARDWARE: 'SECURITY_LEVEL_SECURE_HARDWARE',
  SECURITY_LEVEL_SECURE_SOFTWARE: 'SECURITY_LEVEL_SECURE_SOFTWARE',
  ACCESS_CONTROL: {
    BIOMETRY_ANY: 'BIOMETRY_ANY',
    BIOMETRY_CURRENT_SET: 'BIOMETRY_CURRENT_SET',
    DEVICE_PASSCODE: 'DEVICE_PASSCODE',
    USER_PRESENCE: 'USER_PRESENCE',
    BIOMETRY_ANY_OR_DEVICE_PASSCODE: 'BIOMETRY_ANY_OR_DEVICE_PASSCODE',
    BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE: 'BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE',
  },
  AUTHENTICATION_TYPE: {
    DEVICE_PASSCODE_OR_BIOMETRICS: 'DEVICE_PASSCODE_OR_BIOMETRICS',
    BIOMETRICS: 'BIOMETRICS',
  },
  BIOMETRY_TYPE: {
    TOUCH_ID: 'TOUCH_ID',
    FACE_ID: 'FACE_ID',
    FINGERPRINT: 'FINGERPRINT',
    FACE: 'FACE',
    IRIS: 'IRIS',
  },
  ACCESSIBLE: {
    WHEN_UNLOCKED: 'AccessibleWhenUnlocked',
    AFTER_FIRST_UNLOCK: 'AccessibleAfterFirstUnlock',
    ALWAYS: 'AccessibleAlways',
    WHEN_PASSCODE_SET_THIS_DEVICE_ONLY: 'AccessibleWhenPasscodeSetThisDeviceOnly',
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'AccessibleWhenUnlockedThisDeviceOnly',
    AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: 'AccessibleAfterFirstUnlockThisDeviceOnly',
  },
  STORAGE_TYPE: {
    FB: 'FacebookConceal',
    KC: 'KeyChain',
    AES: 'KeyStoreAES',
  },

  // Mock functions
  setGenericPassword: jest.fn(() => Promise.resolve(true)),
  getGenericPassword: jest.fn(() => Promise.resolve({
    service: 'service',
    username: 'username',
    password: 'mock-token'
  })),
  resetGenericPassword: jest.fn(() => Promise.resolve(true)),
  setInternetCredentials: jest.fn(() => Promise.resolve(true)),
  getInternetCredentials: jest.fn(() => Promise.resolve(null)),
  resetInternetCredentials: jest.fn(() => Promise.resolve(true)),
  getSupportedBiometryType: jest.fn(() => Promise.resolve('FINGERPRINT')),
  canImplyAuthentication: jest.fn(() => Promise.resolve(true)),
  requestSharedWebCredentials: jest.fn(() => Promise.resolve(null)),
  setSharedWebCredentials: jest.fn(() => Promise.resolve(true))
};

module.exports = keychain;