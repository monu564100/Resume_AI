import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import {
  AlertCircleIcon,
  LockIcon,
  MailIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowRightIcon,
  SparklesIcon,
  ShieldIcon,
  TargetIcon,
  BarChartIcon
} from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate, error, clearError]);

  useEffect(() => {
    setIsFormValid(email.length > 0 && password.length > 0);
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      await login(email, password);
    }
  };

  const features = [
    'AI-powered resume analysis',
    'ATS compatibility scoring',
    'Skills gap identification',
    'Job matching for Indian market',
    'Career progression insights'
  ];

  return (
    <PageLayout withFooter={false}>
      <div className="min-h-screen flex flex-col bg-white text-black">
        {/* Main two-column region */}
        <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-2">
          {/* Left Panel - Login Form */}
          <div className="flex items-center justify-center px-4 sm:px-8 py-16 border-b lg:border-b-0 lg:border-r border-neutral-200 bg-white/80 backdrop-blur relative overflow-hidden">
            {/* subtle pattern */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{backgroundImage:'linear-gradient(#000 1px,transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px)',backgroundSize:'38px 38px,38px 38px'}} />
            <Container maxWidth="sm" className="w-full relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <div className="mb-10">
                <motion.div
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-neutral-100 border border-neutral-300 mb-6"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <SparklesIcon size={16} className="text-black" />
                  <span className="text-xs font-semibold tracking-wider">SECURE LOGIN</span>
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Access Your Dashboard</h1>
                <p className="text-neutral-600 text-base md:text-lg max-w-md leading-relaxed">Sign in to continue optimizing your resume and tracking your career insights.</p>
              </div>

              <Card variant="subtle" className="p-8 lg:p-10 shadow-sm">
                {showError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 rounded-lg bg-neutral-100 border border-neutral-300 flex items-center gap-3"
                  >
                    <AlertCircleIcon size={20} className="text-black flex-shrink-0" />
                    <p className="text-neutral-700 text-sm">{error}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MailIcon size={20} className="text-neutral-500" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/30 focus:border-black transition-colors"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockIcon size={20} className="text-neutral-500" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/30 focus:border-black transition-colors"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-black transition-colors"
                      >
                        {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-black focus:ring-black border-neutral-400 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-600">
                        Remember me
                      </label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-black underline-offset-2 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    variant="solid"
                    size="lg"
                    disabled={!isFormValid || isLoading}
                    className="w-full group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRightIcon size={20} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </Button>
                </form>

                <div className="mt-8 text-center text-sm text-neutral-600">
                  <p>
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-black underline-offset-2 hover:underline">Create one</Link>
                  </p>
                </div>
              </Card>
            </motion.div>
          </Container>
          </div>

          {/* Right Panel - Monochrome Feature Highlights */}
          <div className="hidden lg:flex items-stretch bg-neutral-50 relative">
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{backgroundImage:'linear-gradient(#000 1px,transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px)',backgroundSize:'42px 42px,42px 42px'}} />
            <div className="w-full flex items-center justify-center p-16">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="max-w-md"
              >
                <h2 className="text-4xl font-extrabold tracking-tight mb-6 leading-[1.1]">Why Professionals Choose Us</h2>
                <p className="text-neutral-600 mb-8 leading-relaxed">Data-backed insights help you iterate faster on each version of your resume while staying aligned with evolving role expectations.</p>
                <ul className="space-y-5">
                  {features.map((feature, index) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.08 }}
                      className="flex gap-3"
                    >
                      <div className="h-6 w-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold mt-0.5">{index+1}</div>
                      <span className="text-neutral-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-10 grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 border border-neutral-200 rounded-lg">
                    <div className="font-bold text-xl">10K+</div>
                    <div className="text-xs tracking-wide text-neutral-600">Success</div>
                  </div>
                  <div className="p-4 border border-neutral-200 rounded-lg">
                    <div className="font-bold text-xl">98%</div>
                    <div className="text-xs tracking-wide text-neutral-600">Accuracy</div>
                  </div>
                  <div className="p-4 border border-neutral-200 rounded-lg">
                    <div className="font-bold text-xl">24/7</div>
                    <div className="text-xs tracking-wide text-neutral-600">Support</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Extended Information Section for page length */}
        <section className="py-24 border-t border-neutral-200 bg-white">
          <Container maxWidth="7xl">
            <div className="grid md:grid-cols-3 gap-12">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><ShieldIcon size={18}/> Enterprise Security</h3>
                <p className="text-sm leading-relaxed text-neutral-700">Your documents are processed securely and never shared. We follow strict data isolation principles and transient in-memory parsing.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><TargetIcon size={18}/> Precision Matching</h3>
                <p className="text-sm leading-relaxed text-neutral-700">Our scoring focuses on role-critical skill clusters, recency weighting, and semantic density—not just keyword stuffing.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><BarChartIcon size={18}/> Actionable Metrics</h3>
                <p className="text-sm leading-relaxed text-neutral-700">Get breakdowns that distinguish structural, linguistic, and strategic improvement areas so you know exactly where to iterate.</p>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </PageLayout>
  );
};

export default Login;