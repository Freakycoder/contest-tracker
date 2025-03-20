// components/FloatingBackground.tsx
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const FloatingBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create between 15-20 floating elements
  const floatingElements = Array.from({ length: 18 }, (_, i) => ({
    id: `floating-${i}`,
    // Randomize initial positions
    x: Math.random() * 100,
    y: Math.random() * 100,
    // Randomize sizes between 20px and 60px
    size: Math.floor(Math.random() * 40) + 20,
    // Randomize animation duration between 20s and 40s
    duration: Math.floor(Math.random() * 20) + 20,
    // Randomize delay between 0s and 10s
    delay: Math.random() * 10,
    // Randomize opacity between 0.05 and 0.15
    opacity: (Math.random() * 0.1) + 5,
    // Randomize shape (0: circle, 1: square, 2: triangle)
    shape: Math.floor(Math.random() * 3),
  }));

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden -z-10">
      {floatingElements.map((element) => {
        // Generate different shapes based on the random shape value
        let shapeElement;
        if (element.shape === 0) {
          // Circle
          shapeElement = (
            <div 
              className="rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 absolute" 
              style={{ 
                width: `${element.size}px`, 
                height: `${element.size}px`,
                opacity: element.opacity 
              }}
            />
          );
        } else if (element.shape === 1) {
          // Square
          shapeElement = (
            <div 
              className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 absolute rounded-lg" 
              style={{ 
                width: `${element.size}px`, 
                height: `${element.size}px`,
                opacity: element.opacity,
                transform: `rotate(${Math.random() * 45}deg)`
              }}
            />
          );
        } else {
          // Triangle (using a rotated square with overflow hidden)
          shapeElement = (
            <div 
              className="overflow-hidden absolute" 
              style={{ 
                width: `${element.size}px`, 
                height: `${element.size}px`,
                opacity: element.opacity
              }}
            >
              <div 
                className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 absolute" 
                style={{ 
                  width: `${element.size * 1.5}px`, 
                  height: `${element.size * 1.5}px`,
                  transform: `rotate(45deg) translate(-${element.size * 0.2}px, -${element.size * 0.2}px)` 
                }}
              />
            </div>
          );
        }

        return (
          <motion.div
            key={element.id}
            className="absolute"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
              rotate: [0, Math.random() * 360, Math.random() * -360, 0],
            }}
            transition={{
              duration: element.duration,
              delay: element.delay,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            {shapeElement}
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingBackground;