import React from 'react';
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  padded?: boolean;
}
export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  maxWidth = '6xl',
  padded = true
}) => {
  const maxWidthClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  };
  const padding = padded ? 'px-4 sm:px-6 lg:px-8' : '';
  return <div className={`w-full mx-auto ${padding} ${maxWidthClasses[maxWidth]} ${className}`}>
      {children}
    </div>;
};