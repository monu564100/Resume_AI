import React from 'react';
import { motion } from 'framer-motion';
interface CardProps {
  children: React.ReactNode;
  variant?: 'subtle' | 'muted' | 'solid';
  className?: string;
  animate?: boolean;
  padded?: boolean;
  onClick?: () => void;
  as?: 'div' | 'button';
}
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'subtle',
  className = '',
  animate = true,
  padded = true,
  onClick,
  as = 'div'
}) => {
  const variantClasses: Record<string, string> = {
    subtle: 'bg-white border border-neutral-200 shadow-sm',
    muted: 'bg-neutral-100 border border-neutral-300 shadow-sm',
    solid: 'bg-neutral-900 text-white border border-neutral-900 shadow'
  };
  const baseClasses = `rounded-xl ${padded ? 'p-6' : ''}`;
  const interactiveClasses = onClick ? 'cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-black/40' : '';
  const Comp: React.ElementType = as === 'button' ? (animate ? motion.button : 'button') : (animate ? motion.div : 'div');
  return (
    <Comp
      className={`${baseClasses} ${variantClasses[variant]} ${interactiveClasses} ${className}`}
      {...(animate ? { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } } : {})}
      onClick={onClick}
      type={as === 'button' ? 'button' : undefined}
    >
      {children}
    </Comp>
  );
};