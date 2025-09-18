import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageLayout } from '../components/layout/PageLayout';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { BriefcaseIcon, SearchIcon, MapPinIcon, DollarSignIcon, FilterIcon, CheckIcon, XIcon, ArrowRightIcon, Loader2Icon, ExternalLinkIcon, BarChart3Icon } from 'lucide-react';

interface JobListing {
  title: string;
  company: string;
  location: string;
  salary: string;
  description?: string;
  url?: string;
  postedDate?: string;
  jobType?: string;
  requirements?: string[];
  benefits?: string[];
  matchScore?: number;
  keySkillMatches?: string[];
  missingSkills?: string[];
  type?: string;
  linkedinUrl?: string;
  isRealJob?: boolean;
  remote?: boolean;
  skillsMatched?: number;
  totalUserSkills?: number;
  matchQuality?: 'High' | 'Medium' | 'Low';
}

interface UserSkill {
  name: string;
  level: string;
  category: string;
  experienceYears: number;
}

interface MatchingStats {
  totalJobs: number;
  highMatches: number;
  mediumMatches: number;
  lowMatches: number;
  averageScore: number;
}

export const Careers: React.FC = () => {
  const navigate = useNavigate();
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [matchingStats, setMatchingStats] = useState<MatchingStats | null>(null);
  const [filters, setFilters] = useState({
    minMatch: 0,
    location: '',
    showRemote: false
  });

  // Fetch real job matches from backend
  useEffect(() => {
    const fetchJobMatches = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view job matches');
          setIsLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/analysis/jobs/current', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError('No resume analysis found. Please upload and analyze your resume first.');
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        if (data.success && data.data?.jobMatches) {
          setJobListings(data.data.jobMatches);
          
          // Set user skills if available
          if (data.data.userSkills) {
            setUserSkills(data.data.userSkills);
          }
          
          // Set matching statistics if available
          if (data.data.matchingStats) {
            setMatchingStats(data.data.matchingStats);
          }
          
          console.log(`📊 Loaded ${data.data.jobMatches.length} jobs with skill matching`);
        } else {
          setError('No job matches found');
        }
      } catch (err) {
        console.error('Failed to fetch job matches:', err);
        setError('Failed to load job matches. Please try again.');
        // Set fallback jobs
        setJobListings(getFallbackJobs());
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobMatches();
  }, []);

  // Fallback job data for when backend is unavailable
  const getFallbackJobs = (): JobListing[] => [
    {
      title: 'Senior Software Engineer',
      company: 'Tech Innovations Ltd',
      matchScore: 85,
      keySkillMatches: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
      missingSkills: ['Docker', 'Kubernetes'],
      salary: '$120,000 - $150,000',
      location: 'Bangalore, India',
      type: 'Full-time',
      remote: true,
      description: 'Join our dynamic team building innovative solutions...',
      postedDate: new Date().toISOString(),
      jobType: 'Full-time'
    },
    {
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      matchScore: 78,
      keySkillMatches: ['Python', 'Django', 'React', 'PostgreSQL'],
      missingSkills: ['AWS', 'Redis'],
      salary: '$90,000 - $120,000',
      location: 'Hyderabad, India',
      type: 'Full-time',
      remote: false,
      description: 'Build scalable web applications in a fast-paced startup environment...',
      postedDate: new Date().toISOString(),
      jobType: 'Full-time'
    },
    {
      title: 'Frontend Developer',
      company: 'Digital Solutions Inc',
      matchScore: 92,
      keySkillMatches: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
      missingSkills: ['GraphQL'],
      salary: '$80,000 - $110,000',
      location: 'Mumbai, India',
      type: 'Full-time',
      remote: true,
      description: 'Create beautiful, responsive user interfaces...',
      postedDate: new Date().toISOString(),
      jobType: 'Full-time'
    }
  ];

  // Filter jobs based on search term and filters
  const filteredJobs = jobListings.filter((job: JobListing) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !filters.location || 
                           job.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesRemote = !filters.showRemote || job.remote;
    const matchesScore = (job.matchScore || 0) >= filters.minMatch;
    
    return matchesSearch && matchesLocation && matchesRemote && matchesScore;
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-neutral-100 border border-neutral-300 mb-6">
                <span className="h-2 w-2 rounded-full bg-black" />
                <span className="text-xs font-semibold tracking-wider">OPPORTUNITY INTELLIGENCE</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">Career Opportunities</h1>
              <p className="text-neutral-600 text-sm md:text-base max-w-2xl leading-relaxed">Role alignment snapshots derived from your current profile signals. Filter and prioritize for focused application sequencing.</p>
            </div>
            <div>
              <Button variant="outline" onClick={() => navigate('/dashboard')} size="sm">Back to Dashboard</Button>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Filters */}
            <div className="w-full lg:w-1/4">
              <Card variant="muted" className="sticky top-24 p-6">
                <h2 className="text-sm font-semibold tracking-wide uppercase mb-5 flex items-center gap-2">
                  <FilterIcon size={16} /> Filters
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="search" className="block text-xs font-semibold tracking-wide uppercase text-neutral-600 mb-2">Search Jobs</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                        <SearchIcon size={16} />
                      </div>
                      <input type="text" id="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-white border border-neutral-300 text-black rounded-lg block w-full pl-10 pr-3 py-2 placeholder-neutral-400 focus:ring-2 focus:ring-black/30 focus:border-black" placeholder="Job title or keyword" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="minMatch" className="block text-xs font-semibold tracking-wide uppercase text-neutral-600 mb-2">Min Match Score: {filters.minMatch}%</label>
                    <input type="range" id="minMatch" name="minMatch" min="0" max="100" value={filters.minMatch} onChange={handleFilterChange} className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-xs font-semibold tracking-wide uppercase text-neutral-600 mb-2">Location</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                        <MapPinIcon size={16} />
                      </div>
                      <input type="text" id="location" name="location" value={filters.location} onChange={handleFilterChange} className="bg-white border border-neutral-300 text-black rounded-lg block w-full pl-10 pr-3 py-2 placeholder-neutral-400 focus:ring-2 focus:ring-black/30 focus:border-black" placeholder="City, state, or country" />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="showRemote" name="showRemote" checked={filters.showRemote} onChange={handleFilterChange} className="w-4 h-4 bg-white border-neutral-400 rounded focus:ring-2 focus:ring-black" />
                    <label htmlFor="showRemote" className="ml-2 text-xs font-medium text-neutral-600">Remote Only</label>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-neutral-300">
                  <h3 className="text-xs font-semibold tracking-wide uppercase text-neutral-600 mb-4">Match Legend</h3>
                  <div className="space-y-3 text-[10px] tracking-wide uppercase text-neutral-600">
                    {[
                      { label: '90-100 Excellent', tone: 'bg-black text-white' },
                      { label: '75-89 Strong', tone: 'bg-neutral-800 text-white' },
                      { label: '60-74 Moderate', tone: 'bg-neutral-400 text-white' },
                      { label: 'Below 60 Low', tone: 'bg-neutral-200 text-neutral-800' }
                    ].map(m => (
                      <div key={m.label} className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${m.tone}`} />
                        <span>{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
            {/* Job Listings */}
            <div className="w-full lg:w-3/4">
              {/* Skill Matching Stats */}
              {matchingStats && !isLoading && (
                <div className="mb-6">
                  <Card variant="subtle" className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <BarChart3Icon size={18} />
                      Job Matching Analysis
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-lg text-green-600">{matchingStats.highMatches}</div>
                        <div className="text-neutral-600">High Match (70%+)</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg text-yellow-600">{matchingStats.mediumMatches}</div>
                        <div className="text-neutral-600">Medium Match (50-70%)</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg text-neutral-600">{matchingStats.lowMatches}</div>
                        <div className="text-neutral-600">Low Match (&lt;50%)</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg text-blue-600">{matchingStats.averageScore}%</div>
                        <div className="text-neutral-600">Average Match</div>
                      </div>
                    </div>
                    {userSkills.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-neutral-200">
                        <div className="text-sm text-neutral-600 mb-2">
                          Your Skills ({userSkills.length}):
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {userSkills.slice(0, 8).map((skill, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                skill.level === 'Expert' ? 'bg-purple-100 text-purple-800' :
                                skill.level === 'Advanced' ? 'bg-blue-100 text-blue-800' :
                                skill.level === 'Intermediate' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {skill.name}
                            </span>
                          ))}
                          {userSkills.length > 8 && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
                              +{userSkills.length - 8} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              )}

              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <Loader2Icon className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-neutral-600">Loading job matches...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
                    <p className="text-red-600 font-medium mb-2">Error Loading Jobs</p>
                    <p className="text-red-500 text-sm">{error}</p>
                  </div>
                  <Button onClick={() => navigate('/upload')} variant="outline">
                    Upload & Analyze Resume
                  </Button>
                </div>
              ) : filteredJobs.length > 0 ? <div className="space-y-8">
                  {filteredJobs.map((job: JobListing, index: number) => <Card key={index} variant="subtle" className="p-6 hover:shadow-sm transition-all">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
                        <div>
                          <h2 className="text-lg md:text-xl font-semibold tracking-tight mb-1">{job.title}</h2>
                          <p className="text-neutral-600 text-sm mb-2">{job.company}</p>
                          <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wide font-medium">
                            <span className={`px-2 py-0.5 rounded-md ${
                              (job.matchScore || 0) >= 70 ? 'bg-green-600 text-white' :
                              (job.matchScore || 0) >= 50 ? 'bg-yellow-600 text-white' :
                              'bg-neutral-600 text-white'
                            }`}>
                              {job.matchScore || 0}% Match
                            </span>
                            {job.matchQuality && (
                              <span className={`px-2 py-0.5 rounded-md ${
                                job.matchQuality === 'High' ? 'bg-green-100 text-green-800' :
                                job.matchQuality === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-neutral-100 text-neutral-800'
                              }`}>
                                {job.matchQuality} Quality
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded-md bg-neutral-200 text-neutral-800">{job.type || job.jobType || 'Full-time'}</span>
                            {job.remote && <span className="px-2 py-0.5 rounded-md bg-white border border-neutral-300 text-neutral-800">Remote</span>}
                            {job.skillsMatched && job.totalUserSkills && (
                              <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                                {job.skillsMatched}/{job.totalUserSkills} Skills
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-semibold tracking-wide uppercase text-neutral-500 mb-2">Signal Intensity</div>
                          <div className="flex items-center gap-2">
                            {[0,1,2,3,4].map(i => <span key={i} className={`h-2 w-6 rounded-sm ${i < Math.round((job.matchScore || 0)/20) ? 'bg-black' : 'bg-neutral-200'}`} />)}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                          <h3 className="text-xs font-semibold tracking-wide uppercase mb-3 flex items-center gap-2">
                            <CheckIcon size={14} className="text-green-600" /> 
                            Matching Skills ({(job.keySkillMatches || []).length})
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {(job.keySkillMatches || []).slice(0, 6).map((skill: string, skillIndex: number) => (
                              <span 
                                key={skillIndex} 
                                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800 border border-green-200"
                              >
                                {skill}
                              </span>
                            ))}
                            {(job.keySkillMatches || []).length > 6 && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 text-neutral-600">
                                +{(job.keySkillMatches || []).length - 6} more
                              </span>
                            )}
                            {(job.keySkillMatches || []).length === 0 && (
                              <span className="text-[10px] text-neutral-500 italic">No direct skill matches found</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xs font-semibold tracking-wide uppercase mb-3 flex items-center gap-2">
                            <XIcon size={14} className="text-orange-600" /> 
                            Skills to Learn ({(job.missingSkills || []).length})
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {(job.missingSkills || []).slice(0, 4).map((skill: string, skillIndex: number) => (
                              <span 
                                key={skillIndex} 
                                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-orange-50 border border-orange-200 text-orange-700"
                              >
                                {skill}
                              </span>
                            ))}
                            {(job.missingSkills || []).length > 4 && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 text-neutral-600">
                                +{(job.missingSkills || []).length - 4} more
                              </span>
                            )}
                            {(job.missingSkills || []).length === 0 && (
                              <span className="text-[10px] text-neutral-500 italic">You have all required skills!</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-6 text-neutral-600 text-xs mb-8">
                        <div className="flex items-center gap-1"><MapPinIcon size={14} />{job.location}</div>
                        <div className="flex items-center gap-1"><DollarSignIcon size={14} />{job.salary}</div>
                        <div className="flex items-center gap-1"><BriefcaseIcon size={14} />{job.type || job.jobType || 'Full-time'}</div>
                        {job.postedDate && (
                          <div className="flex items-center gap-1">
                            <span>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      {job.description && (
                        <div className="mb-6">
                          <p className="text-neutral-600 text-sm">{job.description}</p>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <div className="text-[10px] uppercase tracking-wide text-neutral-500">
                          {job.isRealJob ? 'Live job from API' : 'Sample job match'}
                        </div>
                        <div className="flex gap-2">
                          {job.linkedinUrl && (
                            <Button 
                              variant="solid" 
                              size="sm" 
                              onClick={() => window.open(job.linkedinUrl, '_blank')}
                              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
                            >
                              LinkedIn <ExternalLinkIcon size={14} />
                            </Button>
                          )}
                          {job.url && job.url !== '#' ? (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => window.open(job.url, '_blank')}
                              className="flex items-center gap-1"
                            >
                              Apply <ExternalLinkIcon size={14} />
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => navigate(`/role/${index}`)} 
                              className="flex items-center gap-1"
                            >
                              View <ArrowRightIcon size={14} />
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>)}
                </div> : <Card variant="subtle" className="text-center py-16">
                  <BriefcaseIcon size={44} className="text-neutral-400 mx-auto mb-6" />
                  <h2 className="text-2xl font-extrabold tracking-tight mb-4">No Roles Found</h2>
                  <p className="text-neutral-600 text-sm mb-8 max-w-md mx-auto leading-relaxed">Adjust filters or broaden criteria to surface more role alignment candidates.</p>
                  <Button variant="solid" onClick={() => {
                setSearchTerm('');
                setFilters({
                  minMatch: 0,
                  location: '',
                  showRemote: false
                });
              }}>Reset Filters</Button>
                </Card>}
            </div>
          </div>
          {/* Extended Section */}
          <div className="mt-24">
            <Card variant="subtle" className="p-10">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-extrabold tracking-tight mb-4">Application Strategy Notes</h2>
                <p className="text-neutral-600 text-sm md:text-base leading-relaxed">Use match scoring as directional guidance. Prioritize clarity-driven impact adjustments before volume scaling of applications.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { t:'Signal Refinement', d:'Iterate top 2 roles with targeted phrasing & quant metrics before broadening.'},
                  { t:'Skill Gap Bridging', d:'Address one strategic missing capability per week to lift mid-band matches.'},
                  { t:'Outcome Positioning', d:'Emphasize measurable impact over tool lists for senior pathway roles.'}
                ].map(item => (
                  <div key={item.t} className="rounded-lg border border-neutral-200 bg-white p-6">
                    <h3 className="text-sm font-semibold tracking-wide uppercase mb-3">{item.t}</h3>
                    <p className="text-neutral-600 text-sm leading-relaxed">{item.d}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>
      </Container>
    </PageLayout>;
};
export default Careers;