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
  ArrowRightIcon,
  AlertCircleIcon,
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
  const { resumeData, isDemoMode, fetchHistory, loadAnalysis } = useResume();
  interface Analysis {
    id: number;
    fileName: string;
    analyzedAt: string;
    score: number;
    jobMatches: number;
    status: string;
    overallScore?: number;
  roleMatches?: { title?: string }[];
  skills?: { name?: string }[];
  }
  interface AnalysisWithDbId extends Analysis { _dbId?: string; originalFileUrl?: string }
  const [recentAnalyses, setRecentAnalyses] = useState<Analysis[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (isDemoMode) {
        // Preserve prior demo stub behaviour using resumeData if present
        if (resumeData) {
          setRecentAnalyses([
            {
              id: 1,
              fileName: resumeData.fileName || 'demo_resume.pdf',
              analyzedAt: new Date().toISOString(),
              score: resumeData.overallScore || resumeData.atsScore?.overall || 85,
              jobMatches: (resumeData.roleMatches || []).length || (resumeData.jobMatches || []).length || 5,
              status: 'completed'
            }
          ]);
        }
        return;
      }
      try {
        setIsHistoryLoading(true);
        const history = await fetchHistory(1, 10);
        if (!history || cancelled) return;
        type HistoryItem = { _id: string; originalFileName?: string; createdAt: string; atsScore?: { overall?: number }; originalFileUrl?: string };
        const mapped: AnalysisWithDbId[] = (history.analyses as HistoryItem[]).map((a, idx: number) => ({
          id: idx + 1,
          fileName: a.originalFileName || 'resume.pdf',
          analyzedAt: a.createdAt,
          score: a.atsScore?.overall || 0,
          jobMatches: 0,
          status: 'completed',
          _dbId: a._id,
          originalFileUrl: a.originalFileUrl
        }));
        // Prepend currently loaded resume if not included
        if (resumeData && !mapped.find(m => m.fileName === resumeData.fileName)) {
          mapped.unshift({
            id: 0,
            fileName: resumeData.fileName || 'current_resume.pdf',
            analyzedAt: new Date().toISOString(),
            score: resumeData.overallScore || resumeData.atsScore?.overall || 0,
            jobMatches: (resumeData.roleMatches || []).length || (resumeData.jobMatches || []).length || 0,
            status: 'completed'
          });
        }
        setRecentAnalyses(mapped);
      } catch (e) {
        console.error('Failed to load history', e);
      } finally {
        setIsHistoryLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [resumeData, isDemoMode, fetchHistory]);

  const stats = [
    {
      title: 'Total Analyses',
      value: recentAnalyses.length.toString(),
      icon: <FileTextIcon size={22} />,
      change: '+2 this month'
    },
    {
      title: 'Average Score',
      value: recentAnalyses.length > 0 ? Math.round(recentAnalyses.reduce((acc, curr) => acc + curr.score, 0) / recentAnalyses.length).toString() : '0',
      icon: <BarChart3Icon size={22} />,
      change: '+12% vs prev.'
    },
    {
      title: 'Job Matches',
      value: recentAnalyses.reduce((acc, curr) => acc + curr.jobMatches, 0).toString(),
      icon: <BriefcaseIcon size={22} />,
      change: 'Pipeline +25'
    },
    {
      title: 'Profile Views',
      value: '156',
      icon: <UserIcon size={22} />,
      change: '+8% this wk'
    }
  ];

  const quickActions = [
    {
      title: 'Upload New Resume',
      description: 'Analyze a new resume with the AI engine',
      icon: <UploadIcon size={30} />,
      action: () => navigate('/upload')
    },
    {
      title: 'View Results',
      description: 'Inspect your latest analysis output',
      icon: <BarChart3Icon size={30} />,
      action: () => navigate('/results'),
      disabled: !resumeData
    },
    {
      title: 'Browse Jobs',
      description: 'Discover aligned roles & opportunities',
      icon: <BriefcaseIcon size={30} />,
      action: () => navigate('/careers')
    },
    {
      title: 'Update Profile',
      description: 'Adjust preferences & visibility',
      icon: <UserIcon size={30} />,
      action: () => navigate('/profile')
    }
  ];

  const currentResume = resumeData || recentAnalyses[0];

  return (
    <PageLayout>
      <Container className="py-14">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-neutral-100 border border-neutral-300 mb-6">
              <span className="h-2 w-2 rounded-full bg-black" />
              <span className="text-xs font-semibold tracking-wider">DASHBOARD OVERVIEW</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Performance Console</h1>
            <p className="text-neutral-600 text-base md:text-lg max-w-2xl leading-relaxed">A consolidated operational view of your resume intelligence, iteration momentum and market alignment signals.</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card variant="subtle" className="p-6 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-5">
                    <div className="p-2.5 rounded-md border border-neutral-300 bg-white text-black">
                      {stat.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-[1.65rem] leading-none font-extrabold tracking-tight">{stat.value}</div>
                      <div className="text-xs uppercase tracking-wide text-neutral-500 mt-1">{stat.title}</div>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-neutral-600">{stat.change}</div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions */}
              <motion.div variants={fadeInUp}>
                <h2 className="text-2xl font-bold mb-6 tracking-tight">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Card
                      key={index}
                      variant="subtle"
                      as={action.disabled ? 'div' : 'button'}
                      onClick={action.disabled ? undefined : action.action}
                      className={`p-5 text-left border border-neutral-300 hover:shadow-sm group transition-all duration-300 ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-md border border-neutral-300 bg-white text-black group-hover:scale-105 transition-transform">{action.icon}</div>
                        <div>
                          <h3 className="text-base font-semibold mb-1 tracking-tight">{action.title}</h3>
                          <p className="text-neutral-600 text-xs leading-relaxed">{action.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>

              {/* Recent Analyses */}
              <motion.div variants={fadeInUp}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold tracking-tight">Recent Analyses</h2>
                  <Button variant="outline" size="sm" onClick={() => navigate('/upload')}>
                    New Analysis
                  </Button>
                </div>
                <div className="space-y-4">
                  {isHistoryLoading && recentAnalyses.length === 0 && (
                    <Card variant="subtle" className="p-10 text-center">
                      <div className="mx-auto mb-4 h-8 w-8 border-2 border-neutral-300 border-t-black rounded-full animate-spin" />
                      <p className="text-neutral-600 text-sm">Loading analyses...</p>
                    </Card>
                  )}
                  {recentAnalyses.map((analysis) => (
                    <Card key={analysis.id} variant="subtle" className="p-6 hover:shadow-sm transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 border border-neutral-300 rounded-md bg-white">
                            <FileTextIcon size={18} />
                          </div>
                          <div>
                            <h3 className="font-semibold tracking-tight text-sm md:text-base">{analysis.fileName}</h3>
                            <p className="text-neutral-600 text-xs">
                              {new Date(analysis.analyzedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8 md:gap-10">
                          <div className="text-center">
                            <div className="text-lg font-extrabold tracking-tight">{analysis.score}</div>
                            <div className="text-[10px] uppercase tracking-wide text-neutral-500">Score</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-extrabold tracking-tight">{analysis.jobMatches}</div>
                            <div className="text-[10px] uppercase tracking-wide text-neutral-500">Jobs</div>
                          </div>
                          <div className="flex items-center gap-2">
                          {(analysis as AnalysisWithDbId).originalFileUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open((analysis as AnalysisWithDbId).originalFileUrl as string, '_blank')}
                            >File</Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              const withId = analysis as AnalysisWithDbId;
                              if (withId._dbId) {
                                await loadAnalysis(withId._dbId);
                                localStorage.setItem('currentAnalysisId', withId._dbId);
                                navigate('/results');
                              } else if (resumeData) {
                                navigate('/results');
                              } else if (isDemoMode) {
                                navigate('/upload?demo=true');
                              }
                            }}
                          >
                            View <ArrowRightIcon size={14} className="ml-1" />
                          </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {recentAnalyses.length === 0 && (
                    <Card variant="subtle" className="p-12 text-center">
                      <FileTextIcon size={48} className="text-neutral-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No Analyses Yet</h3>
                      <p className="text-neutral-600 mb-6">
                        Upload your first resume to get started with AI-powered analysis
                      </p>
                      <Button variant="solid" onClick={() => navigate('/upload')}>
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
                  <Card variant="muted" className="p-6">
                    <h3 className="text-lg font-semibold mb-5 flex items-center tracking-tight">
                      <TargetIcon size={16} className="mr-2" /> Current Resume
                    </h3>
                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-neutral-600 text-sm">Overall Score</span>
                          <span className="text-2xl font-extrabold tracking-tight">{Number(currentResume.score || currentResume.overallScore || 0)}/100</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
                          <div
                            className="h-full bg-black transition-all duration-1000"
                            style={{ width: `${currentResume.score || currentResume.overallScore}%` }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-5 border-t border-neutral-300">
                        <div className="text-center">
                          <div className="text-xl font-extrabold tracking-tight">{Number(currentResume.jobMatches || currentResume.roleMatches?.length || 0)}</div>
                          <div className="text-[10px] uppercase tracking-wide text-neutral-500">Job Matches</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-extrabold tracking-tight">{currentResume.skills?.length || 15}</div>
                          <div className="text-[10px] uppercase tracking-wide text-neutral-500">Skills</div>
                        </div>
                      </div>
                      <Button
                        variant="solid"
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
                <Card variant="muted" className="p-6">
                  <h3 className="text-lg font-semibold mb-5 flex items-center tracking-tight">
                    <AlertCircleIcon size={16} className="mr-2" /> Recommendations
                  </h3>
                  <div className="space-y-4">
                    {[
                      'Add quantifiable achievement metrics to 2 more roles',
                      'Refresh skills list to reflect emerging tooling & frameworks',
                      'Incorporate a portfolio or repository reference link'
                    ].map(item => (
                      <div key={item} className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-black mt-2" />
                        <p className="text-sm text-neutral-700 leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" fullWidth size="sm" className="mt-6">
                    View All Suggestions
                  </Button>
                </Card>
              </motion.div>

              {/* Quick Stats */}
              <motion.div variants={fadeInUp}>
                <Card variant="muted" className="p-6">
                  <h3 className="text-lg font-semibold mb-5 flex items-center tracking-tight">
                    <TrendingUpIcon size={16} className="mr-2" /> Performance
                  </h3>
                  <div className="space-y-5">
                    {[
                      { label: 'Profile Views', value: 24 },
                      { label: 'Application Rate', value: 12 },
                      { label: 'Interview Calls', value: 18 }
                    ].map(metric => (
                      <div key={metric.label} className="space-y-2">
                        <div className="flex justify-between text-xs font-medium text-neutral-600"><span>{metric.label}</span><span>+{metric.value}%</span></div>
                        <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                          <div className="h-full bg-black" style={{ width: `${Math.min(metric.value,100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Extended Intelligence Section */}
          <motion.div variants={fadeInUp} className="mt-16">
            <div className="mb-10 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-extrabold tracking-tight mb-4">Quality Signal Breakdown</h2>
              <p className="text-neutral-600 leading-relaxed text-sm md:text-base">Deep structural view of resume composition factors to guide targeted refinement cycles.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-14">
              {[
                { title: 'Impact Density', value: 76, desc: 'Ratio of quantified achievement statements to total experience lines.' },
                { title: 'Skill Surface', value: 64, desc: 'Coverage breadth across core, adjacent & enabling competencies.' },
                { title: 'Role Alignment', value: 82, desc: 'Semantic affinity to targeted functional & seniority archetypes.' }
              ].map(block => (
                <Card key={block.title} variant="subtle" className="p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold tracking-tight text-sm uppercase">{block.title}</h3>
                    <span className="text-xl font-extrabold tracking-tight">{block.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-200 overflow-hidden mb-4">
                    <div className="h-full bg-black" style={{ width: `${block.value}%` }} />
                  </div>
                  <p className="text-xs leading-relaxed text-neutral-600 flex-1">{block.desc}</p>
                </Card>
              ))}
            </div>
            <div className="grid lg:grid-cols-2 gap-10">
              <Card variant="subtle" className="p-8">
                <h3 className="text-lg font-semibold tracking-tight mb-5">Iteration Timeline</h3>
                <div className="space-y-6">
                  {[
                    { date: 'Today', label: 'Score recalculated after keyword density optimization' },
                    { date: '2d ago', label: 'Added quantified metrics to 3 experience entries' },
                    { date: '5d ago', label: 'Refreshed technical skills cluster taxonomy' },
                    { date: '1w ago', label: 'Initial baseline analysis created' }
                  ].map(item => (
                    <div key={item.date} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-3 rounded-full bg-black mt-1" />
                        <div className="flex-1 w-px bg-neutral-300" />
                      </div>
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wide text-neutral-500 mb-1">{item.date}</div>
                        <div className="text-sm leading-relaxed text-neutral-700">{item.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card variant="subtle" className="p-8">
                <h3 className="text-lg font-semibold tracking-tight mb-5">Next Opportunity Focus</h3>
                <ul className="space-y-5 mb-8">
                  {[
                    'Elevate differentiation via impact-first summary line',
                    'Introduce micro-section for strategic initiatives',
                    'Consolidate overlapping tool references into families'
                  ].map(t => (
                    <li key={t} className="flex gap-3 items-start">
                      <div className="h-5 w-5 rounded-md border border-neutral-300 flex items-center justify-center text-[10px] font-bold">•</div>
                      <span className="text-sm leading-relaxed text-neutral-700">{t}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="solid" size="sm">Generate Action Plan</Button>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </PageLayout>
  );
};

export default Dashboard;