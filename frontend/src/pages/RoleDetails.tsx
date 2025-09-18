import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageLayout } from '../components/layout/PageLayout';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useResume } from '../context/ResumeContext';
import { ArrowLeftIcon, BriefcaseIcon, CheckCircleIcon, XCircleIcon, TrendingUpIcon } from 'lucide-react';

interface RoleMatch {
  title: string;
  company: string;
  matchScore: number;
  keySkillMatches: string[];
  missingSkills: string[];
  salary: string;
}
const RoleDetails: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const {
    resumeData
  } = useResume();
  if (!resumeData || !id) {
    navigate('/upload');
    return null;
  }
  const roleIndex = parseInt(id);
  const role = resumeData.roleMatches[roleIndex] as RoleMatch;
  if (!role) {
    navigate('/results');
    return null;
  }
  // Find skills from resume that match the role
  // Primary match score reference
  const matchPercentage = role.matchScore;
  return <PageLayout>
      <Container className="py-14">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }}>
          <div className="mb-10 flex flex-wrap items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/results')} className="gap-2">
              <ArrowLeftIcon size={16} />
              Back
            </Button>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-100 border border-neutral-300 text-[11px] font-semibold tracking-wide uppercase">Role Intelligence</div>
          </div>
          <div className="flex flex-col md:flex-row gap-10">
            {/* Main Content */}
            <div className="w-full md:w-2/3">
              <Card variant="subtle" className="mb-10 p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
                  <div className="flex items-start gap-5">
                    <div className="h-14 w-14 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
                      <BriefcaseIcon />
                    </div>
                    <div>
                      <h1 className="text-3xl font-extrabold tracking-tight mb-2">{role.title}</h1>
                      <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wide font-medium mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-neutral-900 text-white">{matchPercentage}% Match</span>
                        <span className="px-2 py-0.5 rounded-md bg-neutral-200 text-neutral-800">{role.company}</span>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-neutral-300 text-neutral-800">Indexed</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] uppercase tracking-wide text-neutral-500 mb-2">Signal Distribution</div>
                    <div className="flex items-center gap-1">
                      {[0,1,2,3,4].map(i => <span key={i} className={`h-2 w-8 rounded-sm ${i < Math.round(matchPercentage/20) ? 'bg-black' : 'bg-neutral-200'}`} />)}
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-10 mb-12">
                  <div>
                    <h2 className="text-sm font-semibold tracking-wide uppercase mb-4">Role Overview</h2>
                    <p className="text-neutral-600 text-sm leading-relaxed">This {role.title} position at {role.company} aligns strongly with your current capability graph. Weighted skill correlation indicates {matchPercentage}% relevance. Closing residual gap increases senior track optionality.</p>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold tracking-wide uppercase mb-4">Salary Band</h2>
                    <div className="rounded-lg border border-neutral-200 bg-white p-5 flex items-center justify-between">
                      <span className="text-2xl font-extrabold tracking-tight">{role.salary}</span>
                      <span className="text-[10px] uppercase tracking-wide text-neutral-500">Indicative</span>
                    </div>
                  </div>
                </div>
                <div className="mb-12">
                  <h2 className="text-sm font-semibold tracking-wide uppercase mb-5">Match Composition</h2>
                  <div className="mb-6">
                    <div className="flex justify-between text-[11px] uppercase tracking-wide text-neutral-500 mb-2">
                      <span>Match Score</span>
                      <span>{matchPercentage}%</span>
                    </div>
                    <div className="h-3 w-full bg-neutral-200 rounded-full overflow-hidden">
                      <div className="h-full bg-black" style={{ width: `${matchPercentage}%` }} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xs font-semibold tracking-wide uppercase mb-3 flex items-center gap-2"><CheckCircleIcon size={16} /> Matching Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {role.keySkillMatches.map((skill: string, index: number) => <span key={index} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-200 text-neutral-800">{skill}</span>)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold tracking-wide uppercase mb-3 flex items-center gap-2"><XCircleIcon size={16} /> Missing Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {role.missingSkills.map((skill: string, index: number) => <span key={index} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 border border-neutral-300 text-neutral-700">{skill}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-sm font-semibold tracking-wide uppercase mb-6">Strategic Elevation</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="rounded-lg border border-neutral-200 bg-white p-5">
                      <h3 className="text-xs font-semibold tracking-wide uppercase mb-3 flex items-center gap-2"><TrendingUpIcon size={14} /> Skill Development Plan</h3>
                      <p className="text-neutral-600 text-sm leading-relaxed mb-4">Focus sequence accelerates delta closure. Prioritize foundational before peripheral capabilities.</p>
                      <ul className="space-y-3">
                        {role.missingSkills.map((skill: string, index: number) => <li key={index} className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
                            <p className="font-medium text-sm mb-1">{skill}</p>
                            <p className="text-neutral-600 text-xs leading-relaxed">{index === 0 ? `Acquiring ${skill} materially uplifts your near-term alignment score.` : `Integrating ${skill} broadens adjacent role access.`}</p>
                          </li>)}
                      </ul>
                    </div>
                    <div className="rounded-lg border border-neutral-200 bg-white p-5">
                      <h3 className="text-xs font-semibold tracking-wide uppercase mb-3">Resume Tailoring</h3>
                      <p className="text-neutral-600 text-sm leading-relaxed mb-4">Precision framing increases screening throughput. Anchor bullets with quant impact before tool listing.</p>
                      <ul className="space-y-2 text-neutral-700 text-sm">
                        <li className="flex gap-2"><span className="h-1.5 w-1.5 rounded-full bg-black mt-2" /> Emphasize experience with {role.keySkillMatches.slice(0,3).join(', ')}</li>
                        <li className="flex gap-2"><span className="h-1.5 w-1.5 rounded-full bg-black mt-2" /> Quantify achievement deltas (before/after metrics)</li>
                        <li className="flex gap-2"><span className="h-1.5 w-1.5 rounded-full bg-black mt-2" /> Showcase depth project leveraging {role.keySkillMatches[0]}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
              <Card variant="subtle" className="p-8">
                <h2 className="text-sm font-semibold tracking-wide uppercase mb-6">Application Sequencing</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {[{ h: 'Immediate Targets', d: 'High alignment (>80%) roles—submit within 24h while momentum is high.' }, { h: 'Mid-Band Roles', d: 'Iterate resume phrasing first; submit after one refinement cycle.' }, { h: 'Stretch Roles', d: 'Bridge one core missing capability before outreach.' }].map(item => <div key={item.h} className="rounded-lg border border-neutral-200 bg-white p-5">
                      <h3 className="text-xs font-semibold tracking-wide uppercase mb-2">{item.h}</h3>
                      <p className="text-neutral-600 text-sm leading-relaxed">{item.d}</p>
                    </div>)}
                </div>
              </Card>
            </div>
            {/* Sidebar */}
            <div className="w-full md:w-1/3">
              <Card variant="muted" className="sticky top-24 p-6">
                <h2 className="text-sm font-semibold tracking-wide uppercase mb-4">Apply Decision</h2>
                <p className="text-neutral-600 text-sm leading-relaxed mb-6">Ready to advance this opportunity? Initiate tailored submission or park for strategic sequencing.</p>
                <div className="space-y-3 mb-8">
                  <Button variant="solid" fullWidth size="sm">Apply Now</Button>
                  <Button variant="outline" fullWidth size="sm">Save for Later</Button>
                </div>
                <div className="pt-6 border-t border-neutral-300">
                  <h3 className="text-xs font-semibold tracking-wide uppercase mb-4 text-neutral-600">Similar Roles</h3>
                  <div className="space-y-4">
                    {resumeData.roleMatches.filter((_: RoleMatch, idx: number) => idx !== roleIndex).slice(0, 3).map((similarRole: RoleMatch, index: number) => <div key={index} className="rounded-lg border border-neutral-200 bg-white p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-sm mb-1">{similarRole.title}</h4>
                            <p className="text-neutral-600 text-xs">{similarRole.company}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-neutral-900 text-white text-[10px] font-medium">{similarRole.matchScore}%</span>
                        </div>
                        <Button variant="outline" size="sm" fullWidth className="mt-2" onClick={() => navigate(`/role/${resumeData.roleMatches.indexOf(similarRole)}`)}>View</Button>
                      </div>)}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </Container>
    </PageLayout>;
};
export default RoleDetails;