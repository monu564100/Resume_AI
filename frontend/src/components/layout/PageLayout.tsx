import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { motion } from 'framer-motion';
interface PageLayoutProps {
  children: React.ReactNode;
  withFooter?: boolean;
  withBackground?: boolean;
}
export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  withFooter = true,
  withBackground = true
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Navbar />
      <main className="flex-grow pt-16">
        {withBackground && (
          <div className="fixed inset-0 z-[-1] overflow-hidden">
            {/* Subtle monochrome pattern using CSS gradients */}
            <div className="absolute inset-0 opacity-40" style={{
              backgroundImage: 'linear-gradient(#f5f5f5 1px, transparent 1px), linear-gradient(90deg,#f5f5f5 1px, transparent 1px)',
              backgroundSize: '40px 40px, 40px 40px'
            }} />
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(circle at 25% 20%, rgba(0,0,0,0.05), transparent 60%), radial-gradient(circle at 75% 70%, rgba(0,0,0,0.04), transparent 55%)'
            }} />
          </div>
        )}
        <motion.div
          initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
          {children}
        </motion.div>
      </main>
      {withFooter && <Footer />}
    </div>
  );
};