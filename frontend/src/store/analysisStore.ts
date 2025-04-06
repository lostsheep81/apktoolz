import create from 'zustand';
import { UploadResponse } from '../screens/UploadScreen';

interface AnalysisState {
  currentAnalysis: UploadResponse | null;
  uploadProgress: number;
  isUploading: boolean;
  error: string | null;
  setAnalysis: (analysis: UploadResponse | null) => void;
  setUploadProgress: (progress: number) => void;
  setIsUploading: (isUploading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  currentAnalysis: null,
  uploadProgress: 0,
  isUploading: false,
  error: null,
  setAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setError: (error) => set({ error }),
}));