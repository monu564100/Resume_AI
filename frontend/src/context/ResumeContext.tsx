import React, { useEffect, useState, createContext, useContext } from 'react';
import axios from 'axios';
import { demoResumeData } from '../utils/demoData';
interface ResumeContextType {
  resumeData: any;
  isLoading: boolean;
  error: string | null;
  uploadResume: (file?: File | null, text?: string) => Promise<void>;
  parseResume: () => Promise<void>;
  clearResume: () => void;
  isDemoMode: boolean;
}
const ResumeContext = createContext<ResumeContextType | undefined>(undefined);
export const ResumeProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [resumeData, setResumeData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const API_URL = 'http://localhost:5000/api';
  useEffect(() => {
    // Check if URL has demo parameter
    const urlParams = new URLSearchParams(window.location.search);
    const demoParam = urlParams.get('demo');
    setIsDemoMode(demoParam === 'true');
    // If demo mode, load demo data
    if (demoParam === 'true') {
      setResumeData(demoResumeData);
    }
  }, []);
  const uploadResume = async (file?: File | null, text?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isDemoMode) {
        await new Promise(r => setTimeout(r, 800));
        setResumeData(demoResumeData);
        return;
      }

      const token = localStorage.getItem('token') || 'dummy-token';
      
      let response;
      
      if (file) {
        // File upload
        const form = new FormData();
        form.append('file', file);
        response = await axios.post(`${API_URL}/analyze-resume`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else if (text) {
        // Text input
        response = await axios.post(`${API_URL}/analyze-resume`, 
          { text }, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        throw new Error('No file or text provided');
      }

      console.log('Analysis response:', response.data);
      setResumeData(response.data.data);
    } catch (err: any) {
      console.error('Upload error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error analyzing resume';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const parseResume = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (isDemoMode) {
        await new Promise(r => setTimeout(r, 800));
        setResumeData(demoResumeData);
        return;
      }
      const token = localStorage.getItem('token');
      if (resumeData?.text) {
        const res = await axios.post(`${API_URL}/analyze-resume`, { text: resumeData.text }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResumeData(res.data.data);
      } else {
        setError('No resume text to analyze');
      }
    } catch (err) {
      console.error(err);
      setError('Error analyzing resume');
    } finally {
      setIsLoading(false);
    }
  };
  const clearResume = () => {
    setResumeData(null);
    setError(null);
  };
  return <ResumeContext.Provider value={{
    resumeData,
    isLoading,
    error,
    uploadResume,
    parseResume,
    clearResume,
    isDemoMode
  }}>
      {children}
    </ResumeContext.Provider>;
};
export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};