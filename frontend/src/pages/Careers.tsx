import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PageLayout } from '../components/layout/PageLayout';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useResume } from '../context/ResumeContext';
import { useNavigate } from 'react-router-dom';
import { BriefcaseIcon, SearchIcon, MapPinIcon, DollarSignIcon, FilterIcon, CheckIcon, XIcon, ArrowRightIcon } from 'lucide-react';

interface JobListing {
  title: string;
  company: string;
  matchScore: number;
  keySkillMatches?: string[];
  missingSkills?: string[];
  salary: string;
  location: string;
  type: string;
  remote?: boolean;
}
const Careers: React.FC = () => {
  const {
    resumeData
  } = useResume();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minMatch: 0,
    location: '',
    showRemote: false
  });
  // Mock job data (in a real app, this would come from an API)
  const fallbackJobs: JobListing[] = [
    {
      title: 'Senior Software Engineer',
      company: 'Tech Innovations Ltd',
      matchScore: 85,
      keySkillMatches: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
      missingSkills: ['Docker', 'Kubernetes'],
      salary: '$120,000 - $150,000',
      location: 'Bangalore, India',
      type: 'Full-time',
      remote: true
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
      remote: false
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
      remote: true
    },
    {
      title: 'Backend Engineer',
      company: 'Data Systems Corp',
      matchScore: 65,
      keySkillMatches: ['Node.js', 'SQL', 'Express.js'],
      missingSkills: ['Python', 'Django', 'PostgreSQL'],
      salary: '$130,000 - $160,000',
      location: 'Pune, India',
      type: 'Full-time',
      remote: false
    },
    {
      title: 'DevOps Engineer',
      company: 'Cloud Tech Solutions',
      matchScore: 70,
      keySkillMatches: ['Docker', 'AWS', 'Jenkins'],
      missingSkills: ['Kubernetes', 'Terraform', 'Ansible'],
      salary: '$110,000 - $140,000',
      location: 'Chennai, India',
      type: 'Full-time',
      remote: true
    },
    {
      title: 'Product Manager',
      company: 'Innovation Labs',
      matchScore: 88,
      keySkillMatches: ['Product Strategy', 'Agile', 'Analytics', 'User Research'],
      missingSkills: ['Data Science', 'Machine Learning'],
      salary: '$140,000 - $180,000',
      location: 'Delhi, India',
      type: 'Full-time',
      remote: false
    },
    {
      title: 'UI/UX Designer',
      company: 'Creative Agency',
      matchScore: 82,
      keySkillMatches: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
      missingSkills: ['Motion Design', 'After Effects'],
      salary: '$70,000 - $95,000',
      location: 'Gurgaon, India',
      type: 'Full-time',
      remote: true
    },
    {
      title: 'Data Scientist',
      company: 'Analytics Pro',
      matchScore: 75,
      keySkillMatches: ['Python', 'Machine Learning', 'SQL', 'Pandas'],
      missingSkills: ['Deep Learning', 'TensorFlow', 'Apache Spark'],
      salary: '$100,000 - $130,000',
      location: 'Bangalore, India',
      type: 'Full-time',
      remote: true
    }
  ];

  const jobListings: JobListing[] = (resumeData?.roleMatches as JobListing[] | undefined)?.length ? (resumeData.roleMatches as JobListing[]) : fallbackJobs;
  // Filter jobs based on search and filters
  const filteredJobs = jobListings.filter(job => {
    return job.title.toLowerCase().includes(searchTerm.toLowerCase()) && job.matchScore >= filters.minMatch;
  });
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value,
      type,
      checked
    } = e.target;
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
              {filteredJobs.length > 0 ? <div className="space-y-8">
                  {filteredJobs.map((job, index) => <Card key={index} variant="subtle" className="p-6 hover:shadow-sm transition-all">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
                        <div>
                          <h2 className="text-lg md:text-xl font-semibold tracking-tight mb-1">{job.title}</h2>
                          <p className="text-neutral-600 text-sm mb-2">{job.company}</p>
                          <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wide font-medium">
                            <span className="px-2 py-0.5 rounded-md bg-neutral-900 text-white">{job.matchScore}% Match</span>
                            <span className="px-2 py-0.5 rounded-md bg-neutral-200 text-neutral-800">{job.type}</span>
                            {job.remote && <span className="px-2 py-0.5 rounded-md bg-white border border-neutral-300 text-neutral-800">Remote</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-semibold tracking-wide uppercase text-neutral-500 mb-2">Signal Intensity</div>
                          <div className="flex items-center gap-2">
                            {[0,1,2,3,4].map(i => <span key={i} className={`h-2 w-6 rounded-sm ${i < Math.round(job.matchScore/20) ? 'bg-black' : 'bg-neutral-200'}`} />)}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                          <h3 className="text-xs font-semibold tracking-wide uppercase mb-3 flex items-center gap-2"><CheckIcon size={14} /> Matching Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {job.keySkillMatches?.map((skill: string, skillIndex: number) => <span key={skillIndex} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-200 text-neutral-800">{skill}</span>)}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xs font-semibold tracking-wide uppercase mb-3 flex items-center gap-2"><XIcon size={14} /> Missing Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {job.missingSkills?.map((skill: string, skillIndex: number) => <span key={skillIndex} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 border border-neutral-300 text-neutral-700">{skill}</span>)}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-6 text-neutral-600 text-xs mb-8">
                        <div className="flex items-center gap-1"><MapPinIcon size={14} />{job.location}</div>
                        <div className="flex items-center gap-1"><DollarSignIcon size={14} />{job.salary}</div>
                        <div className="flex items-center gap-1"><BriefcaseIcon size={14} />{job.type}</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-[10px] uppercase tracking-wide text-neutral-500">Indexed from role alignment model</div>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/role/${index}`)} className="flex items-center gap-1">View <ArrowRightIcon size={14} /></Button>
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