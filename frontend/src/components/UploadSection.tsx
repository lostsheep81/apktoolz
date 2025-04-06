import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import * as Progress from 'react-native-progress';
import { useAnalysisStore } from '../store/analysisStore';

interface UploadSectionProps {
  onUploadComplete: (fileInfo: DocumentPickerResponse) => Promise<void>;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onUploadComplete }) => {
  const { isUploading, uploadProgress } = useAnalysisStore();

  const handleFilePick = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: ['application/vnd.android.package-archive'],
        allowMultiSelection: false,
      });

      if (results.length > 0) {
        await onUploadComplete(results[0]);
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        useAnalysisStore.getState().setError('Failed to select file');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analyze Your APK File</Text>
        <Text style={styles.subtitle}>
          Upload your Android APK file to get AI-powered analysis, security checks, and optimization suggestions.
        </Text>
      </View>

      {isUploading ? (
        <View style={styles.progressContainer}>
          <Text style={styles.uploadingText}>Uploading...</Text>
          <Progress.Bar 
            progress={uploadProgress}
            width={200}
            color="#3B82F6"
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>{Math.round(uploadProgress * 100)}%</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.uploadArea} onPress={handleFilePick}>
          <Icon name="cloud-upload" size={48} color="#3B82F6" />
          <Text style={styles.uploadText}>Select your APK file</Text>
          <View style={styles.browseButton}>
            <Icon name="folder-open" size={16} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Browse Files</Text>
          </View>
          <Text style={styles.sizeLimit}>Maximum file size: 200MB</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: '80%',
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 48,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  uploadText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 16,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sizeLimit: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressContainer: {
    alignItems: 'center',
    padding: 32,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  uploadingText: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 16,
  },
  progressBar: {
    marginVertical: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
});

export default UploadSection;