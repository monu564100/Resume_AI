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
      icon: <FileTextIcon size={22} />,
      title: 'Structured Extraction',
      description: 'Deterministic parsing isolates sections & semantic blocks for signal clarity.'
    },
    {
      icon: <BrainIcon size={22} />,
      title: 'Semantic Scoring',
      description: 'Layered analysis weights impact statements, depth & role alignment vectors.'
    },
    {
      icon: <TargetIcon size={22} />,
      title: 'Opportunity Mapping',
      description: 'Role similarity clustering surfaces actionable job alignment patterns.'
    },
    {
      icon: <TrendingUpIcon size={22} />,
      title: 'Optimization Signals',
      description: 'Density & coverage heuristics drive precise iteration priorities.'
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
      <div className="min-h-screen bg-white text-black">
        <Container className="py-12 lg:py-16">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <motion.div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-neutral-100 border border-neutral-300 mb-8" initial={{ opacity:0, scale:.85}} animate={{opacity:1, scale:1}} transition={{delay:.15}}>
              <SparklesIcon size={16} />
              <span className="text-xs font-semibold tracking-wider">{isDemoMode ? 'DEMO MODE' : 'ANALYSIS WORKBENCH'}</span>
            </motion.div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">Upload & Analyze Your Resume</h1>
            <p className="text-base md:text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">Ingest your document to generate structured intelligence: alignment scoring, opportunity mapping and iteration guidance—all inside a single neutral console.</p>
          </motion.div>

          {/* Upload Section */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.25}} className="mb-14">
            <Card variant="subtle" className="p-10 lg:p-14 relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{backgroundImage:'linear-gradient(#000 1px,transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px)',backgroundSize:'46px 46px'}} />
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
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.4}} className="mb-16">
              <Card variant="muted" className="p-8 lg:p-10">
                <h3 className="text-xl font-semibold mb-8 text-center tracking-tight">Analysis Progress</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {[
                    { key: 'extracting', label: 'Extraction', icon: <FileTextIcon size={18} /> },
                    { key: 'analyzing', label: 'Scoring', icon: <BrainIcon size={18} /> },
                    { key: 'matching', label: 'Matching', icon: <TargetIcon size={18} /> },
                    { key: 'completed', label: 'Complete', icon: <CheckCircleIcon size={18} /> }
                  ].map(step => {
                    const active = analysisSteps[step.key as keyof typeof analysisSteps];
                    return (
                      <div key={step.key} className={`flex flex-col items-center p-4 rounded-lg border text-center transition-all ${active ? 'bg-white border-neutral-300 shadow-sm' : 'bg-neutral-100 border-neutral-200'} `}>
                        <div className={`mb-3 p-2 rounded-md border ${active ? 'bg-black text-white border-black' : 'bg-white text-black border-neutral-300'}`}>{step.icon}</div>
                        <span className={`text-xs font-medium tracking-wide ${active ? 'text-black' : 'text-neutral-600'}`}>{step.label}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-8 h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-black transition-all" style={{width: `${progress}%`}} />
                </div>
              </Card>
            </motion.div>
          )}

          {/* Features Section */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.5}} className="mb-20">
            <h2 className="text-3xl font-extrabold tracking-tight text-center mb-12">What You'll Get</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
              {analysisFeatures.map((feature, index) => (
                <motion.div key={index} initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{delay:.55+index*.08}}>
                  <Card variant="subtle" className="p-6 h-full flex flex-col">
                    <div className="mb-5 p-3 rounded-md border border-neutral-300 bg-white w-fit">{feature.icon}</div>
                    <h3 className="text-base font-semibold mb-2 tracking-tight">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-neutral-600 flex-1">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Success Actions */}
          {resumeData && uploadStatus === 'success' && (
            <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:.65}} className="text-center mb-24">
              <Card variant="muted" className="p-12 lg:p-16">
                <div className="text-5xl mb-6">✓</div>
                <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-5">Analysis Complete</h3>
                <p className="text-base md:text-lg text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed">Your document has been processed. Access the full result set with structured recommendations and alignment metrics or explore opportunity pathways.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="solid" size="lg" onClick={handleViewResults} className="group flex items-center gap-2">View Detailed Results <ArrowRightIcon size={18} className="group-hover:translate-x-1 transition-transform" /></Button>
                  <Button variant="outline" size="lg" onClick={() => navigate('/careers')} className="flex items-center gap-2">Browse Matching Jobs</Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Extended Insight Section */}
          <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:.7}} className="pb-20">
            <div className="max-w-4xl mx-auto text-center mb-14">
              <h2 className="text-3xl font-extrabold tracking-tight mb-4">Signal Extraction Layers</h2>
              <p className="text-neutral-600 text-sm md:text-base leading-relaxed">Multi-stage parsing & evaluation pipeline detailing how raw text becomes structured guidance.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-10 mb-16">
              {[
                { title: 'Segmentation', desc: 'Section & block detection isolates discrete experiential and capability clusters.' },
                { title: 'Normalization', desc: 'Token cleanup, lemmatization and noise reduction optimize semantic fidelity.' },
                { title: 'Scoring', desc: 'Impact & alignment heuristics generate composite weighted metrics.' }
              ].map(item => (
                <Card key={item.title} variant="subtle" className="p-7 flex flex-col">
                  <h3 className="text-sm font-semibold tracking-wide uppercase mb-3">{item.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed flex-1">{item.desc}</p>
                </Card>
              ))}
            </div>
            <Card variant="subtle" className="p-10 lg:p-14">
              <h3 className="text-lg font-semibold tracking-tight mb-6">Processing Timeline</h3>
              <div className="space-y-6 max-w-2xl">
                {[
                  'Upload received & queued for parsing',
                  'Structural segmentation & metadata extraction',
                  'Keyword density + clustering computed',
                  'Alignment heuristics + scoring layers applied',
                  'Opportunity mapping & recommendations generated'
                ].map((s,i)=> (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center mt-1">
                      <div className="h-3 w-3 rounded-full bg-black" />
                      {i < 4 && <div className="flex-1 w-px bg-neutral-300" />}
                    </div>
                    <p className="text-sm text-neutral-700 leading-relaxed">{s}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </Container>
      </div>
    </PageLayout>
  );
};

export default UploadAnalyze;