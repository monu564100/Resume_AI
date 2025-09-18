import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Clock, 
  FileText, 
  TrendingUp, 
  Award, 
  Trash2, 
  Eye,
  Plus,
  BarChart3,
  Target,
  Calendar,
  Download,
  Star,
  Briefcase,
  Users,
  ArrowUpRight,
  ChevronRight,
  Activity
} from 'lucide-react';

interface Analysis {
  _id: string;
  originalFileName: string;
  atsScore: {
    overall: number;
  };
  createdAt: string;
  analysisVersion: string;
}

interface UserStats {
  totalAnalyses: number;
  avgAtsScore: number;
  maxAtsScore: number;
  minAtsScore: number;
  latestAnalysis: string;
}
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token') || 'dummy-token';
      
      console.log('Fetching dashboard data with token:', token?.substring(0, 20) + '...');

      const historyResponse = await fetch('http://localhost:5000/api/analysis/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const statsResponse = await fetch('http://localhost:5000/api/analysis/stats/overview', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (historyResponse.ok && statsResponse.ok) {
        const historyData = await historyResponse.json();
        const statsData = await statsResponse.json();
        
        setAnalyses(historyData.data?.analyses || []);
        setStats(statsData.data?.overview || null);
      } else {
        const historyError = !historyResponse.ok ? await historyResponse.text() : null;
        const statsError = !statsResponse.ok ? await statsResponse.text() : null;
        
        setError(`Failed to fetch dashboard data. History: ${historyResponse.status}, Stats: ${statsResponse.status}`);
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      setError(`Failed to load dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleViewAnalysis = (analysisId: string) => {
    localStorage.setItem('currentAnalysisId', analysisId);
    navigate('/analyze');
  };

  const handleDeleteAnalysis = async (analysisId: string) => {
    try {
      const token = localStorage.getItem('token') || 'dummy-token';
      
      const response = await fetch(`http://localhost:5000/api/analysis/${analysisId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setAnalyses(prev => prev.filter(analysis => analysis._id !== analysisId));
      } else {
        console.error('Failed to delete analysis');
      }
    } catch (error) {
      console.error('Error deleting analysis:', error);
    }
  };

  const quickActions = [
    {
      title: 'New Analysis',
      description: 'Upload and analyze a new resume',
      icon: <Plus size={24} className="text-primary" />,
      action: () => navigate('/upload'),
      color: 'from-primary/20 to-primary/10'
    },
    {
      title: 'Browse Jobs',
      description: 'Find matching opportunities',
      icon: <Briefcase size={24} className="text-emerald-400" />,
      action: () => navigate('/careers'),
      color: 'from-emerald-500/20 to-emerald-500/10'
    },
    {
      title: 'View Analytics',
      description: 'Track your progress',
      icon: <BarChart3 size={24} className="text-blue-400" />,
      action: () => navigate('/analytics'),
      color: 'from-blue-500/20 to-blue-500/10'
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/20';
    if (score >= 60) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  if (loading) {
    return (
      <PageLayout>
        <Container className="py-20">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-400">Loading your dashboard...</p>
            </div>
          </div>
        </Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-dark-200 via-dark-100 to-dark-200">
        <Container className="py-8 lg:py-12">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 lg:mb-12"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  Welcome back! 👋
                </h1>
                <p className="text-lg text-gray-300">
                  Track your resume optimization progress and career insights
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="primary"
                  onClick={() => navigate('/upload')}
                  className="group flex items-center gap-2"
                >
                  <Plus size={20} />
                  New Analysis
                  <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/careers')}
                  className="flex items-center gap-2"
                >
                  <Briefcase size={20} />
                  Browse Jobs
                </Button>
              </div>
            </div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300"
            >
              {error}
            </motion.div>
          )}

          {/* Stats Overview */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12"
            >
              <Card variant="glass" className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <FileText size={20} className="text-primary" />
                  </div>
                  <span className="text-2xl">📄</span>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                  {stats.totalAnalyses}
                </div>
                <div className="text-sm text-gray-400">Total Analyses</div>
              </Card>

              <Card variant="glass" className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20">
                    <TrendingUp size={20} className="text-emerald-400" />
                  </div>
                  <span className="text-2xl">📊</span>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                  {stats.avgAtsScore.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-400">Avg ATS Score</div>
              </Card>

              <Card variant="glass" className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-yellow-500/20">
                    <Award size={20} className="text-yellow-400" />
                  </div>
                  <span className="text-2xl">🏆</span>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                  {stats.maxAtsScore}%
                </div>
                <div className="text-sm text-gray-400">Best Score</div>
              </Card>

              <Card variant="glass" className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Activity size={20} className="text-blue-400" />
                  </div>
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                  {formatDate(stats.latestAnalysis)}
                </div>
                <div className="text-sm text-gray-400">Last Analysis</div>
              </Card>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 lg:mb-12"
          >
            <h2 className="text-xl lg:text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              {quickActions.map((action, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    variant="glass"
                    className="p-6 cursor-pointer group hover:shadow-xl transition-all duration-300"
                    onClick={action.action}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.color} rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        {action.icon}
                        <ChevronRight size={20} className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {action.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {action.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Analyses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-white">Recent Analyses</h2>
              {analyses.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/history')}
                  className="flex items-center gap-2"
                >
                  View All
                  <ChevronRight size={16} />
                </Button>
              )}
            </div>

            {analyses.length === 0 ? (
              <Card variant="glass" className="p-8 lg:p-12 text-center">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No analyses yet
                </h3>
                <p className="text-gray-400 mb-6">
                  Upload your first resume to get started with AI-powered insights
                </p>
                <Button
                  variant="primary"
                  onClick={() => navigate('/upload')}
                  className="inline-flex items-center gap-2"
                >
                  <Plus size={20} />
                  Analyze Your Resume
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {analyses.slice(0, 5).map((analysis, index) => (
                  <motion.div
                    key={analysis._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card variant="glass" className="p-4 lg:p-6 group hover:shadow-xl transition-all duration-300">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-3 rounded-lg bg-primary/20 flex-shrink-0">
                            <FileText size={20} className="text-primary" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-semibold text-white mb-1 truncate">
                              {analysis.originalFileName}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {formatDate(analysis.createdAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Target size={14} />
                                Version {analysis.analysisVersion}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 lg:gap-4">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBg(analysis.atsScore.overall)}`}>
                            <span className={getScoreColor(analysis.atsScore.overall)}>
                              {analysis.atsScore.overall}% ATS
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewAnalysis(analysis._id)}
                              className="flex items-center gap-1"
                            >
                              <Eye size={16} />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteAnalysis(analysis._id)}
                              className="flex items-center gap-1 text-red-400 hover:text-red-300 hover:border-red-400"
                            >
                              <Trash2 size={16} />
                              <span className="hidden sm:inline">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </Container>
      </div>
    </PageLayout>
  );
};

  const handleDeleteAnalysis = async (analysisId: string) => {
    if (!confirm('Are you sure you want to delete this analysis?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/analysis/${analysisId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setAnalyses(analyses.filter(a => a._id !== analysisId));
        fetchDashboardData(); // Refresh stats
      } else {
        alert('Failed to delete analysis');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete analysis');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <PageLayout>
        <Container className="py-12">
          <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </Container>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <Container className="py-12">
          <Card variant="glass" className="text-center">
            <h2 className="text-xl font-bold text-red-400 mb-4">Dashboard Error</h2>
            <p className="text-red-400 mb-4">{error}</p>
            <div className="space-y-2">
              <Button onClick={fetchDashboardData}>Try Again</Button>
              <p className="text-gray-400 text-sm">
                If this problem persists, check the console for more details.
              </p>
            </div>
          </Card>
        </Container>
      </PageLayout>
    );
  }
  return (
    <PageLayout>
      <Container className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">
              My <span className="text-primary text-glow-primary">Dashboard</span>
            </h1>
            <Button onClick={() => navigate('/upload')}>
              Analyze New Resume
            </Button>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card variant="glass" className="text-center">
                <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.totalAnalyses}</p>
                <p className="text-gray-400">Total Analyses</p>
              </Card>

              <Card variant="glass" className="text-center">
                <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{Math.round(stats.avgAtsScore || 0)}</p>
                <p className="text-gray-400">Avg ATS Score</p>
              </Card>

              <Card variant="glass" className="text-center">
                <Award className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.maxAtsScore || 0}</p>
                <p className="text-gray-400">Best Score</p>
              </Card>

              <Card variant="glass" className="text-center">
                <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-medium">
                  {stats.latestAnalysis ? formatDate(stats.latestAnalysis) : 'N/A'}
                </p>
                <p className="text-gray-400">Last Analysis</p>
              </Card>
            </div>
          )}

          {/* Recent Analyses */}
          <Card variant="glass">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Recent Analyses</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/upload')}
              >
                View All
              </Button>
            </div>

            {analyses.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No analyses yet</p>
                <Button onClick={() => navigate('/upload')}>
                  Upload Your First Resume
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {analyses.map((analysis) => (
                  <motion.div
                    key={analysis._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-dark-50 rounded-lg p-4 flex items-center justify-between hover:bg-dark-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <p className="font-semibold">{analysis.originalFileName}</p>
                        <p className="text-gray-400 text-sm">
                          {formatDate(analysis.createdAt)} • v{analysis.analysisVersion}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">ATS Score: {analysis.atsScore.overall}%</p>
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${analysis.atsScore.overall}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewAnalysis(analysis._id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteAnalysis(analysis._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/upload')}>
              <Card variant="glass" className="text-center">
                <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">New Analysis</h3>
                <p className="text-gray-400">Upload and analyze a new resume</p>
              </Card>
            </div>

            <div className="cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/analyze')}>
              <Card variant="glass" className="text-center">
                <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">View Latest</h3>
                <p className="text-gray-400">View your most recent analysis</p>
              </Card>
            </div>

            <div className="cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/profile')}>
              <Card variant="glass" className="text-center">
                <Award className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Profile Settings</h3>
                <p className="text-gray-400">Manage your account settings</p>
              </Card>
            </div>
          </div>
        </motion.div>
      </Container>
    </PageLayout>
  );
};
export default Dashboard;