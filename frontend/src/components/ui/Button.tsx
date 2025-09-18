import React from 'react';
import { motion } from 'framer-motion';
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  className?: string;
}
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onClick,
  disabled = false,
  type = 'button',
  icon,
  className = ''
}) => {
  const baseClasses = 'rounded-md font-medium transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-400';
  const variantClasses = {
    primary: 'bg-primary text-dark-800 hover:bg-primary-400 focus:ring-primary-300 glow-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary-400 focus:ring-secondary-300 glow-secondary',
    outline: 'bg-transparent border border-gray-600 text-white hover:bg-dark-50 focus:ring-gray-500',
    ghost: 'bg-transparent text-white hover:bg-dark-50 focus:ring-gray-500'
  };
  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3'
  };
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  return <motion.button type={type} onClick={onClick} disabled={disabled} className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`} whileTap={{
    scale: disabled ? 1 : 0.97
  }} whileHover={disabled ? {} : {
    scale: 1.02
  }}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>;
};