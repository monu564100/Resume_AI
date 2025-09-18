import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
interface ImageGalleryProps {
  className?: string;
}
export const ImageGallery: React.FC<ImageGalleryProps> = ({
  className = ''
}) => {
  const [currentRow, setCurrentRow] = useState(0);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const [reachedEnd, setReachedEnd] = useState(false);
  // Sample images - you can replace these with your actual images
  const images = [
  // Row 1 - horizontal scrolling
  ['https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80', 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80', 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'],
  // Row 2 - appears after horizontal scrolling
  ['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80', 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80']];
  // Handle scroll event to detect when horizontal scrolling reaches the end
  useEffect(() => {
    const scrollContainer = horizontalScrollRef.current;
    const handleScroll = () => {
      if (!scrollContainer) return;
      const {
        scrollLeft,
        scrollWidth,
        clientWidth
      } = scrollContainer;
      // Check if we're near the end of horizontal scrolling (within 20px)
      if (scrollWidth - (scrollLeft + clientWidth) < 20 && !reachedEnd) {
        setReachedEnd(true);
        // After a short delay, show the next row
        setTimeout(() => {
          setCurrentRow(1);
        }, 500);
      }
    };
    scrollContainer?.addEventListener('scroll', handleScroll);
    return () => {
      scrollContainer?.removeEventListener('scroll', handleScroll);
    };
  }, [reachedEnd]);
  return <div className={`w-full ${className}`}>
      {/* First row - horizontal scrolling */}
      <motion.div className="overflow-x-auto pb-4 hide-scrollbar" ref={horizontalScrollRef} initial={{
      opacity: 0,
      x: 40
    }} animate={{
      opacity: 1,
      x: 0
    }} transition={{
      duration: 0.6
    }}>
        <div className="flex space-x-4 min-w-max px-4">
          {images[0].map((image, index) => <motion.div key={`row1-${index}`} className="flex-shrink-0 w-80 h-48 rounded-xl overflow-hidden" initial={{
          opacity: 0,
          x: 100
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.5,
          delay: index * 0.1
        }}>
              <img src={image} alt={`Gallery image ${index + 1}`} className="w-full h-full object-cover" />
            </motion.div>)}
        </div>
      </motion.div>
      {/* Second row - appears after horizontal scrolling */}
      {currentRow >= 1 && <motion.div className="mt-4" initial={{
      opacity: 0,
      y: 40
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6
    }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
            {images[1].map((image, index) => <motion.div key={`row2-${index}`} className="h-48 rounded-xl overflow-hidden" initial={{
          opacity: 0,
          y: 50
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: index * 0.1
        }}>
                <img src={image} alt={`Gallery image ${index + 1}`} className="w-full h-full object-cover" />
              </motion.div>)}
          </div>
        </motion.div>}
    </div>;
};