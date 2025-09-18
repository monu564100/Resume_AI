import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageLayout } from '../components/layout/PageLayout';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useResume } from '../context/ResumeContext';

const CircleScore: React.FC<{ score: number }> = ({ score }) => {
  const size = 160;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <svg width={size} height={size} className="block">
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="#222" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="var(--primary)"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="text-3xl font-bold">
        {score}
      </text>
    </svg>
  );
};

const Analyze: React.FC = () => {
  const navigate = useNavigate();
  const { resumeData, isLoading } = useResume();

  useEffect(() => {
    if (!resumeData && !isLoading) {
      navigate('/upload');
    }
  }, [resumeData, isLoading, navigate]);

  if (!resumeData) return null;

  const {
    overallScore = 0,
    atsScore = {},
    skillGaps = [],
    improvementSuggestions = [],
    keywords = [],
    roleMatches = [],
    jobMatches = [],
    careerAnalysis = {},
    overallFeedback = '',
    courseSuggestions = []
  } = resumeData || {};

  // Use atsScore if available, otherwise fallback to legacy format
  const scoreBreakdown = atsScore?.breakdown || resumeData?.scoreBreakdown || {};
  const displayScore = atsScore?.overall || overallScore || 0;

  return (
    <PageLayout>
      <Container className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card variant="glassDark" className="flex flex-col items-center justify-center p-8">
            <h2 className="text-xl font-semibold mb-4">ATS Score</h2>
            <CircleScore score={displayScore} />
            <div className="mt-6 w-full">
              {Object.keys(scoreBreakdown).length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(scoreBreakdown).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between bg-black/20 rounded-md px-3 py-2">
                      <span className="text-gray-300 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-semibold">{v as number}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Career Analysis Section */}
            {careerAnalysis && Object.keys(careerAnalysis).length > 0 && (
              <div className="mt-6 w-full">
                <h3 className="text-lg font-semibold mb-3">Career Analysis</h3>
                <div className="space-y-2 text-sm">
                  {careerAnalysis.experienceLevel && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Experience:</span>
                      <span className="capitalize">{careerAnalysis.experienceLevel}</span>
                    </div>
                  )}
                  {careerAnalysis.salaryRange && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Salary Range:</span>
                      <span>{careerAnalysis.salaryRange}</span>
                    </div>
                  )}
                  {careerAnalysis.marketDemand && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Market Demand:</span>
                      <span className="capitalize">{careerAnalysis.marketDemand}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>

          <div className="lg:col-span-2 space-y-8">
            <Card variant="glass">
              <h2 className="text-2xl font-bold mb-4">Job Matches</h2>
              <div className="space-y-4">
                {(jobMatches.length > 0 ? jobMatches : roleMatches).slice(0, 3).map((role: any, idx: number) => (
                  <div key={idx} className="bg-dark-50 rounded-lg p-4 flex items-start justify-between">
                    <div>
                      <p className="text-lg font-semibold">{role.title}</p>
                      <p className="text-gray-400 text-sm">{role.company && `${role.company} • `}{role.location || ''}</p>
                      <p className="text-gray-400 text-sm">Key matches: {role.keySkillMatches?.join(', ') || '—'}</p>
                      {role.salary && <p className="text-green-400 text-sm">{role.salary}</p>}
                    </div>
                    <span className="bg-primary-500/20 text-primary px-2 py-1 rounded-md text-sm font-medium">{role.matchScore}%</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card variant="glass">
              <h2 className="text-2xl font-bold mb-4">Missing Skills & Recommendations</h2>
              <div className="space-y-6">
                {skillGaps.length > 0 ? (
                  skillGaps.map((gap: any, idx: number) => (
                    <div key={idx} className="bg-dark-50 rounded-lg p-4">
                      <p className="font-semibold mb-2">{gap.category}</p>
                      <p className="text-gray-400 mb-1 text-sm">Missing: {gap.missing?.join(', ') || '—'}</p>
                      <p className="text-gray-300">{gap.recommendation}</p>
                      {gap.priority && (
                        <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                          gap.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          gap.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {gap.priority} priority
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No major skill gaps detected.</p>
                )}
              </div>
            </Card>

            {/* Improvement Suggestions */}
            {improvementSuggestions.length > 0 && (
              <Card variant="glass">
                <h2 className="text-2xl font-bold mb-4">Improvement Suggestions</h2>
                <div className="space-y-4">
                  {improvementSuggestions.map((suggestion: any, idx: number) => (
                    <div key={idx} className="bg-dark-50 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold capitalize">{suggestion.category}</p>
                          <p className="text-gray-300 mt-1">{suggestion.suggestion}</p>
                          {suggestion.estimatedTime && (
                            <p className="text-gray-400 text-sm mt-2">Time: {suggestion.estimatedTime}</p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <span className={`px-2 py-1 text-xs rounded ${
                            suggestion.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                            suggestion.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {suggestion.impact} impact
                          </span>
                          <span className={`px-2 py-1 text-xs rounded ${
                            suggestion.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' :
                            suggestion.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {suggestion.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Overall Feedback */}
            {overallFeedback && (
              <Card variant="glass">
                <h2 className="text-2xl font-bold mb-4">Overall Feedback</h2>
                <p className="text-gray-300 leading-relaxed">{overallFeedback}</p>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card variant="glass">
                <h2 className="text-2xl font-bold mb-4">Course Suggestions</h2>
                <div className="space-y-3">
                  {(courseSuggestions.length > 0 ? courseSuggestions : resumeData.courseSuggestions || []).map((c: any, idx: number) => (
                    <a key={idx} href={c.url} target="_blank" rel="noreferrer" className="block p-3 rounded-md bg-dark-50 hover:bg-dark-100 transition-colors">
                      <p className="font-semibold">{c.title}</p>
                      <p className="text-gray-400 text-sm">{c.skill}</p>
                      {c.provider && <p className="text-gray-500 text-xs">{c.provider}</p>}
                      {c.duration && <p className="text-gray-500 text-xs">Duration: {c.duration}</p>}
                    </a>
                  ))}
                </div>
              </Card>
              <Card variant="glass">
                <h2 className="text-2xl font-bold mb-4">Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((k: string, idx: number) => (
                    <span key={idx} className="bg-dark-100 text-gray-300 px-3 py-1 rounded-full text-sm">{k}</span>
                  ))}
                </div>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
            </div>
          </div>
        </div>
      </Container>
    </PageLayout>
  );
};

export default Analyze;