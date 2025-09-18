import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, AlertCircleIcon, LoaderIcon } from 'lucide-react';
type Status = 'idle' | 'loading' | 'success' | 'error';
type Size = 'collapsed' | 'expanded';
interface DynamicIslandProps {
  status: Status;
  size: Size;
  title: string;
  message?: string;
  progress?: number;
  onClose?: () => void;
}
export const DynamicIsland: React.FC<DynamicIslandProps> = ({
  status,
  size,
  title,
  message,
  progress = 0,
  onClose
}) => {
  const isExpanded = size === 'expanded';
  const statusIcons = {
    idle: null,
    loading: <LoaderIcon className="animate-spin" size={20} />,
    success: <CheckCircleIcon size={20} className="text-primary" />,
    error: <AlertCircleIcon size={20} className="text-red-500" />
  };
  const variants = {
    collapsed: {
      height: '48px',
      width: isExpanded ? '300px' : '180px'
    },
    expanded: {
      height: '120px',
      width: '300px'
    }
  };
  return <motion.div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 glass-dark rounded-full flex items-center justify-center overflow-hidden" initial={size === 'collapsed' ? 'collapsed' : 'expanded'} animate={size === 'collapsed' ? 'collapsed' : 'expanded'} variants={variants} transition={{
    type: 'spring',
    stiffness: 300,
    damping: 30
  }}>
      <div className="w-full h-full px-4 py-2 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div key={`${status}-${size}`} initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -10
        }} className="w-full">
            {size === 'collapsed' ? <div className="flex items-center justify-center space-x-2">
                {statusIcons[status]}
                <span className="text-sm font-medium">{title}</span>
              </div> : <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2 mb-2">
                  {statusIcons[status]}
                  <span className="text-base font-medium">{title}</span>
                </div>
                {message && <p className="text-sm text-gray-300 text-center mb-2">
                    {message}
                  </p>}
                {status === 'loading' && <div className="w-full bg-dark-300 rounded-full h-2 mt-2">
                    <motion.div className="bg-primary h-2 rounded-full" initial={{
                width: 0
              }} animate={{
                width: `${progress}%`
              }} transition={{
                duration: 0.3
              }} />
                  </div>}
                {(status === 'success' || status === 'error') && onClose && <button onClick={onClose} className="text-xs text-gray-400 hover:text-white mt-2">
                    Dismiss
                  </button>}
              </div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>;
};