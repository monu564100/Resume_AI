import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { PageLayout } from '../components/layout/PageLayout';
import {
  UploadCloud as UploadCloudIcon,
  BarChart as BarChartIcon,
  Sparkles as SparklesIcon,
  ArrowRight as ArrowRightIcon,
  Brain as BrainIcon,
  Target as TargetIcon,
  CheckCircle,
  TrendingUp,
  Users,
  Award,
  Shield,
  Zap,
  Star,
  Quote
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
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

// Professional Data
const stats = [
  { number: '98%', label: 'Accuracy Rate', icon: <Award className="w-8 h-8" />, color: 'text-black' },
  { number: '50K+', label: 'Resumes Analyzed', icon: <BarChartIcon className="w-8 h-8" />, color: 'text-black' },
  { number: '24/7', label: 'AI Support', icon: <Zap className="w-8 h-8" />, color: 'text-black' },
  { number: '4.9/5', label: 'User Rating', icon: <Star className="w-8 h-8" />, color: 'text-black' }
];

const features = [
  {
    title: 'ATS Optimization',
    description: 'Ensure your resume passes through automated tracking systems used by Fortune 500 companies.',
    icon: <Shield className="w-12 h-12" />,
    color: 'bg-white border border-neutral-200 text-black',
    iconBg: 'bg-neutral-100'
  },
  {
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning algorithms analyze your resume for optimal keyword placement and structure.',
    icon: <BrainIcon className="w-12 h-12" />,
    color: 'bg-white border border-neutral-200 text-black',
    iconBg: 'bg-neutral-100'
  },
  {
    title: 'Smart Job Matching',
    description: 'Get matched with opportunities that align perfectly with your skills and career aspirations.',
    icon: <TargetIcon className="w-12 h-12" />,
    color: 'bg-white border border-neutral-200 text-black',
    iconBg: 'bg-neutral-100'
  },
  {
    title: 'Performance Analytics',
    description: 'Comprehensive scoring system with detailed feedback to maximize your interview potential.',
    icon: <TrendingUp className="w-12 h-12" />,
    color: 'bg-white border border-neutral-200 text-black',
    iconBg: 'bg-neutral-100'
  }
];

const testimonials = [
  {
    content: 'The AI analysis transformed my resume completely. I went from 0 responses to 5 interview calls in just 2 weeks. The ATS optimization was a game-changer.',
    name: 'Priya Sharma',
    role: 'Senior Software Engineer',
    company: 'Microsoft India',
    rating: 5,
    image: '/api/placeholder/64/64'
  },
  {
    content: 'Finally understood why my applications were getting rejected. The detailed feedback helped me restructure my entire approach to job applications.',
    name: 'Rahul Verma',
    role: 'Product Manager',
    company: 'Google',
    rating: 5,
    image: '/api/placeholder/64/64'
  },
  {
    content: 'The skill gap analysis was incredibly insightful. It showed me exactly what I needed to learn to advance in my career. Highly recommended!',
    name: 'Anjali Patel',
    role: 'Data Scientist',
    company: 'Amazon',
    rating: 5,
    image: '/api/placeholder/64/64'
  }
];

const processSteps = [
  {
    number: '01',
    title: 'Upload Resume',
    description: 'Securely upload your resume in PDF, DOCX, or TXT format. Our enterprise-grade security ensures your data is protected.',
    icon: <UploadCloudIcon className="w-10 h-10" />,
    color: 'bg-black text-white'
  },
  {
    number: '02',
    title: 'AI Analysis',
    description: 'Our advanced AI engine analyzes your resume for ATS compatibility, keyword optimization, and industry standards.',
    icon: <BrainIcon className="w-10 h-10" />,
    color: 'bg-neutral-800 text-white'
  },
  {
    number: '03',
    title: 'Get Results',
    description: 'Receive comprehensive insights, personalized recommendations, and targeted job matches within seconds.',
    icon: <TargetIcon className="w-10 h-10" />,
    color: 'bg-neutral-900 text-white'
  }
];

const Landing = () => {
  const navigate = useNavigate();

  return (
  <div className="min-h-screen bg-white text-black">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0">
        {/* Horizontal Lines */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div 
              key={`h-${i}`} 
              className="absolute w-full h-px bg-gray-100"
              style={{ top: `${i * 5}%` }}
            />
          ))}
        </div>
        {/* Vertical Lines */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div 
              key={`v-${i}`} 
              className="absolute h-full w-px bg-gray-100"
              style={{ left: `${i * 8.33}%` }}
            />
          ))}
        </div>
        {/* Accent Lines */}
        <div className="absolute top-20 left-0 w-full h-px bg-neutral-200" />
        <div className="absolute bottom-20 left-0 w-full h-px bg-neutral-200" />
        <div className="absolute top-0 left-1/4 w-px h-full bg-neutral-200" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-neutral-200" />
      </div>

      <PageLayout>
        {/* Hero Section */}
        <section className="relative z-10 min-h-[90vh] flex items-center py-16 md:py-20">
          <Container maxWidth="7xl" className="relative">
            <div className="grid grid-cols-12 gap-y-12 gap-x-8 xl:gap-x-12 items-start">
              {/* Left (content) spans 7-8 columns on large screens */}
              <div className="col-span-12 lg:col-span-7 xl:col-span-8">
                <div className="max-w-2xl xl:max-w-3xl">
                {/* Left Content */}
                <motion.div
                  className="text-left"
                  variants={slideInLeft}
                  initial="hidden"
                  animate="show"
                >
                  {/* Badge */}
                  <motion.div
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-neutral-100 border border-neutral-300 mb-8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <SparklesIcon className="w-5 h-5 text-black" />
                    <span className="text-sm font-semibold text-black tracking-wide">AI-POWERED CAREER INTELLIGENCE</span>
                  </motion.div>

                  {/* Main Heading */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold mb-8 leading-[1.05] tracking-tight">
                    <span className="text-black">Transform Your</span><br />
                    <span className="text-transparent bg-gradient-to-r from-black to-neutral-600 bg-clip-text">Career Journey</span>
                  </h1>
                  
                  {/* Subtitle */}
                  <p className="text-lg sm:text-xl lg:text-[1.3rem] text-neutral-700 mb-10 leading-relaxed">
                    Leverage enterprise-grade AI to optimize your resume, pass ATS systems, and discover 
                    high-paying opportunities with top-tier companies.
                  </p>
                  
                  {/* CTA Buttons */}
                  <motion.div 
                    className="flex flex-col sm:flex-row gap-4 mb-10 md:mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      variant="solid"
                      size="lg" 
                      onClick={() => navigate('/upload')}
                      className="px-8 py-4 text-lg font-semibold shadow hover:shadow-lg transition-all duration-300 group"
                    >
                      <span className="flex items-center gap-3">
                        Start Analysis Now
                        <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                    
                    <Button
                      variant="outline" 
                      size="lg" 
                      onClick={() => navigate('/upload?demo=true')}
                      className="px-8 py-4 text-lg border-2 border-neutral-400 text-neutral-700 hover:bg-black hover:text-white transition-all duration-300"
                    >
                      Try Free Demo
                    </Button>
                  </motion.div>

                  {/* Trust Indicators */}
                  <motion.div
                    className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-neutral-600 max-w-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center gap-2 text-neutral-600"><CheckCircle className="w-5 h-5 text-black" /><span>No Credit Card Required</span></div>
                    <div className="flex items-center gap-2 text-neutral-600"><Shield className="w-5 h-5 text-black" /><span>Enterprise Security</span></div>
                    <div className="flex items-center gap-2 text-neutral-600"><Users className="w-5 h-5 text-black" /><span>50K+ Professionals</span></div>
                  </motion.div>
                </motion.div>
                </div>
              </div>
              {/* Right (stats) spans 5-4 columns */}
              <motion.div
                className="hidden lg:block col-span-12 lg:col-span-5 xl:col-span-4"
                variants={slideInRight}
                initial="hidden"
                animate="show"
              >
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 xl:p-8 sticky top-28">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + index * 0.08 }}
                      >
                        <div className={`${stat.color} mb-3 flex justify-center`}>{stat.icon}</div>
                        <div className="text-2xl xl:text-3xl font-bold text-black mb-1">{stat.number}</div>
                        <div className="text-xs font-medium text-neutral-600 tracking-wide">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
                    <div className="flex items-center justify-center gap-2 text-xs font-medium text-neutral-500">
                      <Star className="w-4 h-4" />
                      <span>Trusted by professionals worldwide</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Features Section */}
  <section className="relative z-10 py-24 bg-neutral-50">
          <Container>
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">Intelligent Features for Modern Careers</h2>
              <p className="text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed">
                Experience enterprise-grade AI technology designed specifically for the competitive job market
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <div className={`relative h-full p-8 rounded-2xl ${feature.color} hover:shadow transition-all duration-300 group cursor-pointer`}>
                    {/* Icon */}
                    <div className={`w-20 h-20 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-bold text-black mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-700 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-white bg-opacity-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </section>

        {/* How It Works Section */}
  <section className="relative z-10 py-24 bg-white">
          <Container>
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">How It Works</h2>
              <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
                Get professional insights in three simple steps
              </p>
            </motion.div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {processSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    className="text-center relative"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                  >
                    {/* Connection Line */}
                    {index < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent transform -translate-y-1/2 z-0" />
                    )}
                    
                    <div className="relative z-10">
                      {/* Step Number */}
                      <div className={`inline-flex items-center justify-center w-20 h-20 ${step.color} rounded-2xl mb-6 font-bold text-xl shadow` }>
                        {step.number}
                      </div>
                      
                      {/* Icon */}
                      <div className="mb-6 text-neutral-700">
                        {step.icon}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-black mb-4">
                        {step.title}
                      </h3>
                      
                      <p className="text-neutral-700 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Testimonials Section */}
  <section className="relative z-10 py-24 bg-neutral-50">
          <Container>
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">What Professionals Say</h2>
              <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
                Join thousands of professionals who've transformed their careers
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div key={index} variants={scaleIn}>
                  <div className="bg-white rounded-2xl border border-neutral-200 p-8 h-full shadow hover:shadow-md transition-all duration-300">
                    {/* Quote Icon */}
                    <div className="mb-6">
                      <Quote className="w-8 h-8 text-black" />
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-6 text-black">
                      {[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="w-5 h-5" />))}
                    </div>
                    
                    {/* Content */}
                    <p className="text-neutral-700 mb-8 italic leading-relaxed text-lg">
                      "{testimonial.content}"
                    </p>
                    
                    {/* Author */}
                    <div className="flex items-center pt-6 border-t border-neutral-100">
                      <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold mr-4">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-black">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-neutral-600">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </section>
        {/* CTA Section (Monochrome) */}
        <section className="relative z-10 py-24 bg-black text-white">
          <Container>
            <motion.div 
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Accelerate Your Career?</h2>
              <p className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of professionals who've already transformed their careers. 
                Get started with your free resume analysis today.
              </p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="solid" 
                  size="lg" 
                  onClick={() => navigate('/upload')}
                  className="px-12 py-4 text-lg font-semibold bg-white text-black hover:bg-neutral-200 shadow transition-all duration-300 group"
                >
                  <span className="flex items-center gap-3">
                    Start Your Analysis
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => navigate('/upload?demo=true')}
                  className="px-12 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300"
                >
                  Try Free Demo
                </Button>
              </motion.div>

              {/* Trust indicators */}
              <div className="mt-12 flex flex-wrap justify-center gap-8 text-neutral-300">
                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-white" /><span>100% Free Analysis</span></div>
                <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-white" /><span>Secure & Private</span></div>
                <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-white" /><span>Instant Results</span></div>
              </div>
            </motion.div>
          </Container>
        </section>

        {/* Footer CTA */}
        <section className="relative z-10 py-16 bg-white border-t border-neutral-200">
          <Container>
            <div className="text-center">
              <p className="text-neutral-600 mb-4">
                Trusted by professionals at leading companies
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="text-neutral-500 font-semibold">Google</div>
                <div className="text-neutral-500 font-semibold">Microsoft</div>
                <div className="text-neutral-500 font-semibold">Amazon</div>
                <div className="text-neutral-500 font-semibold">Apple</div>
                <div className="text-neutral-500 font-semibold">Meta</div>
                <div className="text-neutral-500 font-semibold">Netflix</div>
              </div>
            </div>
          </Container>
        </section>
      </PageLayout>
    </div>
  );
};

export default Landing;