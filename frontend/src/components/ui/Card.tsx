import React from 'react';
import { motion } from 'framer-motion';
interface CardProps {
  children: React.ReactNode;
  variant?: 'glass' | 'glassDark' | 'solid';
  className?: string;
  animate?: boolean;
}
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  className = '',
  animate = true
}) => {
  const variantClasses = {
    glass: 'glass',
    glassDark: 'glass-dark',
    solid: 'bg-dark-50'
  };
  const baseClasses = 'rounded-xl p-6';
  if (animate) {
    return <motion.div className={`${baseClasses} ${variantClasses[variant]} ${className}`} initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.4
    }}>
        {children}
      </motion.div>;
  }
  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>;
};