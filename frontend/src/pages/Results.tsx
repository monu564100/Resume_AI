import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useResume } from '../context/ResumeContext';
import { ChevronRightIcon, FileTextIcon, BriefcaseIcon, TrendingUpIcon, BarChart3Icon, AlertCircleIcon } from 'lucide-react';
const Results: React.FC = () => {
  const navigate = useNavigate();
  const {
    resumeData,
    isDemoMode
  } = useResume();
  type SkillObj = { name: string; level?: number; category?: string }; 
  type RoleMatch = { title: string; company?: string; matchScore: number; keySkillMatches?: string[]; missingSkills?: string[]; salary?: string };
  type SkillGap = { category: string; missing: string[]; recommendation: string };
  type ScoreBreakdown = Record<string, number>;
  type ImprovementSuggestion = string | { suggestion?: string; text?: string; category?: string; impact?: string; difficulty?: string; estimatedTime?: string };
  const [activeTab, setActiveTab] = useState<string>('overview');
  // Redirect to upload page if no resume data
  useEffect(() => {
    if (!resumeData && !isDemoMode) {
      navigate('/upload');
    }
  }, [resumeData, isDemoMode, navigate]);
  if (!resumeData) {
    return <div>Loading...</div>;
  }
  // Check if resumeData has been fully parsed (has personalInfo, skills, etc.)
  const isFullyParsed = resumeData.personalInfo && resumeData.skills && resumeData.roleMatches;
  // If not fully parsed, show message that analysis is needed
  if (!isFullyParsed) {
    return (
      <PageLayout>
        <Container className="py-16">
          <Card variant="subtle" className="text-center p-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-neutral-100 border border-neutral-300 mb-8">
              <span className="h-2 w-2 rounded-full bg-black" />
              <span className="text-xs font-semibold tracking-wider">ANALYSIS REQUIRED</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-4">Resume Analysis Needed</h2>
            <p className="text-neutral-600 mb-10 max-w-xl mx-auto leading-relaxed">Your file "{resumeData.fileName}" has been uploaded successfully.{isDemoMode ? ' Demo placeholder data should appear.' : ' Run the analyzer to unlock structured results and insights.'}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="solid" onClick={() => navigate('/upload')}>Analyze Resume</Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
            </div>
          </Card>
        </Container>
      </PageLayout>
    );
  }
  // Safe destructuring with fallbacks
  const {
    personalInfo = {
      name: 'User',
      email: 'user@example.com'
    },
    skills = [],
    roleMatches = [],
    overallScore = 0,
    scoreBreakdown = {},
    improvementSuggestions = []
  } = resumeData;
  const tabs = [{
    id: 'overview',
    label: 'Overview',
    icon: <BarChart3Icon size={18} />
  }, {
    id: 'skills',
    label: 'Skills Analysis',
    icon: <TrendingUpIcon size={18} />
  }, {
    id: 'matches',
    label: 'Job Matches',
    icon: <BriefcaseIcon size={18} />
  }, {
    id: 'improvements',
    label: 'Improvements',
    icon: <AlertCircleIcon size={18} />
  }];
  return <PageLayout>
      <Container className="py-14">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <Card variant="muted" className="sticky top-24 p-6">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 rounded-full border border-neutral-300 flex items-center justify-center mr-4 bg-white">
                  <FileTextIcon />
                </div>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">{personalInfo.name}</h2>
                  <p className="text-neutral-600 text-xs">{personalInfo.email}</p>
                </div>
              </div>
              <div className="mb-7">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-neutral-600 text-xs uppercase tracking-wide">Overall Score</span>
                  <span className="text-2xl font-extrabold tracking-tight">{overallScore}/100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
                  <div className="h-full bg-black" style={{ width: `${overallScore}%` }} />
                </div>
              </div>
              {Object.keys(scoreBreakdown).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-semibold tracking-wide uppercase mb-4">Score Breakdown</h3>
                  <div className="space-y-4">
                    {Object.entries(scoreBreakdown as ScoreBreakdown).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                        <div className="flex justify-between text-xs text-neutral-600">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span>{value as number}/100</span>
                        </div>
                        <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                          <div className="h-full bg-black" style={{ width: `${value as number}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h3 className="text-xs font-semibold tracking-wide uppercase mb-3">Navigation</h3>
                <div className="space-y-2">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 text-xs font-medium tracking-wide border transition-all ${activeTab === tab.id ? 'bg-black text-white border-black' : 'bg-white border-neutral-300 hover:bg-neutral-100 text-neutral-600'}`}
                    >
                      <span>{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          {/* Main Content */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            {activeTab === 'overview' && <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            duration: 0.5
          }}>
                <Card variant="subtle" className="mb-10">
                  <h2 className="text-2xl font-extrabold tracking-tight mb-8">Resume Overview</h2>
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold tracking-wide uppercase mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-neutral-500 text-xs uppercase tracking-wide mb-0.5">Name</p>
                        <p className="font-medium tracking-tight">{personalInfo.name}</p>
                      </div>
                      <div>
                        <p className="text-neutral-500 text-xs uppercase tracking-wide mb-0.5">Email</p>
                        <p className="font-medium tracking-tight">{personalInfo.email}</p>
                      </div>
                      <div>
                        <p className="text-neutral-500 text-xs uppercase tracking-wide mb-0.5">Phone</p>
                        <p className="font-medium tracking-tight">
                          {personalInfo.phone || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <p className="text-neutral-500 text-xs uppercase tracking-wide mb-0.5">Location</p>
                        <p className="font-medium tracking-tight">
                          {personalInfo.location || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                  {resumeData.summary && <div className="mb-8">
                      <h3 className="text-sm font-semibold tracking-wide uppercase mb-4">Summary</h3>
                      <p className="text-neutral-600 leading-relaxed text-sm">{resumeData.summary}</p>
                    </div>}
                  <div>
                    <h3 className="text-sm font-semibold tracking-wide uppercase mb-4">Key Skills</h3>
                    {skills.length > 0 ? <div className="flex flex-wrap gap-2">
                        {skills.slice(0, 8).map((skill: string | SkillObj, index: number) => (
                          <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-200 text-neutral-800">
                            {typeof skill === 'string' ? skill : (skill as SkillObj).name}
                          </span>
                        ))}
                      </div> : <p className="text-neutral-500 text-sm">No skills identified yet.</p>}
                  </div>
                </Card>
                {roleMatches.length > 0 && <Card variant="subtle" className="mb-10">
                    <h2 className="text-2xl font-extrabold tracking-tight mb-8">Top Career Matches</h2>
                    <div className="space-y-4">
                      {roleMatches.slice(0, 3).map((role: RoleMatch, index: number) => <div key={index} className="rounded-lg p-5 border border-neutral-200 bg-white hover:shadow-sm transition-all">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-base font-semibold tracking-tight">
                              {role.title}
                            </h3>
                            <span className="px-2 py-1 rounded-md text-[10px] font-semibold tracking-wide bg-neutral-900 text-white">{role.matchScore}% MATCH</span>
                          </div>
                          <p className="text-neutral-600 mb-3 text-sm">{role.company}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {role.keySkillMatches?.map((skill: string, skillIndex: number) => <span key={skillIndex} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-200 text-neutral-800">
                                {skill}
                              </span>)}
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-neutral-500 text-xs">
                              {role.salary}
                            </span>
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/role/${index}`)} className="flex items-center gap-1">
                              View <ChevronRightIcon size={14} />
                            </Button>
                          </div>
                        </div>)}
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" fullWidth onClick={() => setActiveTab('matches')}>
                        View All Matches
                      </Button>
                    </div>
                  </Card>}
                {improvementSuggestions.length > 0 && <Card variant="subtle">
                    <h2 className="text-2xl font-extrabold tracking-tight mb-8">Improvement Suggestions</h2>
                    <div className="space-y-3">
                      { (improvementSuggestions as ImprovementSuggestion[]).map((suggestion: ImprovementSuggestion, index: number) => {
                        // Handle both string and object formats
                        const suggestionText = typeof suggestion === 'string' 
                          ? suggestion 
                          : suggestion?.suggestion || suggestion?.text || 'No suggestion available';
                        
                        return (
                          <div key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-6 w-6 rounded-md border border-neutral-300 flex items-center justify-center text-[10px] font-semibold bg-white mt-0.5">{index + 1}</div>
                            <div className="flex-1 text-sm leading-relaxed text-neutral-700">
                              <p>{suggestionText}</p>
                              {typeof suggestion === 'object' && suggestion?.category && (
                                <span className="text-[10px] tracking-wide uppercase text-neutral-500 mt-1 block">Category: {suggestion.category}</span>
                              )}
                              {typeof suggestion === 'object' && suggestion?.impact && (
                                <span className="text-[10px] tracking-wide uppercase text-neutral-500 mt-1 block">Impact: {suggestion.impact}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>}
              </motion.div>}
            {activeTab === 'skills' && <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            duration: 0.5
          }}>
                <Card variant="subtle" className="mb-10">
                  <h2 className="text-2xl font-extrabold tracking-tight mb-8">Skills Analysis</h2>
                  {skills.length > 0 ? <div className="space-y-6">
           {['Programming', 'Framework', 'Backend', 'Frontend', 'Database', 'DevOps', 'Cloud', 'Other'].map((category: string) => {
         const categorySkills = (skills as (string | SkillObj)[]).filter(skill => typeof skill === 'object' && (skill as SkillObj).category === category) as SkillObj[];
                  if (categorySkills.length === 0) return null;
                  return <div key={category}>
                            <h3 className="text-sm font-semibold tracking-wide uppercase mb-4">{category}</h3>
                            <div className="space-y-4">
                               {categorySkills.map((skill: SkillObj, index: number) => <div key={index} className="space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-neutral-700 text-sm">{(skill as SkillObj).name}</span>
                                    <span className="text-neutral-500 text-xs">{(skill as SkillObj).level}/100</span>
                                  </div>
                                  <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
                                    <div className="h-full bg-black" style={{ width: `${(skill as SkillObj).level}%` }} />
                                  </div>
                                </div>)}
                            </div>
                          </div>;
                })}
                    </div> : <p className="text-gray-400">
                      No skills analysis available yet.
                    </p>}
                </Card>
                {resumeData.skillGaps && resumeData.skillGaps.length > 0 && <Card variant="subtle">
                    <h2 className="text-2xl font-extrabold tracking-tight mb-8">Skill Gaps Analysis</h2>
                    <div className="space-y-6">
                      {resumeData.skillGaps.map((gap: SkillGap, index: number) => <div key={index} className="rounded-lg p-5 border border-neutral-200 bg-white">
                          <h3 className="text-sm font-semibold tracking-wide uppercase mb-4">{gap.category}</h3>
                          <div className="mb-4">
                            <p className="text-neutral-500 text-xs uppercase tracking-wide mb-2">Missing Skills</p>
                            <div className="flex flex-wrap gap-2">
                              {gap.missing.map((skill: string, skillIndex: number) => <span key={skillIndex} className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-200 text-neutral-800">
                                  {skill}
                                </span>)}
                            </div>
                          </div>
                          <div>
                            <p className="text-neutral-500 text-xs uppercase tracking-wide mb-2">Recommendation</p>
                            <p className="text-neutral-700 text-sm leading-relaxed">{gap.recommendation}</p>
                          </div>
                        </div>)}
                    </div>
                  </Card>}
              </motion.div>}
            {activeTab === 'matches' && <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            duration: 0.5
          }}>
                <Card variant="subtle">
                  <h2 className="text-2xl font-extrabold tracking-tight mb-8">Job Matches</h2>
                  {roleMatches.length > 0 ? <div className="space-y-6">
                      {roleMatches.map((role: RoleMatch, index: number) => <div key={index} className="rounded-lg p-6 border border-neutral-200 bg-white hover:shadow-sm transition-all">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                            <div>
                              <h3 className="text-base font-semibold tracking-tight mb-1">{role.title}</h3>
                              <p className="text-neutral-600 text-sm">{role.company}</p>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center gap-4">
                              <div className="w-14 h-14 rounded-full border border-neutral-300 flex items-center justify-center bg-white">
                                <span className="text-lg font-extrabold tracking-tight">{role.matchScore}%</span>
                              </div>
                              <span className="text-neutral-500 text-xs uppercase tracking-wide">Match Score</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <p className="text-neutral-500 text-xs uppercase tracking-wide mb-2">Key Skill Matches</p>
                              <div className="flex flex-wrap gap-2">
                                {role.keySkillMatches?.map((skill: string, skillIndex: number) => <span key={skillIndex} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-200 text-neutral-800">
                                      {skill}
                                    </span>)}
                              </div>
                            </div>
                            <div>
                              <p className="text-neutral-500 text-xs uppercase tracking-wide mb-2">Missing Skills</p>
                              <div className="flex flex-wrap gap-2">
                                {role.missingSkills?.map((skill, skillIndex) => <span key={skillIndex} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 text-neutral-700 border border-neutral-300">
                                      {skill}
                                    </span>)}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-neutral-600 text-sm">{role.salary}</span>
                            <Button variant="outline" size="sm" onClick={() => navigate(`/role/${index}`)}>View Details</Button>
                          </div>
                        </div>)}
                    </div> : <p className="text-neutral-500 text-sm">No job matches available yet.</p>}
                </Card>
              </motion.div>}
            {activeTab === 'improvements' && <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            duration: 0.5
          }}>
                {improvementSuggestions.length > 0 ? <Card variant="subtle" className="mb-10">
                    <h2 className="text-2xl font-extrabold tracking-tight mb-8">Resume Improvement Suggestions</h2>
                    <div className="space-y-6">
                      {improvementSuggestions.map((suggestion: ImprovementSuggestion, index: number) => {
                        // Handle both string and object formats
                        const suggestionText = typeof suggestion === 'string' 
                          ? suggestion 
                          : suggestion?.suggestion || suggestion?.text || 'No suggestion available';
                        
                        return (
                          <div key={index} className="rounded-lg p-5 border border-neutral-200 bg-white">
                            <div className="flex items-start gap-4">
                              <div className="h-7 w-7 rounded-md border border-neutral-300 flex items-center justify-center text-[11px] font-semibold bg-neutral-50">{index + 1}</div>
                              <div className="flex-1 text-sm leading-relaxed text-neutral-700">
                                <p>{suggestionText}</p>
                                {typeof suggestion === 'object' && suggestion?.category && (
                                  <span className="text-[10px] tracking-wide uppercase text-neutral-500 mt-1 block">Category: {suggestion.category}</span>
                                )}
                                {typeof suggestion === 'object' && suggestion?.impact && (
                                  <span className="text-[10px] tracking-wide uppercase text-neutral-500 mt-1 block">Impact: {suggestion.impact}</span>
                                )}
                                {typeof suggestion === 'object' && suggestion?.difficulty && (
                                  <span className="text-[10px] tracking-wide uppercase text-neutral-500 mt-1 block">Difficulty: {suggestion.difficulty}</span>
                                )}
                                {typeof suggestion === 'object' && suggestion?.estimatedTime && (
                                  <span className="text-[10px] tracking-wide uppercase text-neutral-500 mt-1 block">Est. Time: {suggestion.estimatedTime}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card> : <Card variant="subtle" className="mb-10">
                    <h2 className="text-2xl font-extrabold tracking-tight mb-8">Resume Improvement Suggestions</h2>
                    <p className="text-neutral-500 text-sm">No improvement suggestions available yet.</p>
                  </Card>}
                <Card variant="muted" className="p-8">
                  <h2 className="text-2xl font-extrabold tracking-tight mb-8">Next Steps</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { title: 'Update Your Resume', body: 'Apply the prioritized improvements to elevate alignment & clarity.', action: () => { /* placeholder future edit handler */ }, label: 'Edit Resume' },
                      { title: 'Explore Job Matches', body: 'Review high-signal roles and refine target positioning.', action: () => setActiveTab('matches'), label: 'View Job Matches' },
                      { title: 'Address Skill Gaps', body: 'Select 1–2 strategic capability gaps to reinforce this week.', action: () => setActiveTab('skills'), label: 'View Skill Analysis' }
                    ].map((card, i) => (
                      <div key={i} className="rounded-lg border border-neutral-300 bg-white p-5 flex flex-col">
                        <h3 className="text-sm font-semibold tracking-wide uppercase mb-3">{card.title}</h3>
                        <p className="text-neutral-600 text-sm leading-relaxed flex-1 mb-4">{card.body}</p>
                        <Button variant={i===0 ? 'solid':'outline'} size="sm" onClick={card.action}>{card.label}</Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>}
          </div>
        </div>
        {/* Extended Intelligence Footer Section */}
        <div className="mt-24">
          <Card variant="subtle" className="p-10">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="text-3xl font-extrabold tracking-tight mb-4">Analytical Footnotes</h2>
              <p className="text-neutral-600 text-sm md:text-base leading-relaxed">All scoring dimensions are heuristic composites blending density, diversity and contextual alignment. Use them as directional guidance rather than absolute measures.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[{t:'Scoring Methodology',d:'Weighted blend of semantic alignment, impact phrasing and structural clarity signals.'},{t:'Data Handling',d:'Ephemeral in-memory processing—raw document content not persistently stored.'},{t:'Iteration Strategy',d:'Prioritize high-yield clarity & alignment adjustments before expanding breadth.'}].map(item=> (
                <div key={item.t} className="rounded-lg border border-neutral-200 bg-white p-6">
                  <h3 className="text-sm font-semibold tracking-wide uppercase mb-3">{item.t}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Container>
    </PageLayout>;
};
export default Results;