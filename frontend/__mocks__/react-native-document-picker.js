// Mock for react-native-document-picker
const DocumentPicker = {
  pick: jest.fn(),
  pickSingle: jest.fn(),
  pickMultiple: jest.fn(),
  types: {
    allFiles: 'public.item',
    images: 'public.image',
    plainText: 'public.plain-text',
    audio: 'public.audio',
    pdf: 'com.adobe.pdf',
    zip: 'public.zip-archive',
    csv: 'public.comma-separated-values-text',
    apk: 'application/vnd.android.package-archive'
  },
  isCancel: jest.fn((err) => err.toString().toLowerCase().includes('cancel'))
};

// Set default implementation that can be overridden in tests
DocumentPicker.pick.mockImplementation(() => 
  Promise.resolve([{
    uri: 'file://mock.apk',
    name: 'mock.apk',
    type: 'application/vnd.android.package-archive',
    size: 10000
  }])
);

module.exports = DocumentPicker;