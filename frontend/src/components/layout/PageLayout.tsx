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
  return <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        {withBackground && <div className="fixed inset-0 z-[-1]">
            <div className="absolute inset-0 gradient-bg grid-pattern"></div>
            <motion.div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary-500/20 blur-3xl" animate={{
          x: [0, 30, 0],
          y: [0, 20, 0]
        }} transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse'
        }} />
            <motion.div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-secondary-500/20 blur-3xl" animate={{
          x: [0, -30, 0],
          y: [0, -20, 0]
        }} transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: 'reverse'
        }} />
          </div>}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.3
      }} className="w-full">
          {children}
        </motion.div>
      </main>
      {withFooter && <Footer />}
    </div>;
};