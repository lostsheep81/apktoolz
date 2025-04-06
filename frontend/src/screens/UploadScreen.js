import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAnalysisStore } from '../store/analysisStore';
import Header from '../components/Header';
import UploadSection from '../components/UploadSection';
import SummaryCard from '../components/SummaryCard';
import AnalysisDetails from '../components/AnalysisDetails';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

const UploadScreen = () => {
  const { 
    setUploadProgress, 
    setIsUploading, 
    setError, 
    setAnalysis, 
    currentAnalysis, 
    error 
  } = useAnalysisStore();
  
  const [showResults, setShowResults] = useState(false);

  const handleUploadComplete = async (fileInfo) => {
    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('apk', {
        uri: fileInfo.uri,
        type: fileInfo.type,
        name: fileInfo.name,
      });

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 0.99) {
            clearInterval(progressInterval);
            return 1;
          }
          return prev + 0.1;
        });
      }, 500);

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      setAnalysis(result);
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during upload');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleNewAnalysis = () => {
    setShowResults(false);
    setAnalysis(null);
    setError(null);
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {error && (
          <View style={styles.errorContainer}>
            <Icon name="exclamation-circle" size={20} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!showResults ? (
          <UploadSection onUploadComplete={handleUploadComplete} />
        ) : (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>Analysis Results</Text>
              <TouchableOpacity 
                style={styles.newAnalysisButton}
                onPress={handleNewAnalysis}
              >
                <Icon name="plus" size={16} color="#4B5563" />
                <Text style={styles.newAnalysisText}>New Analysis</Text>
              </TouchableOpacity>
            </View>
            <SummaryCard />
            <AnalysisDetails />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#991B1B',
    marginLeft: 8,
    fontSize: 14,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  newAnalysisButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  newAnalysisText: {
    marginLeft: 8,
    color: '#4B5563',
    fontWeight: '500',
  },
});

export default UploadScreen;