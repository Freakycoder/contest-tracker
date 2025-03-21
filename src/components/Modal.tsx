// components/Modal.tsx
import { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { codeChefFilter, codeForceFilter, leetCodeFilter } from '@/types';
import { playlistVideo } from '@/types';
import { motion } from 'framer-motion';
import { FiMoon, FiSun, FiX } from 'react-icons/fi';
import { useTheme } from 'next-themes'; 

interface ModalProps {
  children: React.ReactNode;
  contestObject: { title: string, platform: string };
  onClose: () => void;
  isDarkMode : boolean
}

const YOUTUBE_API_KEY = "AIzaSyBbi8pjbKVh0L-Z0q-kO95xc-jfejaQbTo";
const LEETCODE_PLAYLIST_ID = "PLcXpkI9A-RZI6FhydNz3JBt_-p_i25Cbr";
const CODEFORCES_PLAYLIST_ID = "PLcXpkI9A-RZLUfBSNp-YQBCOezZKbDSgB";
const CODECHEF_PLAYLIST_ID = "PLcXpkI9A-RZIZ6lsE0KCcLWeKNoG45fYr";

const Modal: React.FC<ModalProps> = ({ contestObject, onClose, isDarkMode  }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [videoData, setVideoData] = useState<playlistVideo[]>([]);
  const router = useRouter();

  // Close modal when clicking outside
  useEffect(() => {
    const fetchContestVideos = async () => {
      try {
        let apiEndpoint = '';

        // Determine the appropriate API endpoint based on platform
        switch (contestObject.platform) {
          case 'leetcode':
            apiEndpoint = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${LEETCODE_PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`;
            break;
          case 'codeforces':
            apiEndpoint = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${CODEFORCES_PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`;
            break;
          case 'codechef':
            apiEndpoint = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${CODECHEF_PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`;
            break;
        }

        const response = await axios.get(apiEndpoint);
        let filteredResponse = []

        if (contestObject.platform === "leetcode") {
          filteredResponse = leetCodeFilter(response.data.items, contestObject.title);
        }
        else if (contestObject.platform === "codeforce") {
          filteredResponse = codeForceFilter(response.data.items, contestObject.title);
        }
        else {
          filteredResponse = codeChefFilter(response.data.items, contestObject.title);
        }
        const finalResponse = filteredResponse.map((video: any) => ({
          title: video.snippet.title,
          videoId: video.snippet.resourceId.videoId,
          playlistId: video.snippet.playlistId,
          thumbnail: video.snippet.thumbnails.high.url
        }));
        setVideoData(finalResponse);
      } catch (err) {
        console.error('Error fetching videos:', err);
      }
    };
    fetchContestVideos()
  }, [contestObject]);

  const accentColors = {
    primary: isDarkMode ? 'from-purple-600/20 to-pink-600/20' : 'from-violet-500/20 to-fuchsia-500/20',
    secondary: isDarkMode ? 'from-cyan-600/20 to-blue-600/20' : 'from-cyan-400/20 to-blue-500/20',
    highlight: isDarkMode ? 'purple-500' : 'violet-500',
    glow: isDarkMode ? '0 0 15px rgba(168, 85, 247, 0.5)' : '0 0 15px rgba(139, 92, 246, 0.5)'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Enhanced backdrop with additional blur and gradient */}
      <div 
        className={`absolute inset-0 backdrop-blur-md ${
          isDarkMode 
            ? 'bg-gradient-to-br from-black/70 via-gray-900/60 to-purple-900/30' 
            : 'bg-gradient-to-br from-black/40 via-gray-500/30 to-purple-300/20'
        }`}
      ></div>

      <motion.div
        ref={modalRef}
        className={`relative rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] 
          ${isDarkMode 
            ? 'bg-gray-900/80 text-white' 
            : 'bg-white/80 text-gray-800'} 
          backdrop-blur-lg border-t border-l shadow-2xl`}
        style={{
          boxShadow: isDarkMode 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 25px rgba(124, 58, 237, 0.3)' 
            : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 25px rgba(139, 92, 246, 0.15)',
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'
        }}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Enhanced glass effect header with beautiful gradient */}
        <div 
          className={`px-6 py-4 border-b flex justify-between items-center bg-gradient-to-r ${accentColors.primary} backdrop-blur-lg 
            ${isDarkMode ? 'border-gray-700/30' : 'border-white/40'}`}
          style={{
            boxShadow: isDarkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="flex items-center space-x-3">
            {/* Animated accent bar with glow effect */}
            <motion.div 
              className={`w-1.5 h-8 bg-gradient-to-b from-pink-500 to-${accentColors.highlight} rounded-full`}
              style={{ boxShadow: accentColors.glow }}
              animate={{ height: ["2rem", "1.75rem", "2rem"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {contestObject.title}
            </h3>
          </div>
          <motion.button
            onClick={onClose}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors
              ${isDarkMode 
                ? 'bg-gray-800/40 hover:bg-gray-700/60 border border-gray-700/50' 
                : 'bg-white/30 hover:bg-white/50 border border-white/50'}`}
            whileHover={{ scale: 1.1, boxShadow: accentColors.glow }}
            whileTap={{ scale: 0.9 }}
            aria-label="Close modal"
          >
            <FiX size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} />
          </motion.button>
        </div>

        {/* Enhanced content area with glass effect */}
        <div 
          className={`overflow-y-auto max-h-[calc(90vh-5rem)] p-6 backdrop-blur-md
            ${isDarkMode 
              ? 'bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80' 
              : 'bg-gradient-to-br from-white/90 via-white/70 to-white/90'}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videoData.map((video, index) => (
              <motion.div
                key={video.videoId}
                className={`group relative rounded-xl overflow-hidden transition-all duration-300
                  ${isDarkMode 
                    ? 'bg-gray-800/80 hover:bg-gray-800/90' 
                    : 'bg-white/80 hover:bg-white/90'}`}
                style={{
                  boxShadow: isDarkMode 
                    ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)' 
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.05)',
                  backdropFilter: 'blur(8px)'
                }}
                whileHover={{ 
                  y: -4, 
                  scale: 1.02,
                  boxShadow: isDarkMode 
                    ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 0 10px rgba(124, 58, 237, 0.2)' 
                    : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 0 10px rgba(139, 92, 246, 0.1)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => router.push(`https://www.youtube.com/watch?v=${video.videoId}&list=${video.playlistId}`)}
              >
                <div className="relative aspect-video">
                  {/* Enhanced thumbnail with subtle border */}
                  <div className="absolute inset-0 overflow-hidden rounded-t-xl">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Enhanced gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${
                    isDarkMode 
                      ? 'from-black/80 via-black/40 to-transparent' 
                      : 'from-black/70 via-black/30 to-transparent'
                  } opacity-80 group-hover:opacity-90 transition-opacity rounded-t-xl`}>
                    {/* Elegant play button overlay with enhanced effects */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        className="bg-gradient-to-tr from-red-600 to-red-500 text-white rounded-full p-4 shadow-lg"
                        style={{ boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)' }}
                        initial={{ opacity: 0.9, y: 2 }}
                        whileHover={{ opacity: 1, scale: 1.1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                          <polygon points="5 3 19 12 5 21"></polygon>
                        </svg>
                      </motion.div>
                    </div>
                  </div>

                  {/* Video duration badge with enhanced styling */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm border border-white/10">
                    10:42
                  </div>
                </div>

                <div className="p-5">
                  <h4 
                    className={`font-medium text-lg line-clamp-2 transition-colors
                      ${isDarkMode 
                        ? 'text-gray-100 group-hover:text-pink-400' 
                        : 'text-gray-800 group-hover:text-pink-500'}`} 
                    title={video.title}
                  >
                    {video.title}
                  </h4>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center">
                      {/* Animated accent bar */}
                      <motion.div 
                        className={`w-1.5 h-5 bg-gradient-to-b from-pink-500 to-${accentColors.highlight} rounded-full mr-2`}
                        animate={{ height: ["1.25rem", "1.1rem", "1.25rem"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.1 }}
                      />
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {contestObject.platform} Solution
                      </span>
                    </div>

                    {/* Enhanced button with gradient and glow */}
                    <motion.button
                      className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-sm transition-all text-white
                        ${isDarkMode 
                          ? 'bg-gradient-to-r from-pink-600 to-purple-600' 
                          : 'bg-gradient-to-r from-pink-500 to-purple-500'}`}
                      style={{
                        boxShadow: isDarkMode 
                          ? '0 2px 4px rgba(0,0,0,0.2)' 
                          : '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      whileHover={{
                        boxShadow: isDarkMode 
                          ? '0 4px 8px rgba(0,0,0,0.3), 0 0 10px rgba(219, 39, 119, 0.5)' 
                          : '0 4px 8px rgba(0,0,0,0.2), 0 0 10px rgba(219, 39, 119, 0.4)'
                      }}
                    >
                      Watch Now
                    </motion.button>
                  </div>
                </div>

                {/* Enhanced hover effect overlay with accent color */}
                <div 
                  className={`absolute inset-0 border-2 border-transparent rounded-xl transition-all duration-300 pointer-events-none
                    ${isDarkMode 
                      ? 'group-hover:border-purple-600/40' 
                      : 'group-hover:border-violet-500/40'}`}
                  style={{
                    boxShadow: 'inset 0 0 0 0 transparent',
                  }}
                ></div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;