import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageLayout } from '../components/layout/PageLayout';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useResume } from '../context/ResumeContext';
import { ArrowLeftIcon, BriefcaseIcon, CheckCircleIcon, XCircleIcon, TrendingUpIcon } from 'lucide-react';
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
  const role = resumeData.roleMatches[roleIndex];
  if (!role) {
    navigate('/results');
    return null;
  }
  // Find skills from resume that match the role
  const matchedSkills = resumeData.skills.filter(skill => role.keySkillMatches.includes(skill.name));
  // Calculate percentages for visualization
  const matchPercentage = role.matchScore;
  const missingPercentage = 100 - matchPercentage;
  return <PageLayout>
      <Container className="py-12">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }}>
          <Button variant="ghost" size="sm" onClick={() => navigate('/results')} className="mb-6 flex items-center">
            <ArrowLeftIcon size={16} className="mr-2" />
            Back to Results
          </Button>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Main Content */}
            <div className="w-full md:w-2/3">
              <Card variant="glass" className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center mr-4">
                    <BriefcaseIcon className="text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{role.title}</h1>
                    <p className="text-gray-400">{role.company}</p>
                  </div>
                </div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">Role Overview</h2>
                  <p className="text-gray-300">
                    This {role.title} position at {role.company} is a great
                    match for your skills and experience. Based on our analysis,
                    you have {matchPercentage}% of the required skills for this
                    role.
                  </p>
                </div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">Salary Range</h2>
                  <div className="bg-dark-50 p-4 rounded-lg">
                    <span className="text-2xl font-bold text-primary">
                      {role.salary}
                    </span>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Match Visualization
                  </h2>
                  <div className="bg-dark-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Match Score</span>
                      <span className="font-medium">{matchPercentage}%</span>
                    </div>
                    <div className="w-full h-4 bg-dark-300 rounded-full overflow-hidden mb-6">
                      <div className="h-full bg-primary" style={{
                      width: `${matchPercentage}%`
                    }}></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                          <CheckCircleIcon size={18} className="text-primary mr-2" />
                          Your Matching Skills
                        </h3>
                        <ul className="space-y-2">
                          {role.keySkillMatches.map((skill, index) => <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                              <span className="text-gray-300">{skill}</span>
                            </li>)}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                          <XCircleIcon size={18} className="text-gray-400 mr-2" />
                          Missing Skills
                        </h3>
                        <ul className="space-y-2">
                          {role.missingSkills.map((skill, index) => <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                              <span className="text-gray-300">{skill}</span>
                            </li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              <Card variant="glass">
                <h2 className="text-xl font-semibold mb-4">
                  How to Improve Your Match
                </h2>
                <div className="space-y-6">
                  <div className="bg-dark-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <TrendingUpIcon size={18} className="text-secondary mr-2" />
                      Skill Development Plan
                    </h3>
                    <p className="text-gray-300 mb-4">
                      To increase your match score for this role, focus on
                      developing these key skills:
                    </p>
                    <ul className="space-y-3">
                      {role.missingSkills.map((skill, index) => <li key={index} className="bg-dark-100 p-3 rounded-lg">
                          <p className="font-medium text-gray-200 mb-1">
                            {skill}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {index === 0 ? `Learning ${skill} would significantly increase your match score for this role and similar positions.` : `Adding ${skill} to your skillset will make you more competitive for this position.`}
                          </p>
                        </li>)}
                    </ul>
                  </div>
                  <div className="bg-dark-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">
                      Resume Tailoring Tips
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Customize your resume for this specific role by
                      highlighting these aspects:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-secondary rounded-full mr-2 mt-2"></span>
                        <span className="text-gray-300">
                          Emphasize your experience with{' '}
                          {role.keySkillMatches.slice(0, 3).join(', ')}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-secondary rounded-full mr-2 mt-2"></span>
                        <span className="text-gray-300">
                          Quantify your achievements related to these skills
                          with specific metrics
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-secondary rounded-full mr-2 mt-2"></span>
                        <span className="text-gray-300">
                          Include relevant projects that showcase your expertise
                          in {role.keySkillMatches[0]}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
            {/* Sidebar */}
            <div className="w-full md:w-1/3">
              <Card variant="glassDark" className="sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Apply Now</h2>
                <p className="text-gray-300 mb-6">
                  Ready to apply for this {role.title} position at{' '}
                  {role.company}?
                </p>
                <Button variant="primary" fullWidth className="mb-4">
                  Apply for This Position
                </Button>
                <Button variant="outline" fullWidth>
                  Save for Later
                </Button>
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">Similar Roles</h3>
                  <div className="space-y-4">
                    {resumeData.roleMatches.filter((_, idx) => idx !== roleIndex).slice(0, 3).map((similarRole, index) => <div key={index} className="bg-dark-100 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">
                                {similarRole.title}
                              </h4>
                              <p className="text-gray-400 text-sm">
                                {similarRole.company}
                              </p>
                            </div>
                            <span className="text-primary font-medium">
                              {similarRole.matchScore}%
                            </span>
                          </div>
                          <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={() => navigate(`/role/${resumeData.roleMatches.indexOf(similarRole)}`)}>
                            View Details
                          </Button>
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