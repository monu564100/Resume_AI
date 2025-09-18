import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { MenuIcon, XIcon, UserIcon, LogOutIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const {
    scrollY
  } = useScroll();
  const {
    user,
    isAuthenticated,
    logout
  } = useAuth();
  // Transform values for scroll-based animations
  const height = useTransform(scrollY, [0, 100], [80, 64]);
  const scale = useTransform(scrollY, [0, 100], [1, 0.95]);
  const opacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const links = [{
    name: 'Home',
    path: '/',
    public: true
  }, {
    name: 'Upload',
    path: '/upload',
    public: false
  }, {
    name: 'Dashboard',
    path: '/dashboard',
    public: false
  }, {
    name: 'Careers',
    path: '/careers',
    public: false
  }];
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };
  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
  };
  return <motion.nav className="fixed w-full z-50" initial={{
    opacity: 0,
    y: -20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }}>
      <motion.div className="bg-white/90 backdrop-blur border-b border-neutral-200" style={{
      height,
      opacity,
      borderBottomLeftRadius: '30px',
      borderBottomRightRadius: '30px'
    }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="flex items-center justify-between h-full" style={{
          scale
        }}>
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-1">
                <span className="text-2xl font-bold tracking-tight text-black">Resume</span>
                <span className="text-2xl font-bold tracking-tight text-neutral-600">Analyzer</span>
              </Link>
            </div>
            {/* Desktop menu */}
            <div className="hidden md:flex md:items-center">
              <div className="flex items-center space-x-4">
                {links.filter(link => link.public || isAuthenticated).map(link => <Link key={link.name} to={link.path} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-black underline' : 'text-neutral-600 hover:text-black'}`}>
                      {link.name}
                    </Link>)}
              </div>
              {isAuthenticated ? <div className="relative ml-4">
                  <button onClick={toggleProfileMenu} className="flex items-center space-x-2 bg-neutral-100 hover:bg-neutral-200 rounded-full p-1 focus:outline-none border border-neutral-300">
                    <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
                      <UserIcon size={16} className="text-black" />
                    </div>
                    <span className="text-sm font-medium text-neutral-700 pr-2">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </button>
                  {isProfileMenuOpen && <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white border border-neutral-200">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100" onClick={() => setIsProfileMenuOpen(false)}>
                        Your Profile
                      </Link>
                      <Link to="/dashboard" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100" onClick={() => setIsProfileMenuOpen(false)}>
                        Dashboard
                      </Link>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                        Sign out
                      </button>
                    </div>}
                </div> : <div className="ml-4 flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="solid" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>}
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md text-neutral-600 hover:text-black focus:outline-none" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <XIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && <motion.div className="md:hidden bg-white/95 backdrop-blur border-b border-neutral-200 rounded-b-3xl" initial={{
      opacity: 0,
      height: 0
    }} animate={{
      opacity: 1,
      height: 'auto'
    }} exit={{
      opacity: 0,
      height: 0
    }} transition={{
      duration: 0.2
    }}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.filter(link => link.public || isAuthenticated).map(link => <Link key={link.name} to={link.path} className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === link.path ? 'text-black underline' : 'text-neutral-600 hover:text-black'}`} onClick={() => setIsMenuOpen(false)}>
                  {link.name}
                </Link>)}
            {isAuthenticated ? <>
                <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-black" onClick={() => setIsMenuOpen(false)}>
                  Profile
                </Link>
                <button onClick={() => {
            handleLogout();
            setIsMenuOpen(false);
          }} className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-black">
                  <LogOutIcon size={16} className="mr-2" />
                  Sign out
                </button>
              </> : <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-black" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium text-black hover:underline" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </>}
          </div>
        </motion.div>}
    </motion.nav>;
};