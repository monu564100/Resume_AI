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
  CheckCircleIcon,
  SparklesIcon
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
      <div className="min-h-screen flex">
        {/* Left Panel - Login Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-dark-200 via-dark-100 to-dark-200">
          <Container maxWidth="sm" className="w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <div className="text-center mb-8">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <SparklesIcon size={16} className="text-primary" />
                  <span className="text-sm font-medium text-primary">Welcome Back</span>
                </motion.div>

                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Sign in to your account
                </h1>
                <p className="text-gray-400 text-lg">
                  Continue your career transformation journey
                </p>
              </div>

              <Card variant="glass" className="p-8 lg:p-10 backdrop-blur-xl">
                {showError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3"
                  >
                    <AlertCircleIcon size={20} className="text-red-400 flex-shrink-0" />
                    <p className="text-red-300 text-sm">{error}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MailIcon size={20} className="text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-dark-100/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockIcon size={20} className="text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 bg-dark-100/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
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
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-600 rounded bg-dark-100/50"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                        Remember me
                      </label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:text-primary-400 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
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

                <div className="mt-8 text-center">
                  <p className="text-gray-400">
                    Don't have an account?{' '}
                    <Link
                      to="/signup"
                      className="text-primary hover:text-primary-400 font-medium transition-colors"
                    >
                      Sign up for free
                    </Link>
                  </p>
                </div>
              </Card>
            </motion.div>
          </Container>
        </div>

        {/* Right Panel - Features */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex items-center justify-center p-12">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-lg"
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
                Transform Your Career with{' '}
                <span className="text-primary">AI-Powered</span> Insights
              </h2>
              
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of professionals who've accelerated their careers with our intelligent resume analysis platform.
              </p>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircleIcon size={16} className="text-primary" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-8 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">10,000+</div>
                  <div className="text-gray-400">Success Stories</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Login;