import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PageLayout } from '../components/layout/PageLayout';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserIcon, MailIcon, KeyIcon, LogOutIcon, SaveIcon } from 'lucide-react';
const Profile: React.FC = () => {
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would update the user profile here
    setIsEditing(false);
  };
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would update the password here
    setIsChangingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  const handleLogout = () => {
    logout();
    navigate('/login');
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
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-neutral-100 border border-neutral-300 mb-6">
              <span className="h-2 w-2 rounded-full bg-black" />
              <span className="text-xs font-semibold tracking-wider">ACCOUNT CONTROL PANEL</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">Profile & Security</h1>
            <p className="text-neutral-600 max-w-2xl text-sm md:text-base leading-relaxed">Manage identity attributes, authentication credentials and activity telemetry from a consolidated surface. Precision adjustments propagate instantly.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-10">
            {/* Sidebar */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <Card variant="muted" className="sticky top-24 p-6">
                <div className="flex flex-col items-center mb-8">
                  <div className="w-24 h-24 rounded-full bg-neutral-200 flex items-center justify-center mb-4">
                    <UserIcon size={40} className="text-neutral-800" />
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight mb-1">{user?.name}</h2>
                  <p className="text-neutral-600 text-sm">{user?.email}</p>
                </div>
                <div className="space-y-3">
                  <Button variant={isEditing ? 'solid' : 'outline'} fullWidth onClick={() => {
                setIsEditing(!isEditing);
                setIsChangingPassword(false);
              }} size="sm" className="gap-2">
                    <UserIcon size={16} />
                    {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                  </Button>
                  <Button variant={isChangingPassword ? 'solid' : 'outline'} fullWidth onClick={() => {
                setIsChangingPassword(!isChangingPassword);
                setIsEditing(false);
              }} size="sm" className="gap-2">
                    <KeyIcon size={16} />
                    {isChangingPassword ? 'Cancel' : 'Change Password'}
                  </Button>
                  <Button variant="outline" fullWidth onClick={handleLogout} size="sm" className="gap-2">
                    <LogOutIcon size={16} />
                    Logout
                  </Button>
                </div>
                <div className="mt-10 pt-8 border-t border-neutral-300">
                  <h3 className="text-xs font-semibold tracking-wide uppercase mb-4 text-neutral-600">Security Notes</h3>
                  <ul className="space-y-3 text-[11px] tracking-wide uppercase text-neutral-600">
                    <li>Use unique credentials</li>
                    <li>Rotate passwords quarterly</li>
                    <li>Never share session tokens</li>
                  </ul>
                </div>
              </Card>
            </div>
            {/* Main Content */}
            <div className="w-full md:w-2/3 lg:w-3/4">
              {isEditing ? <Card variant="subtle" className="mb-10 p-8">
                  <h2 className="text-2xl font-semibold tracking-tight mb-2">Edit Profile</h2>
                  <p className="text-neutral-600 text-sm mb-8">Adjust top-level identity attributes. Persistent storage updates occur immediately on submit.</p>
                  <form onSubmit={handleUpdateProfile}>
                    <div className="space-y-6 mb-8">
                      <div>
                        <label htmlFor="name" className="block text-xs font-semibold tracking-wide uppercase text-neutral-600 mb-2">Full Name</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="bg-white border border-neutral-300 text-black rounded-lg block w-full px-3 py-2.5 focus:ring-2 focus:ring-black/30 focus:border-black" required />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-xs font-semibold tracking-wide uppercase text-neutral-600 mb-2">Email Address</label>
                        <input type="email" id="email" value={user?.email} className="bg-neutral-100 border border-neutral-300 text-neutral-600 rounded-lg block w-full px-3 py-2.5" disabled />
                        <p className="text-neutral-500 text-xs mt-2">Email cannot be changed</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
                      <span className="text-[11px] tracking-wide uppercase text-neutral-500">Direct write commit</span>
                      <Button type="submit" variant="solid" size="sm" className="gap-2">
                        <SaveIcon size={16} />
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </Card> : isChangingPassword ? <Card variant="subtle" className="mb-10 p-8">
                  <h2 className="text-2xl font-semibold tracking-tight mb-2">Change Password</h2>
                  <p className="text-neutral-600 text-sm mb-8">Strengthen credential integrity. New password must meet baseline complexity guidelines.</p>
                  <form onSubmit={handleChangePassword}>
                    <div className="space-y-6 mb-8">
                      <div>
                        <label htmlFor="currentPassword" className="block text-xs font-semibold tracking-wide uppercase text-neutral-600 mb-2">Current Password</label>
                        <input type="password" id="currentPassword" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="bg-white border border-neutral-300 text-black rounded-lg block w-full px-3 py-2.5 focus:ring-2 focus:ring-black/30 focus:border-black" required />
                      </div>
                      <div>
                        <label htmlFor="newPassword" className="block text-xs font-semibold tracking-wide uppercase text-neutral-600 mb-2">New Password</label>
                        <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="bg-white border border-neutral-300 text-black rounded-lg block w-full px-3 py-2.5 focus:ring-2 focus:ring-black/30 focus:border-black" minLength={6} required />
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-xs font-semibold tracking-wide uppercase text-neutral-600 mb-2">Confirm New Password</label>
                        <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="bg-white border border-neutral-300 text-black rounded-lg block w-full px-3 py-2.5 focus:ring-2 focus:ring-black/30 focus:border-black" minLength={6} required />
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
                      <span className="text-[11px] tracking-wide uppercase text-neutral-500">Secure hash update</span>
                      <Button type="submit" variant="solid" size="sm" className="gap-2" disabled={newPassword !== confirmPassword}>
                        <SaveIcon size={16} />
                        Update Password
                      </Button>
                    </div>
                  </form>
                </Card> : <Card variant="subtle" className="mb-10 p-8">
                  <h2 className="text-2xl font-semibold tracking-tight mb-6">Profile Overview</h2>
                  <div className="grid sm:grid-cols-2 gap-6 mb-10">
                    {[{ label: 'Full Name', value: user?.name, icon: <UserIcon size={16} /> }, { label: 'Email Address', value: user?.email, icon: <MailIcon size={16} /> }, { label: 'Password', value: '••••••••', icon: <KeyIcon size={16} /> }].map(item => <div key={item.label} className="rounded-lg border border-neutral-200 bg-white p-4 flex items-start gap-3">
                        <div className="h-8 w-8 rounded-md bg-neutral-900 text-white flex items-center justify-center shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-neutral-500 mb-1">{item.label}</p>
                          <p className="font-medium text-sm">{item.value}</p>
                        </div>
                      </div>)}
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[{ label: 'Profile Completeness', value: '78%' }, { label: 'Resume Versions', value: '3' }, { label: 'Applied Roles', value: '12' }].map(metric => <div key={metric.label} className="p-5 rounded-lg border border-neutral-200 bg-neutral-50">
                        <p className="text-[11px] uppercase tracking-wide text-neutral-500 mb-2">{metric.label}</p>
                        <p className="text-2xl font-extrabold tracking-tight">{metric.value}</p>
                        <div className="mt-3 h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                          <div className="h-full bg-black" style={{ width: metric.label === 'Profile Completeness' ? '78%' : metric.label === 'Resume Versions' ? '60%' : '40%' }} />
                        </div>
                      </div>)}
                  </div>
                </Card>}
              <Card variant="subtle" className="p-8">
                <h2 className="text-2xl font-semibold tracking-tight mb-6">Account Activity</h2>
                <div className="grid sm:grid-cols-3 gap-6 mb-10">
                  {[{ k: 'Last Login', v: 'Today 10:30 AM' }, { k: 'Account Created', v: 'Jan 15 2023' }, { k: 'Resumes Analyzed', v: '3' }].map(item => <div key={item.k} className="rounded-lg border border-neutral-200 bg-white p-4">
                      <p className="text-[11px] uppercase tracking-wide text-neutral-500 mb-1">{item.k}</p>
                      <p className="font-medium text-sm">{item.v}</p>
                    </div>)}
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {[{ h: 'Session Integrity', d: 'Active tokens valid and uncompromised.' }, { h: 'Credential Hygiene', d: 'Password age within recommended rotation window.' }, { h: 'Data Footprint', d: 'Minimal stored PII. Export on demand.' }].map(item => <div key={item.h} className="rounded-lg border border-neutral-200 bg-neutral-50 p-5">
                      <h3 className="text-sm font-semibold tracking-wide uppercase mb-2">{item.h}</h3>
                      <p className="text-neutral-600 text-sm leading-relaxed">{item.d}</p>
                    </div>)}
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </Container>
    </PageLayout>;
};
export default Profile;