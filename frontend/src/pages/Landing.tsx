import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Container } from '../components/ui/Container';
import { PageLayout } from '../components/layout/PageLayout';
import { ImageGallery } from '../components/ui/ImageGallery';
import { 
  UploadCloudIcon, 
  BarChartIcon, 
  TargetIcon, 
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  UsersIcon,
  BrainIcon
} from 'lucide-react';
const Landing: React.FC = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <BrainIcon size={28} className="text-primary" />,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze your resume to extract key insights and provide personalized recommendations.',
      gradient: 'from-blue-500/20 to-purple-500/20'
    },
    {
      icon: <TrendingUpIcon size={28} className="text-emerald-400" />,
      title: 'Skills Enhancement',
      description: 'Identify skill gaps and receive targeted suggestions to improve your professional profile and market value.',
      gradient: 'from-emerald-500/20 to-teal-500/20'
    },
    {
      icon: <TargetIcon size={28} className="text-orange-400" />,
      title: 'Smart Job Matching',
      description: 'Get matched with relevant opportunities in the Indian job market based on your skills and experience.',
      gradient: 'from-orange-500/20 to-red-500/20'
    },
    {
      icon: <ShieldCheckIcon size={28} className="text-purple-400" />,
      title: 'ATS Optimization',
      description: 'Ensure your resume passes Applicant Tracking Systems with our comprehensive compatibility analysis.',
      gradient: 'from-purple-500/20 to-pink-500/20'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Resumes Analyzed', icon: <UploadCloudIcon size={24} /> },
    { number: '95%', label: 'Success Rate', icon: <CheckCircleIcon size={24} /> },
    { number: '500+', label: 'Companies', icon: <UsersIcon size={24} /> },
    { number: '24/7', label: 'AI Support', icon: <SparklesIcon size={24} /> }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer',
      company: 'TCS',
      content: 'This tool helped me land my dream job! The AI insights were incredibly accurate and actionable.',
      rating: 5
    },
    {
      name: 'Rahul Patel',
      role: 'Data Scientist',
      company: 'Infosys',
      content: 'The job matching feature is phenomenal. I found opportunities I never knew existed.',
      rating: 5
    },
    {
      name: 'Anjali Singh',
      role: 'Product Manager',
      company: 'Wipro',
      content: 'Professional, fast, and incredibly insightful. Highly recommended for career growth.',
      rating: 5
    }
  ];

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 lg:py-40 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
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
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Upload Your Resume
                    </h3>
                    <p className="text-gray-400">
                      Simply upload your resume in PDF or DOCX format. Our
                      system will securely process your document.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-500/20 flex items-center justify-center mr-4 mt-1">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                    <p className="text-gray-400">
                      Our advanced AI analyzes your skills, experience, and
                      qualifications to generate comprehensive insights.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-500/20 flex items-center justify-center mr-4 mt-1">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Get Personalized Results
                    </h3>
                    <p className="text-gray-400">
                      Receive detailed feedback, career recommendations, and
                      actionable steps to improve your resume.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div className="flex-1" initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }}>
              <Card variant="glassDark" className="p-0 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" alt="Resume analysis visualization" className="w-full h-auto object-cover" />
              </Card>
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <motion.div className="text-center mb-12" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to{' '}
              <span className="text-secondary text-glow-secondary">Boost</span>{' '}
              Your Career?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get started today and discover the perfect career opportunities
              that match your skills and experience.
            </p>
          </motion.div>
          <motion.div className="flex justify-center" initial={{
          opacity: 0,
          scale: 0.9
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <Button variant="primary" size="lg" onClick={() => navigate('/upload')}>
              Analyze My Resume Now
            </Button>
          </motion.div>
        </Container>
      </section>
    </PageLayout>;
};
export default Landing;