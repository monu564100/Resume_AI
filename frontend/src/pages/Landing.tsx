import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Container } from '../components/ui/Container';
import { PageLayout } from '../components/layout/PageLayout';
import { ImageGallery } from '../components/ui/ImageGallery';
import { 
  UploadCloud as UploadCloudIcon, 
  BarChart as BarChartIcon,
  Sparkles as SparklesIcon,
  ArrowRight as ArrowRightIcon,
  Brain as BrainIcon,
  Target as TargetIcon
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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

// Data arrays
const stats = [
  { number: '98%', label: 'Accuracy Rate', icon: <BarChartIcon size={24} /> },
  { number: '10K+', label: 'Resumes Analyzed', icon: <UploadCloudIcon size={24} /> },
  { number: '24h', label: 'Response Time', icon: <SparklesIcon size={24} /> },
  { number: '4.9/5', label: 'User Rating', icon: <SparklesIcon size={24} /> }
];

const features = [
  {
    title: 'ATS Optimization',
    description: 'Ensure your resume passes through automated tracking systems used by top companies.',
    icon: <BarChartIcon size={32} />,
    gradient: 'from-blue-500/10 to-cyan-500/10'
  },
  {
    title: 'Skill Gap Analysis',
    description: 'Identify missing skills for your dream job and get personalized learning recommendations.',
    icon: <BrainIcon size={32} />,
    gradient: 'from-purple-500/10 to-pink-500/10'
  },
  {
    title: 'Job Matching',
    description: 'Get matched with the perfect opportunities based on your skills and experience.',
    icon: <TargetIcon size={32} />,
    gradient: 'from-orange-500/10 to-red-500/10'
  },
  {
    title: 'Resume Score',
    description: 'Receive a comprehensive score and detailed feedback to improve your resume.',
    icon: <SparklesIcon size={32} />,
    gradient: 'from-green-500/10 to-emerald-500/10'
  }
];

const testimonials = [
  {
    content: 'The AI analysis helped me identify exactly what was missing from my resume. Landed 3 interviews in 2 weeks!',
    name: 'Priya Sharma',
    role: 'Software Developer',
    company: 'TechMahindra',
    rating: 5
  },
  {
    content: 'The ATS optimization feature is a game-changer. Finally understand why my applications were getting rejected.',
    name: 'Rahul Verma',
    role: 'Product Manager',
    company: 'Paytm',
    rating: 5
  },
  {
    content: 'The skill gap analysis showed me exactly what I needed to learn to advance my career. Incredibly valuable!',
    name: 'Anjali Patel',
    role: 'Data Scientist',
    company: 'Flipkart',
    rating: 5
  }
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        
        <Container className="relative z-10">
          <motion.div 
            className="text-center max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <SparklesIcon size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Resume Analysis</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Transform Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-primary-400 to-secondary bg-clip-text text-transparent">
                Career Journey
              </span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Leverage advanced AI to analyze your resume, optimize for ATS systems, and discover 
              perfect career opportunities in the Indian job market.
            </p>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => navigate('/upload')}
                className="group relative overflow-hidden px-8 py-4 text-lg font-semibold"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Analyze Resume Now
                  <ArrowRightIcon size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/upload?demo=true')}
                className="px-8 py-4 text-lg border-gray-600 hover:border-gray-400"
              >
                Try Free Demo
              </Button>
            </motion.div>

            {/* Stats Section */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {stats.map((stat, index) => (
                <motion.div key={index} variants={fadeInUp} className="text-center">
                  <div className="flex justify-center mb-3 text-primary">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <Container>
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-primary">Intelligent Features</span> for Modern Careers
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of resume analysis with our cutting-edge AI technology 
              designed specifically for the Indian job market.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card 
                  variant="glass" 
                  className="h-full p-6 lg:p-8 group hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <div className="flex justify-center mb-6">
                      <div className="p-4 rounded-2xl bg-dark-100/50 group-hover:bg-dark-100/80 transition-colors">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold mb-4 text-center">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-center leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-dark-100/50 to-transparent">
        <Container>
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              How It <span className="text-primary">Works</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Get professional insights in just three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: '01',
                title: 'Upload Your Resume',
                description: 'Securely upload your resume in PDF, DOCX, or TXT format. Our system supports multiple file types for your convenience.',
                icon: <UploadCloudIcon size={32} />
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our advanced AI analyzes your resume for skills, experience, ATS compatibility, and market relevance in real-time.',
                icon: <BrainIcon size={32} />
              },
              {
                step: '03',
                title: 'Get Insights & Jobs',
                description: 'Receive detailed insights, improvement suggestions, and personalized job matches from top Indian companies.',
                icon: <TargetIcon size={32} />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                {/* Connection Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 left-full w-full h-px bg-gradient-to-r from-primary/50 to-transparent transform -translate-y-1/2 z-0" />
                )}
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 mb-6 mx-auto">
                    <div className="text-primary">
                      {item.icon}
                    </div>
                  </div>
                  
                  <div className="text-sm font-bold text-primary mb-2 tracking-wider">
                    STEP {item.step}
                  </div>
                  
                  <h3 className="text-xl lg:text-2xl font-bold mb-4">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32">
        <Container>
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              What <span className="text-primary">Professionals</span> Say
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of professionals who've transformed their careers with our platform
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card variant="glass" className="p-6 lg:p-8 h-full">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="border-t border-gray-700 pt-4">
                    <div className="font-semibold text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <Container>
          <motion.div 
            className="relative rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20 p-8 md:p-16 text-center overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            <div className="absolute top-0 left-0 w-full h-full opacity-50">
              <div className="w-2 h-2 bg-white/20 rounded-full absolute top-4 left-4"></div>
              <div className="w-2 h-2 bg-white/20 rounded-full absolute top-8 right-8"></div>
              <div className="w-2 h-2 bg-white/20 rounded-full absolute bottom-12 left-12"></div>
              <div className="w-2 h-2 bg-white/20 rounded-full absolute bottom-4 right-16"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Ready to <span className="text-primary">Accelerate</span> Your Career?
              </h2>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who've already transformed their careers. 
                Get started with your free resume analysis today.
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={() => navigate('/upload')}
                  className="px-12 py-4 text-lg font-semibold group"
                >
                  <span className="flex items-center gap-2">
                    Start Your Analysis
                    <ArrowRightIcon size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Image Gallery Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-dark-100/30 to-transparent">
        <Container maxWidth="full" className="px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                <span className="text-primary">Experience</span> Our Platform
              </h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                Explore the comprehensive analysis and insights you'll receive
              </p>
            </div>
            <ImageGallery />
          </motion.div>
        </Container>
      </section>
    </PageLayout>
  );
};

export default Landing;