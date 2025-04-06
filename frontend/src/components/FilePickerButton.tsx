import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import * as Progress from 'react-native-progress';
import { useAnalysisStore } from '../store/analysisStore';

interface FilePickerButtonProps {
  onFilePick: (fileInfo: DocumentPicker.DocumentResult) => void;
}

export const FilePickerButton: React.FC<FilePickerButtonProps> = ({ onFilePick }) => {
  const { isUploading, uploadProgress } = useAnalysisStore();

  const handleFilePick = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.apk],
      });
      onFilePick(res);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        useAnalysisStore.getState().setError('Failed to pick file');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, isUploading && styles.buttonDisabled]}
        onPress={handleFilePick}
        disabled={isUploading}
      >
        <Text style={styles.buttonText}>
          {isUploading ? 'Uploading...' : 'Select APK File'}
        </Text>
      </TouchableOpacity>
      {isUploading && (
        <Progress.Bar 
          progress={uploadProgress} 
          width={200}
          style={styles.progressBar}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  progressBar: {
    marginTop: 10,
  },
});