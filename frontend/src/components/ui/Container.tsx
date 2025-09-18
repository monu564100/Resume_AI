import React from 'react';
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}
export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  maxWidth = 'xl'
}) => {
  const maxWidthClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };
  return <div className={`w-full mx-auto px-4 sm:px-6 ${maxWidthClasses[maxWidth]} ${className}`}>
      {children}
    </div>;
};