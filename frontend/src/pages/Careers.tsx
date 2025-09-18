import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PageLayout } from '../components/layout/PageLayout';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useResume } from '../context/ResumeContext';
import { useNavigate } from 'react-router-dom';
import { BriefcaseIcon, SearchIcon, MapPinIcon, DollarSignIcon, FilterIcon, StarIcon, CheckIcon, XIcon, ArrowRightIcon } from 'lucide-react';
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
  const jobListings = resumeData?.roleMatches || [];
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              Career{' '}
              <span className="text-primary text-glow-primary">
                Opportunities
              </span>
            </h1>
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex items-center">
              Back to Dashboard
            </Button>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters */}
            <div className="w-full lg:w-1/4">
              <Card variant="glassDark" className="sticky top-24">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <FilterIcon size={18} className="mr-2" />
                  Filters
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">
                      Search Jobs
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon size={16} className="text-gray-400" />
                      </div>
                      <input type="text" id="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-dark-50 border border-gray-700 text-white rounded-lg block w-full pl-10 pr-3 py-2 focus:ring-primary focus:border-primary" placeholder="Job title or keyword" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="minMatch" className="block text-sm font-medium text-gray-300 mb-1">
                      Minimum Match Score: {filters.minMatch}%
                    </label>
                    <input type="range" id="minMatch" name="minMatch" min="0" max="100" value={filters.minMatch} onChange={handleFilterChange} className="w-full h-2 bg-dark-100 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                      Location
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPinIcon size={16} className="text-gray-400" />
                      </div>
                      <input type="text" id="location" name="location" value={filters.location} onChange={handleFilterChange} className="bg-dark-50 border border-gray-700 text-white rounded-lg block w-full pl-10 pr-3 py-2 focus:ring-primary focus:border-primary" placeholder="City, state, or country" />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="showRemote" name="showRemote" checked={filters.showRemote} onChange={handleFilterChange} className="w-4 h-4 text-primary bg-dark-50 border-gray-700 rounded focus:ring-primary focus:ring-2" />
                    <label htmlFor="showRemote" className="ml-2 text-sm font-medium text-gray-300">
                      Remote Jobs Only
                    </label>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">
                    Match Score Legend
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm text-gray-400">
                        90-100%: Excellent Match
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                      <span className="text-sm text-gray-400">
                        75-89%: Good Match
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="text-sm text-gray-400">
                        60-74%: Fair Match
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-sm text-gray-400">
                        Below 60%: Poor Match
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            {/* Job Listings */}
            <div className="w-full lg:w-3/4">
              {filteredJobs.length > 0 ? <div className="space-y-6">
                  {filteredJobs.map((job, index) => <Card key={index} variant="glass" className="hover:border-primary transition-colors duration-300">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-semibold">{job.title}</h2>
                          <p className="text-gray-400">{job.company}</p>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${job.matchScore >= 90 ? 'bg-green-500/20 text-green-400' : job.matchScore >= 75 ? 'bg-primary-500/20 text-primary' : job.matchScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                            <StarIcon size={14} className="mr-1" />
                            {job.matchScore}% Match
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                            <CheckIcon size={14} className="text-primary mr-1" />
                            Matching Skills
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {job.keySkillMatches?.map((skill, skillIndex) => <span key={skillIndex} className="bg-secondary-500/20 text-secondary-300 px-2 py-0.5 rounded-full text-xs">
                                {skill}
                              </span>)}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                            <XIcon size={14} className="text-gray-400 mr-1" />
                            Missing Skills
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {job.missingSkills?.map((skill, skillIndex) => <span key={skillIndex} className="bg-dark-100 text-gray-300 px-2 py-0.5 rounded-full text-xs">
                                {skill}
                              </span>)}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center text-gray-400 text-sm">
                          <MapPinIcon size={14} className="mr-1" />
                          Remote / San Francisco, CA
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <DollarSignIcon size={14} className="mr-1" />
                          {job.salary}
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <BriefcaseIcon size={14} className="mr-1" />
                          Full-time
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/role/${index}`)} className="flex items-center">
                          View Details
                          <ArrowRightIcon size={14} className="ml-1" />
                        </Button>
                      </div>
                    </Card>)}
                </div> : <Card variant="glass" className="text-center py-12">
                  <BriefcaseIcon size={48} className="text-gray-500 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No Jobs Found</h2>
                  <p className="text-gray-400 mb-6">
                    Try adjusting your filters or search criteria
                  </p>
                  <Button variant="primary" onClick={() => {
                setSearchTerm('');
                setFilters({
                  minMatch: 0,
                  location: '',
                  showRemote: false
                });
              }}>
                    Reset Filters
                  </Button>
                </Card>}
            </div>
          </div>
        </motion.div>
      </Container>
    </PageLayout>;
};
export default Careers;