import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageLayout } from '../components/layout/PageLayout';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { ResumeUploader } from '../components/ResumeUploader';
import { DynamicIsland } from '../components/DynamicIsland';
import { Button } from '../components/ui/Button';
import { useResume } from '../context/ResumeContext';
import { 
  CheckCircleIcon, 
  ArrowRightIcon,
  SparklesIcon,
  FileTextIcon,
  BrainIcon,
  TargetIcon,
  TrendingUpIcon
} from 'lucide-react';

const UploadAnalyze: React.FC = () => {
  const navigate = useNavigate();
  const { resumeData, isLoading, error, isDemoMode } = useResume();
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [islandSize, setIslandSize] = useState<'collapsed' | 'expanded'>('collapsed');
  const [analysisSteps, setAnalysisSteps] = useState<{
    extracting: boolean;
    analyzing: boolean;
    matching: boolean;
    completed: boolean;
  }>({
    extracting: false,
    analyzing: false,
    matching: false,
    completed: false
  });

  // Analysis features data
  const analysisFeatures = [
    {
      icon: <FileTextIcon size={24} className="text-primary" />,
      title: 'Smart Text Extraction',
      description: 'Advanced parsing of PDF, DOCX, and TXT formats with AI-powered structure recognition'
    },
    {
      icon: <BrainIcon size={24} className="text-emerald-400" />,
      title: 'AI-Powered Analysis',
      description: 'Machine learning algorithms analyze skills, experience, and career progression patterns'
    },
    {
      icon: <TargetIcon size={24} className="text-orange-400" />,
      title: 'Job Matching',
      description: 'Find relevant opportunities in the Indian job market based on your profile'
    },
    {
      icon: <TrendingUpIcon size={24} className="text-purple-400" />,
      title: 'ATS Optimization',
      description: 'Get insights on how to improve your resume for Applicant Tracking Systems'
    }
  ];

  useEffect(() => {
    if (isLoading) {
      setUploadStatus('loading');
      setStatusMessage('Processing your resume...');
      setIslandSize('expanded');
      
      // Simulate analysis steps
      const steps = [
        { key: 'extracting', message: 'Extracting text and analyzing structure...', duration: 2000 },
        { key: 'analyzing', message: 'AI analyzing skills and experience...', duration: 3000 },
        { key: 'matching', message: 'Finding job matches in Indian market...', duration: 2000 },
        { key: 'completed', message: 'Analysis complete!', duration: 1000 }
      ];

      let currentStep = 0;
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 90));
      }, 200);

      const stepInterval = setInterval(() => {
        if (currentStep < steps.length) {
          const step = steps[currentStep];
          setAnalysisSteps(prev => ({ ...prev, [step.key]: true }));
          setStatusMessage(step.message);
          currentStep++;
        } else {
          clearInterval(stepInterval);
          clearInterval(progressInterval);
        }
      }, 2000);

      return () => {
        clearInterval(progressInterval);
        clearInterval(stepInterval);
      };
    } else if (error) {
      setUploadStatus('error');
      setStatusMessage(error);
      setIslandSize('expanded');
      setProgress(0);
      setAnalysisSteps({ extracting: false, analyzing: false, matching: false, completed: false });
    } else if (resumeData) {
      setUploadStatus('success');
      setStatusMessage('Resume processed successfully!');
      setIslandSize('expanded');
      setProgress(100);
      setAnalysisSteps({ extracting: true, analyzing: true, matching: true, completed: true });
    }
  }, [isLoading, error, resumeData]);

  const handleViewResults = () => {
    navigate('/results');
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-dark-200 via-dark-100 to-dark-200">
        <Container className="py-8 lg:py-12">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <SparklesIcon size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">
                {isDemoMode ? 'Demo Mode' : 'AI-Powered Analysis'}
              </span>
            </motion.div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Upload & Analyze Your{' '}
              <span className="bg-gradient-to-r from-primary via-primary-400 to-secondary bg-clip-text text-transparent">
                Resume
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Get comprehensive insights about your resume with our advanced AI analysis. 
              Discover improvement opportunities and find matching job opportunities.
            </p>
          </motion.div>

          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <Card variant="glass" className="p-8 lg:p-12">
              <ResumeUploader />
            </Card>
          </motion.div>

          {/* Dynamic Island for Progress */}
          <AnimatePresence>
            {uploadStatus !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
              >
                <DynamicIsland
                  status={uploadStatus}
                  size={islandSize}
                  title={uploadStatus === 'loading' ? 'Processing' : uploadStatus === 'success' ? 'Success' : 'Error'}
                  message={statusMessage}
                  progress={progress}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analysis Steps */}
          {uploadStatus === 'loading' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-12"
            >
              <Card variant="glass" className="p-6 lg:p-8">
                <h3 className="text-xl font-bold text-white mb-6 text-center">
                  Analysis Progress
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { key: 'extracting', label: 'Text Extraction', icon: <FileTextIcon size={20} /> },
                    { key: 'analyzing', label: 'AI Analysis', icon: <BrainIcon size={20} /> },
                    { key: 'matching', label: 'Job Matching', icon: <TargetIcon size={20} /> },
                    { key: 'completed', label: 'Complete', icon: <CheckCircleIcon size={20} /> }
                  ].map((step) => (
                    <div
                      key={step.key}
                      className={`flex flex-col items-center p-4 rounded-lg transition-all duration-500 ${
                        analysisSteps[step.key as keyof typeof analysisSteps]
                          ? 'bg-primary/20 border border-primary/30'
                          : 'bg-gray-800/50 border border-gray-700'
                      }`}
                    >
                      <div
                        className={`p-3 rounded-full mb-3 transition-colors ${
                          analysisSteps[step.key as keyof typeof analysisSteps]
                            ? 'bg-primary/30 text-primary'
                            : 'bg-gray-700 text-gray-400'
                        }`}
                      >
                        {analysisSteps[step.key as keyof typeof analysisSteps] ? (
                          step.icon
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-current opacity-30" />
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          analysisSteps[step.key as keyof typeof analysisSteps]
                            ? 'text-white'
                            : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-white text-center mb-8">
              What You'll Get
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analysisFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <Card variant="glass" className="p-6 h-full text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-2xl bg-dark-100/50">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Success Actions */}
          {resumeData && uploadStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <Card variant="glass" className="p-8 lg:p-12">
                <div className="text-6xl mb-6">🎉</div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                  Analysis Complete!
                </h3>
                <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                  Your resume has been successfully analyzed. View your detailed results, 
                  improvement suggestions, and job matches.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleViewResults}
                    className="group flex items-center gap-2"
                  >
                    View Detailed Results
                    <ArrowRightIcon size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate('/careers')}
                    className="flex items-center gap-2"
                  >
                    Browse Matching Jobs
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </Container>
      </div>
    </PageLayout>
  );
};

export default UploadAnalyze;