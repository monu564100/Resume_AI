import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { AlertCircleIcon, LockIcon, MailIcon, UserIcon } from 'lucide-react';
const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    isAuthenticated,
    isLoading,
    error,
    clearError
  } = useAuth();
  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    // Show error if there is one
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate, error, clearError]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate passwords match
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    setPasswordError('');
    await register(name, email, password);
  };
  return <PageLayout withFooter={false}>
      <Container className="py-16 min-h-screen flex items-center justify-center">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="w-full max-w-md">
          <Card variant="glassDark" className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">
                <span className="text-primary text-glow-primary">Create</span>{' '}
                Account
              </h1>
              <p className="text-gray-400">
                Sign up to start analyzing your resume
              </p>
            </div>
            {showError && <motion.div initial={{
            opacity: 0,
            y: -10
          }} animate={{
            opacity: 1,
            y: 0
          }} className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-6 flex items-center">
                <AlertCircleIcon className="text-red-500 mr-2" size={18} />
                <span className="text-red-300 text-sm">{error}</span>
              </motion.div>}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon size={18} className="text-gray-400" />
                    </div>
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="bg-dark-50 border border-gray-700 text-white rounded-lg block w-full pl-10 pr-3 py-2.5 focus:ring-primary focus:border-primary" placeholder="John Doe" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MailIcon size={18} className="text-gray-400" />
                    </div>
                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-dark-50 border border-gray-700 text-white rounded-lg block w-full pl-10 pr-3 py-2.5 focus:ring-primary focus:border-primary" placeholder="you@example.com" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon size={18} className="text-gray-400" />
                    </div>
                    <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-dark-50 border border-gray-700 text-white rounded-lg block w-full pl-10 pr-3 py-2.5 focus:ring-primary focus:border-primary" placeholder="••••••••" minLength={6} required />
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon size={18} className="text-gray-400" />
                    </div>
                    <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="bg-dark-50 border border-gray-700 text-white rounded-lg block w-full pl-10 pr-3 py-2.5 focus:ring-primary focus:border-primary" placeholder="••••••••" required />
                  </div>
                  {passwordError && <p className="text-red-400 text-xs mt-1">{passwordError}</p>}
                </div>
              </div>
              <Button type="submit" variant="primary" fullWidth className="mb-4" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </Card>
        </motion.div>
      </Container>
    </PageLayout>;
};
export default Signup;