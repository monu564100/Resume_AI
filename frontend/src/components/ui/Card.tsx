import React from 'react';
import { motion } from 'framer-motion';
interface CardProps {
  children: React.ReactNode;
  variant?: 'subtle' | 'muted' | 'solid';
  className?: string;
  animate?: boolean;
  padded?: boolean;
}
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'subtle',
  className = '',
  animate = true,
  padded = true
}) => {
  const variantClasses: Record<string, string> = {
    subtle: 'bg-white border border-neutral-200 shadow-sm',
    muted: 'bg-neutral-100 border border-neutral-300 shadow-sm',
    solid: 'bg-neutral-900 text-white border border-neutral-900 shadow'
  };
  const baseClasses = `rounded-xl ${padded ? 'p-6' : ''}`;
  if (animate) {
    return (
      <motion.div
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    );
  }
  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>{children}</div>;
};