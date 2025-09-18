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
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <Card variant="glassDark" className="sticky top-24">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-dark-100 flex items-center justify-center mb-4">
                    <UserIcon size={40} className="text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">{user?.name}</h2>
                  <p className="text-gray-400">{user?.email}</p>
                </div>
                <div className="space-y-4">
                  <Button variant={isEditing ? 'primary' : 'outline'} fullWidth onClick={() => setIsEditing(!isEditing)} className="flex items-center justify-center">
                    <UserIcon size={16} className="mr-2" />
                    {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                  </Button>
                  <Button variant={isChangingPassword ? 'primary' : 'outline'} fullWidth onClick={() => setIsChangingPassword(!isChangingPassword)} className="flex items-center justify-center">
                    <KeyIcon size={16} className="mr-2" />
                    {isChangingPassword ? 'Cancel' : 'Change Password'}
                  </Button>
                  <Button variant="outline" fullWidth onClick={handleLogout} className="flex items-center justify-center">
                    <LogOutIcon size={16} className="mr-2" />
                    Logout
                  </Button>
                </div>
              </Card>
            </div>
            {/* Main Content */}
            <div className="w-full md:w-2/3 lg:w-3/4">
              <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
              {isEditing ? <Card variant="glass" className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                  <form onSubmit={handleUpdateProfile}>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                          Full Name
                        </label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="bg-dark-50 border border-gray-700 text-white rounded-lg block w-full px-3 py-2.5 focus:ring-primary focus:border-primary" required />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                          Email Address
                        </label>
                        <input type="email" id="email" value={user?.email} className="bg-dark-50 border border-gray-700 text-white rounded-lg block w-full px-3 py-2.5 focus:ring-primary focus:border-primary" disabled />
                        <p className="text-gray-500 text-xs mt-1">
                          Email cannot be changed
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" variant="primary" className="flex items-center">
                        <SaveIcon size={16} className="mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </Card> : isChangingPassword ? <Card variant="glass" className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">
                    Change Password
                  </h2>
                  <form onSubmit={handleChangePassword}>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
                          Current Password
                        </label>
                        <input type="password" id="currentPassword" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="bg-dark-50 border border-gray-700 text-white rounded-lg block w-full px-3 py-2.5 focus:ring-primary focus:border-primary" required />
                      </div>
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                          New Password
                        </label>
                        <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="bg-dark-50 border border-gray-700 text-white rounded-lg block w-full px-3 py-2.5 focus:ring-primary focus:border-primary" minLength={6} required />
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                          Confirm New Password
                        </label>
                        <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="bg-dark-50 border border-gray-700 text-white rounded-lg block w-full px-3 py-2.5 focus:ring-primary focus:border-primary" minLength={6} required />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" variant="primary" className="flex items-center" disabled={newPassword !== confirmPassword}>
                        <SaveIcon size={16} className="mr-2" />
                        Update Password
                      </Button>
                    </div>
                  </form>
                </Card> : <Card variant="glass" className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">
                    Profile Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-dark-50 rounded-lg">
                      <UserIcon size={18} className="text-primary mr-3" />
                      <div>
                        <p className="text-gray-400 text-sm">Full Name</p>
                        <p className="font-medium">{user?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-dark-50 rounded-lg">
                      <MailIcon size={18} className="text-primary mr-3" />
                      <div>
                        <p className="text-gray-400 text-sm">Email Address</p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-dark-50 rounded-lg">
                      <KeyIcon size={18} className="text-primary mr-3" />
                      <div>
                        <p className="text-gray-400 text-sm">Password</p>
                        <p className="font-medium">••••••••</p>
                      </div>
                    </div>
                  </div>
                </Card>}
              <Card variant="glass">
                <h2 className="text-xl font-semibold mb-4">Account Activity</h2>
                <div className="space-y-4">
                  <div className="p-3 bg-dark-50 rounded-lg">
                    <p className="text-gray-400 text-sm">Last Login</p>
                    <p className="font-medium">Today at 10:30 AM</p>
                  </div>
                  <div className="p-3 bg-dark-50 rounded-lg">
                    <p className="text-gray-400 text-sm">Account Created</p>
                    <p className="font-medium">January 15, 2023</p>
                  </div>
                  <div className="p-3 bg-dark-50 rounded-lg">
                    <p className="text-gray-400 text-sm">Resumes Analyzed</p>
                    <p className="font-medium">3</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </Container>
    </PageLayout>;
};
export default Profile;