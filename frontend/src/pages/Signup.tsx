import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { AlertCircleIcon, LockIcon, MailIcon, UserIcon, ShieldIcon, TargetIcon, TrendingUpIcon } from 'lucide-react';
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
  return (
    <PageLayout withFooter={false}>
      <div className="min-h-screen bg-white text-black flex flex-col">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
          {/* Left: Form */}
          <div className="flex items-center justify-center px-4 sm:px-8 py-16 border-b lg:border-b-0 lg:border-r border-neutral-200 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{backgroundImage:'linear-gradient(#000 1px,transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px)',backgroundSize:'38px 38px,38px 38px'}} />
            <Container maxWidth="sm" className="w-full relative">
              <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.55}}>
                <div className="mb-10">
                  <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-neutral-100 border border-neutral-300 mb-6">
                    <span className="h-2 w-2 rounded-full bg-black" />
                    <span className="text-xs font-semibold tracking-wider">CREATE ACCOUNT</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Join the Platform</h1>
                  <p className="text-neutral-600 text-base md:text-lg leading-relaxed max-w-md">Sign up to analyze resumes, uncover skill gaps and access tailored job intelligence.</p>
                </div>
                <Card variant="subtle" className="p-8 shadow-sm">
                  {showError && (
                    <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="mb-6 p-4 rounded-lg bg-neutral-100 border border-neutral-300 flex items-center gap-3">
                      <AlertCircleIcon size={20} className="text-black" />
                      <span className="text-neutral-700 text-sm">{error}</span>
                    </motion.div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-5 mb-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserIcon size={18} className="text-neutral-500" /></div>
                          <input id="name" type="text" value={name} onChange={e=>setName(e.target.value)} className="bg-white border border-neutral-300 text-black rounded-lg block w-full pl-10 pr-3 py-3 placeholder-neutral-400 focus:ring-2 focus:ring-black/30 focus:border-black" placeholder="John Doe" required />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MailIcon size={18} className="text-neutral-500" /></div>
                          <input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} className="bg-white border border-neutral-300 text-black rounded-lg block w-full pl-10 pr-3 py-3 placeholder-neutral-400 focus:ring-2 focus:ring-black/30 focus:border-black" placeholder="you@example.com" required />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LockIcon size={18} className="text-neutral-500" /></div>
                          <input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="bg-white border border-neutral-300 text-black rounded-lg block w-full pl-10 pr-3 py-3 placeholder-neutral-400 focus:ring-2 focus:ring-black/30 focus:border-black" placeholder="••••••••" minLength={6} required />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">Confirm Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LockIcon size={18} className="text-neutral-500" /></div>
                          <input id="confirmPassword" type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="bg-white border border-neutral-300 text-black rounded-lg block w-full pl-10 pr-3 py-3 placeholder-neutral-400 focus:ring-2 focus:ring-black/30 focus:border-black" placeholder="••••••••" required />
                        </div>
                        {passwordError && <p className="text-xs text-neutral-600 mt-1">{passwordError}</p>}
                      </div>
                    </div>
                    <Button type="submit" variant="solid" fullWidth className="mb-4" disabled={isLoading}>{isLoading ? 'Creating Account...' : 'Sign Up'}</Button>
                    <div className="text-center text-sm text-neutral-600">
                      Already have an account? <Link to="/login" className="underline-offset-2 hover:underline text-black font-medium">Login</Link>
                    </div>
                  </form>
                </Card>
              </motion.div>
            </Container>
          </div>
          {/* Right: Value Proposition */}
          <div className="hidden lg:flex items-stretch bg-neutral-50 relative">
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{backgroundImage:'linear-gradient(#000 1px,transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px)',backgroundSize:'42px 42px,42px 42px'}} />
            <div className="w-full flex items-center justify-center p-16">
              <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{duration:0.7,delay:0.2}} className="max-w-md">
                <h2 className="text-4xl font-extrabold tracking-tight mb-6 leading-[1.1]">Designed for Clarity & Impact</h2>
                <p className="text-neutral-600 mb-8 leading-relaxed">Every signal extracted from your resume is distilled into actionable, prioritized recommendations—helping you iterate with intent.</p>
                <ul className="space-y-5 mb-10">
                  {['Secure document handling','Semantic keyword clustering','Role-aligned scoring','Skill depth analysis','Version comparison history'].map((item,i)=>(
                    <motion.li key={item} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.4+i*0.08}} className="flex gap-3">
                      <div className="h-6 w-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold mt-0.5">{i+1}</div>
                      <span className="text-neutral-700">{item}</span>
                    </motion.li>
                  ))}
                </ul>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 border border-neutral-200 rounded-lg"><div className="font-bold text-xl">10K+</div><div className="text-xs tracking-wide text-neutral-600">Users</div></div>
                  <div className="p-4 border border-neutral-200 rounded-lg"><div className="font-bold text-xl">98%</div><div className="text-xs tracking-wide text-neutral-600">Accuracy</div></div>
                  <div className="p-4 border border-neutral-200 rounded-lg"><div className="font-bold text-xl">24/7</div><div className="text-xs tracking-wide text-neutral-600">Access</div></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        {/* Extended Section */}
        <section className="py-24 border-t border-neutral-200 bg-white">
          <Container maxWidth="7xl">
            <div className="grid md:grid-cols-3 gap-12">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><ShieldIcon size={18}/> Privacy First</h3>
                <p className="text-sm leading-relaxed text-neutral-700">We never persist raw resume content. Processing happens in memory with controlled ephemeral parsing layers.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><TargetIcon size={18}/> Precision Fit</h3>
                <p className="text-sm leading-relaxed text-neutral-700">Role modeling emphasizes outcome-aligned capabilities and impact statements over buzzwords.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><TrendingUpIcon size={18}/> Growth Insights</h3>
                <p className="text-sm leading-relaxed text-neutral-700">Gap analysis surfaces strategic learning paths so each iteration compounds your positioning.</p>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </PageLayout>
  );
};
export default Signup;