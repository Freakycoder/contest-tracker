// components/FloatingBackground.tsx
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

type FloatingBackgroundProps = {
  darkMode: boolean;
};

const FloatingBackground: React.FC<FloatingBackgroundProps> = ({ darkMode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create between 15-20 floating elements
  const floatingElements = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.floor(Math.random() * 40) + 20,
    duration: Math.floor(Math.random() * 20) + 20,
    opacity: (Math.random() * 0.1) + 5,
    shape: Math.floor(Math.random() * 3),
  }));

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden -z-10">
      {floatingElements.map((element) => {
        // Generate different shapes based on the random shape value
        let shapeElement;
        
        // Light and dark theme gradient combinations
        const lightGradients = [
          "from-blue-300/15 to-purple-400/20",
          "from-indigo-300/15 to-pink-400/15",
          "from-cyan-300/15 to-blue-400/20",
          "from-violet-300/15 to-fuchsia-400/15",
          "from-sky-300/15 to-indigo-400/15",
        ];
        
        const darkGradients = [
          "from-blue-500/15 to-purple-600/20",
          "from-indigo-500/20 to-pink-600/15",
          "from-cyan-400/15 to-blue-600/20",
          "from-violet-500/20 to-fuchsia-600/15",
          "from-sky-400/20 to-indigo-600/20",
        ];
        
        // Select a random gradient based on the theme
        const gradientIndex = element.id % 5;
        const gradientClasses = darkMode 
          ? darkGradients[gradientIndex]
          : lightGradients[gradientIndex];
        
        // Add a subtle glow effect based on the theme
        const glowColor = darkMode
          ? element.shape === 0 ? "0 0 40px rgba(139, 92, 246, 0.1)" // Violet glow for circles
          : element.shape === 1 ? "0 0 40px rgba(59, 130, 246, 0.1)" // Blue glow for squares
          : "0 0 40px rgba(236, 72, 153, 0.1)" // Pink glow for triangles
          : element.shape === 0 ? "0 0 40px rgba(147, 197, 253, 0.1)" // Light blue glow for circles
          : element.shape === 1 ? "0 0 40px rgba(196, 181, 253, 0.1)" // Light purple glow for squares
          : "0 0 40px rgba(251, 207, 232, 0.1)"; // Light pink glow for triangles
          
        if (element.shape === 0) {
          // Circle
          shapeElement = (
            <div 
              className={`rounded-full bg-gradient-to-br ${gradientClasses} absolute backdrop-blur-sm`} 
              style={{ 
                width: `${element.size}px`, 
                height: `${element.size}px`,
                opacity: element.opacity,
                boxShadow: glowColor,
                border: darkMode ? '1px solid rgba(255, 255, 255, 0.03)' : '1px solid rgba(0, 0, 0, 0.03)'
              }}
            />
          );
        } else if (element.shape === 1) {
          // Square
          shapeElement = (
            <div 
              className={`bg-gradient-to-br ${gradientClasses} absolute rounded-lg backdrop-blur-sm`} 
              style={{ 
                width: `${element.size}px`, 
                height: `${element.size}px`,
                opacity: element.opacity,
                transform: `rotate(${Math.random() * 45}deg)`,
                boxShadow: glowColor,
                border: darkMode ? '1px solid rgba(255, 255, 255, 0.03)' : '1px solid rgba(0, 0, 0, 0.03)'
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
                className={`bg-gradient-to-br ${gradientClasses} absolute backdrop-blur-sm`} 
                style={{ 
                  width: `${element.size * 1.5}px`, 
                  height: `${element.size * 1.5}px`,
                  transform: `rotate(45deg) translate(-${element.size * 0.2}px, -${element.size * 0.2}px)`,
                  boxShadow: glowColor,
                  border: darkMode ? '1px solid rgba(255, 255, 255, 0.03)' : '1px solid rgba(0, 0, 0, 0.03)'
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