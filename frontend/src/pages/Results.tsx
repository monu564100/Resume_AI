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
    return <PageLayout>
        <Container className="py-12">
          <Card variant="glass" className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Resume Analysis Required
            </h2>
            <p className="text-gray-300 mb-6">
              Your resume "{resumeData.fileName}" has been uploaded
              successfully.
              {isDemoMode ? ' Demo data should be available.' : ' Please analyze it to see detailed results.'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="primary" onClick={() => navigate('/upload')}>
                Analyze Resume
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
          </Card>
        </Container>
      </PageLayout>;
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
      <Container className="py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <Card variant="glassDark" className="sticky top-24">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center mr-4">
                  <FileTextIcon className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{personalInfo.name}</h2>
                  <p className="text-gray-400 text-sm">{personalInfo.email}</p>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Overall Score</span>
                  <span className="text-xl font-bold text-primary">
                    {overallScore}/100
                  </span>
                </div>
                <div className="w-full bg-dark-100 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{
                  width: `${overallScore}%`
                }}></div>
                </div>
              </div>
              {Object.keys(scoreBreakdown).length > 0 && <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">
                    Score Breakdown
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(scoreBreakdown).map(([key, value]) => <div key={key} className="flex justify-between items-center">
                        <span className="text-gray-300 capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </span>
                        <span className="font-medium">{value}/100</span>
                      </div>)}
                  </div>
                </div>}
              <div>
                <h3 className="text-lg font-semibold mb-3">Navigation</h3>
                <div className="space-y-2">
                  {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full text-left px-3 py-2 rounded-md flex items-center transition-colors ${activeTab === tab.id ? 'bg-primary-500/20 text-primary' : 'hover:bg-dark-100 text-gray-300'}`}>
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>)}
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
                <Card variant="glass" className="mb-8">
                  <h2 className="text-2xl font-bold mb-6">Resume Overview</h2>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Name</p>
                        <p className="font-medium">{personalInfo.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Email</p>
                        <p className="font-medium">{personalInfo.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Phone</p>
                        <p className="font-medium">
                          {personalInfo.phone || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Location</p>
                        <p className="font-medium">
                          {personalInfo.location || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                  {resumeData.summary && <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">Summary</h3>
                      <p className="text-gray-300">{resumeData.summary}</p>
                    </div>}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Key Skills</h3>
                    {skills.length > 0 ? <div className="flex flex-wrap gap-2">
                        {skills.slice(0, 8).map((skill, index) => <span key={index} className="bg-dark-100 text-gray-300 px-3 py-1 rounded-full text-sm">
                            {typeof skill === 'string' ? skill : skill.name}
                          </span>)}
                      </div> : <p className="text-gray-400">No skills identified yet.</p>}
                  </div>
                </Card>
                {roleMatches.length > 0 && <Card variant="glass" className="mb-8">
                    <h2 className="text-2xl font-bold mb-6">
                      Top Career Matches
                    </h2>
                    <div className="space-y-4">
                      {roleMatches.slice(0, 3).map((role, index) => <div key={index} className="bg-dark-50 rounded-lg p-4 hover:bg-dark-100 transition-colors">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">
                              {role.title}
                            </h3>
                            <span className="bg-primary-500/20 text-primary px-2 py-1 rounded-md text-sm font-medium">
                              {role.matchScore}% Match
                            </span>
                          </div>
                          <p className="text-gray-400 mb-2">{role.company}</p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {role.keySkillMatches?.map((skill, skillIndex) => <span key={skillIndex} className="bg-secondary-500/20 text-secondary-300 px-2 py-0.5 rounded-full text-xs">
                                {skill}
                              </span>)}
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-gray-400 text-sm">
                              {role.salary}
                            </span>
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/role/${index}`)} className="flex items-center">
                              View Details
                              <ChevronRightIcon size={16} className="ml-1" />
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
                {improvementSuggestions.length > 0 && <Card variant="glass">
                    <h2 className="text-2xl font-bold mb-6">
                      Improvement Suggestions
                    </h2>
                    <div className="space-y-3">
                      {improvementSuggestions.map((suggestion, index) => {
                        // Handle both string and object formats
                        const suggestionText = typeof suggestion === 'string' 
                          ? suggestion 
                          : suggestion?.suggestion || suggestion?.text || 'No suggestion available';
                        
                        return (
                          <div key={index} className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-secondary-500/20 flex items-center justify-center mr-3 mt-0.5">
                              <span className="text-secondary-300 text-xs font-bold">
                                {index + 1}
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-300">{suggestionText}</p>
                              {typeof suggestion === 'object' && suggestion?.category && (
                                <span className="text-xs text-gray-400 mt-1 block">
                                  Category: {suggestion.category}
                                </span>
                              )}
                              {typeof suggestion === 'object' && suggestion?.impact && (
                                <span className="text-xs text-secondary-400 mt-1 block">
                                  Impact: {suggestion.impact}
                                </span>
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
                <Card variant="glass" className="mb-8">
                  <h2 className="text-2xl font-bold mb-6">Skills Analysis</h2>
                  {skills.length > 0 ? <div className="space-y-6">
                      {['Programming', 'Framework', 'Backend', 'Frontend', 'Database', 'DevOps', 'Cloud', 'Other'].map(category => {
                  const categorySkills = skills.filter(skill => typeof skill === 'object' && skill.category === category);
                  if (categorySkills.length === 0) return null;
                  return <div key={category}>
                            <h3 className="text-lg font-semibold mb-4">
                              {category}
                            </h3>
                            <div className="space-y-4">
                              {categorySkills.map((skill, index) => <div key={index} className="space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-gray-300">
                                      {skill.name}
                                    </span>
                                    <span className="text-gray-400">
                                      {skill.level}/100
                                    </span>
                                  </div>
                                  <div className="w-full bg-dark-100 rounded-full h-2">
                                    <div className={`h-2 rounded-full ${skill.level >= 80 ? 'bg-primary' : skill.level >= 60 ? 'bg-green-500' : skill.level >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{
                            width: `${skill.level}%`
                          }}></div>
                                  </div>
                                </div>)}
                            </div>
                          </div>;
                })}
                    </div> : <p className="text-gray-400">
                      No skills analysis available yet.
                    </p>}
                </Card>
                {resumeData.skillGaps && resumeData.skillGaps.length > 0 && <Card variant="glass">
                    <h2 className="text-2xl font-bold mb-6">
                      Skill Gaps Analysis
                    </h2>
                    <div className="space-y-6">
                      {resumeData.skillGaps.map((gap, index) => <div key={index} className="bg-dark-50 rounded-lg p-4">
                          <h3 className="text-lg font-semibold mb-3">
                            {gap.category}
                          </h3>
                          <div className="mb-4">
                            <p className="text-gray-400 mb-2">
                              Missing Skills:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {gap.missing.map((skill, skillIndex) => <span key={skillIndex} className="bg-dark-100 text-gray-300 px-3 py-1 rounded-full text-sm">
                                  {skill}
                                </span>)}
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-400 mb-2">
                              Recommendation:
                            </p>
                            <p className="text-gray-300">
                              {gap.recommendation}
                            </p>
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
                <Card variant="glass">
                  <h2 className="text-2xl font-bold mb-6">Job Matches</h2>
                  {roleMatches.length > 0 ? <div className="space-y-6">
                      {roleMatches.map((role, index) => <div key={index} className="bg-dark-50 rounded-lg p-4 hover:bg-dark-100 transition-colors">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">
                                {role.title}
                              </h3>
                              <p className="text-gray-400">{role.company}</p>
                            </div>
                            <div className="mt-2 md:mt-0 flex items-center">
                              <div className="w-16 h-16 rounded-full bg-dark-300 flex items-center justify-center mr-3">
                                <span className="text-xl font-bold text-primary">
                                  {role.matchScore}%
                                </span>
                              </div>
                              <span className="text-gray-300">Match Score</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-gray-400 mb-2">
                                Key Skill Matches:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {role.keySkillMatches?.map((skill, skillIndex) => <span key={skillIndex} className="bg-secondary-500/20 text-secondary-300 px-2 py-0.5 rounded-full text-xs">
                                      {skill}
                                    </span>)}
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-400 mb-2">
                                Missing Skills:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {role.missingSkills?.map((skill, skillIndex) => <span key={skillIndex} className="bg-dark-100 text-gray-300 px-2 py-0.5 rounded-full text-xs">
                                      {skill}
                                    </span>)}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">{role.salary}</span>
                            <Button variant="outline" size="sm" onClick={() => navigate(`/role/${index}`)}>
                              View Details
                            </Button>
                          </div>
                        </div>)}
                    </div> : <p className="text-gray-400">
                      No job matches available yet.
                    </p>}
                </Card>
              </motion.div>}
            {activeTab === 'improvements' && <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            duration: 0.5
          }}>
                {improvementSuggestions.length > 0 ? <Card variant="glass" className="mb-8">
                    <h2 className="text-2xl font-bold mb-6">
                      Resume Improvement Suggestions
                    </h2>
                    <div className="space-y-6">
                      {improvementSuggestions.map((suggestion: any, index: number) => {
                        // Handle both string and object formats
                        const suggestionText = typeof suggestion === 'string' 
                          ? suggestion 
                          : suggestion?.suggestion || suggestion?.text || 'No suggestion available';
                        
                        return (
                          <div key={index} className="bg-dark-50 rounded-lg p-4">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-secondary-500/20 flex items-center justify-center mr-4">
                                <span className="text-secondary-300 font-bold">
                                  {index + 1}
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-300">{suggestionText}</p>
                                {typeof suggestion === 'object' && suggestion?.category && (
                                  <span className="text-xs text-gray-400 mt-1 block">
                                    Category: {suggestion.category}
                                  </span>
                                )}
                                {typeof suggestion === 'object' && suggestion?.impact && (
                                  <span className="text-xs text-secondary-400 mt-1 block">
                                    Impact: {suggestion.impact}
                                  </span>
                                )}
                                {typeof suggestion === 'object' && suggestion?.difficulty && (
                                  <span className="text-xs text-gray-500 mt-1 block">
                                    Difficulty: {suggestion.difficulty}
                                  </span>
                                )}
                                {typeof suggestion === 'object' && suggestion?.estimatedTime && (
                                  <span className="text-xs text-gray-500 mt-1 block">
                                    Est. Time: {suggestion.estimatedTime}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card> : <Card variant="glass" className="mb-8">
                    <h2 className="text-2xl font-bold mb-6">
                      Resume Improvement Suggestions
                    </h2>
                    <p className="text-gray-400">
                      No improvement suggestions available yet.
                    </p>
                  </Card>}
                <Card variant="glass">
                  <h2 className="text-2xl font-bold mb-6">Next Steps</h2>
                  <div className="space-y-4">
                    <div className="bg-dark-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-2">
                        Update Your Resume
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Apply the suggested improvements to your resume to
                        increase your match scores and stand out to employers.
                      </p>
                      <Button variant="primary">Edit Resume</Button>
                    </div>
                    <div className="bg-dark-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-2">
                        Explore Job Matches
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Review your job matches and learn more about the roles
                        that best fit your skills and experience.
                      </p>
                      <Button variant="outline" onClick={() => setActiveTab('matches')}>
                        View Job Matches
                      </Button>
                    </div>
                    <div className="bg-dark-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-2">
                        Address Skill Gaps
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Consider learning new skills or improving existing ones
                        to increase your competitiveness in the job market.
                      </p>
                      <Button variant="outline" onClick={() => setActiveTab('skills')}>
                        View Skill Analysis
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>}
          </div>
        </div>
      </Container>
    </PageLayout>;
};
export default Results;