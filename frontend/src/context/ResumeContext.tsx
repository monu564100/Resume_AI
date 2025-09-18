import React, { useEffect, useState, createContext, useContext } from 'react';
import axios from 'axios';
import { demoResumeData } from '../utils/demoData';

// Narrow types used across the app (partial shapes accepted)
export interface Skill { name: string; level?: number; category?: string }
export interface RoleMatch { title: string; company?: string; matchScore?: number; keySkillMatches?: string[]; missingSkills?: string[]; salary?: string }
export interface AtsScoreBreakdown { skills?: number; experience?: number; education?: number; resumeQuality?: number; marketFit?: number; formatting?: number; keywords?: number }
export interface AtsScore { overall?: number; breakdown?: AtsScoreBreakdown }
export interface ImprovementSuggestion { category?: string; suggestion?: string; impact?: string; difficulty?: string; estimatedTime?: string }
export interface SkillGap { category?: string; missing?: string[]; recommendation?: string; priority?: string; estimatedLearningTime?: string }
export interface CourseSuggestion { skill?: string; title?: string; provider?: string; url?: string; duration?: string; level?: string; rating?: number; price?: string }
export interface CareerAnalysis { experienceLevel?: string; careerProgression?: string; industryFit?: string; salaryRange?: string; marketDemand?: string; competitiveAdvantage?: string; nextCareerSteps?: string[] }
export interface AnalysisData {
  analysisId?: string;
  fileName?: string;
  overallScore?: number; // duplicate of atsScore.overall for backward compatibility
  atsScore?: AtsScore;
  roleMatches?: RoleMatch[];
  jobMatches?: RoleMatch[]; // similar shape
  skillGaps?: (SkillGap | string)[];
  improvementSuggestions?: (ImprovementSuggestion | string)[];
  courseSuggestions?: CourseSuggestion[];
  careerAnalysis?: CareerAnalysis;
  overallFeedback?: string;
  skills?: Skill[];
  summary?: string;
  personalInfo?: Record<string, unknown>;
  [key: string]: unknown; // allow forward-compatible fields
}

interface HistoryEntry { _id: string; originalFileName: string; createdAt: string; atsScore?: { overall?: number } }
interface HistoryResponse { analyses: HistoryEntry[]; pagination: { page: number; limit: number; total: number; pages: number } }

interface ResumeContextType {
  resumeData: AnalysisData | null;
  isLoading: boolean;
  error: string | null;
  uploadResume: (file?: File | null, text?: string) => Promise<void>;
  parseResume: () => Promise<void>;
  clearResume: () => void;
  isDemoMode: boolean;
  loadAnalysis: (id: string) => Promise<void>;
  fetchHistory: (page?: number, limit?: number) => Promise<HistoryResponse | null>;
}
const ResumeContext = createContext<ResumeContextType | undefined>(undefined);
export const ResumeProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [resumeData, setResumeData] = useState<AnalysisData | null>(null);
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
      if (response.data?.data?._id) {
        localStorage.setItem('currentAnalysisId', response.data.data._id);
      }
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      console.error('Upload error:', e);
      const errorMessage = e.response?.data?.message || e.message || 'Error analyzing resume';
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
  const loadAnalysis = async (id: string) => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/analysis/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // API returns { success, data }
      if (res.data?.data) {
        setResumeData(res.data.data);
        if (res.data.data._id) {
          localStorage.setItem('currentAnalysisId', res.data.data._id);
        }
      } else {
        setError('Analysis not found');
      }
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      const message = e.response?.data?.message || e.message || 'Failed to load analysis';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchHistory = async (page = 1, limit = 10): Promise<HistoryResponse | null> => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/analysis/history?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data?.data as HistoryResponse;
    } catch (err) {
      console.error('Failed to fetch history', err);
      return null;
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
    isDemoMode,
    loadAnalysis,
    fetchHistory
  }}>
      {children}
    </ResumeContext.Provider>;
};
// eslint-disable-next-line
export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};