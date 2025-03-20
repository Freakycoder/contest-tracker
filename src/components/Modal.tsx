// components/Modal.tsx
import { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { codeChefFilter, codeForceFilter, leetCodeFilter } from '@/types';
import { playlistVideo } from '@/types';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

interface ModalProps {
  children: React.ReactNode;
  contestObject: { title: string, platform: string };
  onClose: () => void;
}

const YOUTUBE_API_KEY = "AIzaSyBbi8pjbKVh0L-Z0q-kO95xc-jfejaQbTo";
const LEETCODE_PLAYLIST_ID = "PLcXpkI9A-RZI6FhydNz3JBt_-p_i25Cbr";
const CODEFORCES_PLAYLIST_ID = "PLcXpkI9A-RZLUfBSNp-YQBCOezZKbDSgB";
const CODECHEF_PLAYLIST_ID = "PLcXpkI9A-RZIZ6lsE0KCcLWeKNoG45fYr";

const Modal: React.FC<ModalProps> = ({ contestObject, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [videoData, setVideoData] = useState<playlistVideo[]>([]);
  const router = useRouter();
  let updatedResponse = []

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
        else if(contestObject.platform === "codeforce"){
          filteredResponse = codeForceFilter(response.data.items, contestObject.title);
        }
        else{
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Semi-transparent backdrop with blur effect */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <motion.div
        ref={modalRef}
        className="relative bg-white/90 backdrop-blur-md rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/20"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Glass effect header */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-md px-6 py-4 border-b border-white/20 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-8 bg-red-500 rounded-full"></div>
            <h3 className="text-xl font-semibold text-gray-800">{contestObject.title}</h3>
          </div>
          <motion.button
            onClick={onClose}
            className="p-2 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiX size={20} className="text-gray-700" />
          </motion.button>
        </div>

        {/* Content area with proper padding and glass effect */}
        <div className="overflow-y-auto max-h-[calc(90vh-5rem)] p-6 bg-white/70 backdrop-blur-md">
          {/* Loading state */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videoData.map((video, index) => (
              <motion.div
                key={video.videoId}
                className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -4, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => router.push(`https://www.youtube.com/watch?v=${video.videoId}&list=${video.playlistId}`)}
              >
                <div className="relative aspect-video">
                  {/* Premium looking thumbnail overlay */}
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Elegant play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity">
                    <div className="bg-red-600 text-white rounded-full p-4 shadow-lg transform translate-y-2 group-hover:translate-y-0 group-hover:scale-110 transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <polygon points="5 3 19 12 5 21"></polygon>
                      </svg>
                    </div>
                  </div>

                  {/* Video duration badge (you would need to add this data) */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    10:42
                  </div>
                </div>

                <div className="p-5">
                  <h4 className="font-medium text-lg line-clamp-2 text-gray-800 group-hover:text-red-600 transition-colors" title={video.title}>
                    {video.title}
                  </h4>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-2 h-5 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-500 font-medium">
                        {contestObject.platform} Solution
                      </span>
                    </div>

                    <button
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-sm group-hover:shadow-md transition-all"
                    >
                      Watch Now
                    </button>
                  </div>
                </div>

                {/* Elegant hover effect overlay */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500/30 rounded-xl transition-all duration-300 pointer-events-none"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;