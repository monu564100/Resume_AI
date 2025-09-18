import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useResume } from '../context/ResumeContext';
import { 
  FileTextIcon, 
  UploadIcon, 
  BarChart3Icon, 
  BriefcaseIcon, 
  TrendingUpIcon,
  UserIcon,
  StarIcon,
  ArrowRightIcon,
  AlertCircleIcon,
  ClockIcon,
  TargetIcon
} from 'lucide-react';

// Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { resumeData, isDemoMode } = useResume();
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);

  useEffect(() => {
    // Load demo data if in demo mode or if resumeData exists
    if (isDemoMode || resumeData) {
      setRecentAnalyses([
        {
          id: 1,
          fileName: resumeData?.fileName || 'john_doe_resume.pdf',
          analyzedAt: '2024-01-15T10:30:00Z',
          score: resumeData?.overallScore || 85,
          jobMatches: resumeData?.roleMatches?.length || 5,
          status: 'completed'
        },
        {
          id: 2,
          fileName: 'sarah_smith_resume.pdf',
          analyzedAt: '2024-01-10T14:20:00Z',
          score: 78,
          jobMatches: 8,
          status: 'completed'
        },
        {
          id: 3,
          fileName: 'mike_johnson_resume.pdf',
          analyzedAt: '2024-01-08T09:15:00Z',
          score: 92,
          jobMatches: 12,
          status: 'completed'
        }
      ]);
    }
  }, [resumeData, isDemoMode]);

  const stats = [
    {
      title: 'Total Analyses',
      value: recentAnalyses.length.toString(),
      icon: <FileTextIcon size={24} />,
      change: '+2 this month',
      color: 'text-primary'
    },
    {
      title: 'Average Score',
      value: recentAnalyses.length > 0 ? Math.round(recentAnalyses.reduce((acc, curr) => acc + curr.score, 0) / recentAnalyses.length).toString() : '0',
      icon: <BarChart3Icon size={24} />,
      change: '+12% from last month',
      color: 'text-green-400'
    },
    {
      title: 'Job Matches',
      value: recentAnalyses.reduce((acc, curr) => acc + curr.jobMatches, 0).toString(),
      icon: <BriefcaseIcon size={24} />,
      change: '25 new opportunities',
      color: 'text-blue-400'
    },
    {
      title: 'Profile Views',
      value: '156',
      icon: <UserIcon size={24} />,
      change: '+8% this week',
      color: 'text-purple-400'
    }
  ];

  const quickActions = [
    {
      title: 'Upload New Resume',
      description: 'Analyze a new resume with our AI-powered system',
      icon: <UploadIcon size={32} />,
      action: () => navigate('/upload'),
      color: 'bg-primary/10 border-primary/20 hover:bg-primary/20'
    },
    {
      title: 'View Results',
      description: 'Check your latest resume analysis results',
      icon: <BarChart3Icon size={32} />,
      action: () => navigate('/results'),
      color: 'bg-green-500/10 border-green-500/20 hover:bg-green-500/20',
      disabled: !resumeData
    },
    {
      title: 'Browse Jobs',
      description: 'Explore job opportunities matched to your profile',
      icon: <BriefcaseIcon size={32} />,
      action: () => navigate('/careers'),
      color: 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20'
    },
    {
      title: 'Update Profile',
      description: 'Manage your profile and preferences',
      icon: <UserIcon size={32} />,
      action: () => navigate('/profile'),
      color: 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20'
    }
  ];

  const currentResume = resumeData || recentAnalyses[0];

  return (
    <PageLayout>
      <Container className="py-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome to Your <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Track your resume performance and career progress
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card variant="glass" className="p-6 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-dark-100/50 ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.title}</div>
                    </div>
                  </div>
                  <div className="text-xs text-green-400">
                    {stat.change}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions */}
              <motion.div variants={fadeInUp}>
                <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Card 
                      key={index}
                      variant="glass" 
                      className={`p-6 cursor-pointer transition-all duration-300 ${action.color} ${
                        action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                      }`}
                      onClick={action.disabled ? undefined : action.action}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {action.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                          <p className="text-gray-400 text-sm">{action.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>

              {/* Recent Analyses */}
              <motion.div variants={fadeInUp}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Recent Analyses</h2>
                  <Button variant="outline" size="sm" onClick={() => navigate('/upload')}>
                    New Analysis
                  </Button>
                </div>
                <div className="space-y-4">
                  {recentAnalyses.map((analysis, index) => (
                    <Card key={analysis.id} variant="glass" className="p-6 hover:border-primary/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-dark-100/50 rounded-lg">
                            <FileTextIcon size={20} className="text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{analysis.fileName}</h3>
                            <p className="text-gray-400 text-sm">
                              Analyzed on {new Date(analysis.analyzedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="text-lg font-bold text-primary">{analysis.score}</div>
                            <div className="text-xs text-gray-400">Score</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-400">{analysis.jobMatches}</div>
                            <div className="text-xs text-gray-400">Jobs</div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              if (index === 0 && resumeData) {
                                navigate('/results');
                              } else {
                                navigate('/upload?demo=true');
                              }
                            }}
                          >
                            View <ArrowRightIcon size={16} className="ml-1" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {recentAnalyses.length === 0 && (
                    <Card variant="glass" className="p-12 text-center">
                      <FileTextIcon size={48} className="text-gray-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No Analyses Yet</h3>
                      <p className="text-gray-400 mb-6">
                        Upload your first resume to get started with AI-powered analysis
                      </p>
                      <Button variant="primary" onClick={() => navigate('/upload')}>
                        Upload Resume
                      </Button>
                    </Card>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Current Resume Status */}
              {currentResume && (
                <motion.div variants={fadeInUp}>
                  <Card variant="glassDark" className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <TargetIcon size={18} className="mr-2 text-primary" />
                      Current Resume
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-300">Overall Score</span>
                          <span className="text-xl font-bold text-primary">
                            {currentResume.score || currentResume.overallScore}/100
                          </span>
                        </div>
                        <div className="w-full bg-dark-100 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-1000" 
                            style={{ width: `${currentResume.score || currentResume.overallScore}%` }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-400">
                            {currentResume.jobMatches || currentResume.roleMatches?.length || 0}
                          </div>
                          <div className="text-xs text-gray-400">Job Matches</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">
                            {currentResume.skills?.length || 15}
                          </div>
                          <div className="text-xs text-gray-400">Skills</div>
                        </div>
                      </div>
                      <Button 
                        variant="primary" 
                        fullWidth 
                        size="sm"
                        onClick={() => navigate('/results')}
                      >
                        View Full Analysis
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Recommendations */}
              <motion.div variants={fadeInUp}>
                <Card variant="glassDark" className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <AlertCircleIcon size={18} className="mr-2 text-yellow-400" />
                    Recommendations
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-gray-300">
                        Add more quantifiable achievements to your work experience
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-gray-300">
                        Update your skills section with trending technologies
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-gray-300">
                        Consider adding a portfolio link to showcase projects
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" fullWidth size="sm" className="mt-4">
                    View All Suggestions
                  </Button>
                </Card>
              </motion.div>

              {/* Quick Stats */}
              <motion.div variants={fadeInUp}>
                <Card variant="glassDark" className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <TrendingUpIcon size={18} className="mr-2 text-green-400" />
                    Performance
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Profile Views</span>
                      <span className="font-bold text-green-400">+24%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Application Rate</span>
                      <span className="font-bold text-blue-400">+12%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Interview Calls</span>
                      <span className="font-bold text-purple-400">+18%</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Container>
    </PageLayout>
  );
};

export default Dashboard;