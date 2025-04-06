import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import UploadScreen from '../src/screens/UploadScreen';
import DocumentPicker from 'react-native-document-picker';

jest.mock('react-native-document-picker', () => ({
  pick: jest.fn(),
  types: { apk: 'application/vnd.android.package-archive' },
  isCancel: jest.fn((err) => err === 'canceled'),
}));

describe('UploadScreen', () => {
  it('should render the screen correctly', () => {
    const { getByText } = render(<UploadScreen />);

    expect(getByText('Select APK File')).toBeTruthy();
  });

  it('should handle file selection successfully', async () => {
    DocumentPicker.pick.mockResolvedValue({
      uri: 'file://test.apk',
      name: 'test.apk',
      size: 12345,
      type: 'application/vnd.android.package-archive',
    });

    const { getByText, queryByText } = render(<UploadScreen />);

    fireEvent.press(getByText('Select APK File'));

    await waitFor(() => {
      expect(getByText('File Name: test.apk')).toBeTruthy();
      expect(getByText('File Size: 12345 bytes')).toBeTruthy();
      expect(queryByText('Clear')).toBeTruthy();
    });
  });

  it('should handle file selection cancellation', async () => {
    DocumentPicker.pick.mockRejectedValue('canceled');

    const { getByText, queryByText } = render(<UploadScreen />);

    fireEvent.press(getByText('Select APK File'));

    await waitFor(() => {
      expect(queryByText('File Name:')).toBeNull();
      expect(getByText('File selection was canceled.')).toBeTruthy();
    });
  });

  it('should clear the selected file', async () => {
    DocumentPicker.pick.mockResolvedValue({
      uri: 'file://test.apk',
      name: 'test.apk',
      size: 12345,
      type: 'application/vnd.android.package-archive',
    });

    const { getByText, queryByText } = render(<UploadScreen />);

    fireEvent.press(getByText('Select APK File'));

    await waitFor(() => {
      expect(getByText('File Name: test.apk')).toBeTruthy();
    });

    fireEvent.press(getByText('Clear'));

    await waitFor(() => {
      expect(queryByText('File Name:')).toBeNull();
      expect(queryByText('Clear')).toBeNull();
    });
  });
});