import { useState, useEffect, Fragment, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { FiBookmark, FiSearch, FiX, FiExternalLink, FiCode, FiCalendar, FiBarChart, FiSun, FiMoon } from 'react-icons/fi';
import { Contest, Platform } from '../types/index';
import Modal from '../components/Modal';
import FloatingBackground from '../components/FloatingBackground';
import axios from 'axios';

// Platform logos - ensure they're optimized for frontend rendering
const leetcodeLogo = "https://leetcode.com/static/images/LeetCode_logo_rvs.png";
const codechefLogo = "https://www.codechef.com/favicon.ico";
const codeforcesLogo = "https://cdn.iconscout.com/icon/free/png-256/free-code-forces-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-vol-2-pack-logos-icons-2944796.png?f=webp&w=256";

interface SolutionModalProps {
  contestTitle: string,
  contestPlatform: string
}

const Home = () => {
  // State hooks
  const initialContests = useMemo(() => [], []);
  const [contests, setContests] = useState<Contest[]>([]);
  const [filteredContests, setFilteredContests] = useState<Contest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlatforms, setActivePlatforms] = useState<Platform[]>([
    Platform.LEETCODE,
    Platform.CODEFORCES,
    Platform.CODECHEF,
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState<SolutionModalProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [bookmarks, setBookmarks] = useState<Contest[]>([]);
  const [isBookmarks, setIsBookmarks] = useState<boolean>(false)
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Fetch contests from various platforms
  useEffect(() => {
    const fetchAllContests = async () => {
      try {
        setIsLoading(true);

        // In a real application, these would be actual API calls
        const leetcodeContests = await axios.get(`http://localhost:3001/leetcode/contest-list`)
        const leetcode = leetcodeContests.data.slice(0, 10).map((video: any) => ({
          title: video.title,
          platform: "leetcode",
          startTime: formatDateFromSeconds(video.startTime),
          url: `https://leetcode.com/contest/${video.titleSlug}`,
          isFinished: ((video.startTime * 1000) > Date.now()) ? false : true,
          isBookmarked: false,
        }))

        const codeforcesContests = await axios.get(`http://localhost:3001/codeforce/contest-list`);

        const codeforce = codeforcesContests.data.result.slice(0, 10).map((video: any) => ({
          title: video.name,
          platform: "codeforces",
          startTime: formatDateFromSeconds(video.startTimeSeconds),
          url: "https://codeforces.com",
          isFinished: (video.phase) === "BEFORE" ? false : true,
          isBookmarked: false
        }))
        const codechefContests = await axios.get(`http://localhost:3001/codechef/contest-list`);

        const codechefupcoming = codechefContests.data.future_contests.map((video: any) => ({
          title: video.contest_name,
          platform: "codechef",
          startTime: video.contest_start_date,
          url: `https://codechef.com/${video.contest_code}`,
          isFinished: false,
          isBookmarked: false
        }))

        const codechefdone = codechefContests.data.past_contests.map((video: any) => ({
          title: video.contest_name,
          platform: "codechef",
          startTime: video.contest_start_date,
          url: `https://codechef.com/${video.contest_code}`,
          isFinished: true,
          isBookmarked: false
        }))

        const allContests = [
          ...leetcode,
          ...codeforce,
          ...codechefupcoming,
          ...codechefdone
        ];

        setContests(allContests);
        setFilteredContests(allContests);
      } catch (error) {
        console.error("Failed to fetch contests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('darkMode');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (savedTheme !== null) {
        setDarkMode(savedTheme === 'true');
      } else if (prefersDark) {
        // Use system preference if no saved preference
        setDarkMode(true);
      }
    }

    // Only fetch contests client-side to avoid hydration errors
    if (hasMounted) {
      fetchAllContests();
    }
  }, [hasMounted]);

  // Filter contests based on search query and active platforms
  useEffect(() => {
    if (contests.length === 0) return;

    const filtered = contests.filter(contest => {
      const matchesSearch = contest.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlatform = activePlatforms.includes(contest.platform);
      return matchesSearch && matchesPlatform;
    });

    setFilteredContests(filtered);
  }, [searchQuery, activePlatforms, contests]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', (!darkMode).toString());
    }
  };

  // Toggle platform filter
  const togglePlatform = (platform: Platform) => {
    if (activePlatforms.includes(platform)) {
      setActivePlatforms(activePlatforms.filter(p => p !== platform));
    } else {
      setActivePlatforms([...activePlatforms, platform]);
    }
  };

  // Toggle bookmark for a contest
  const toggleBookmarkColor = (contestTitle: string) => {
    setContests(contests.map(contest =>
      contest.title === contestTitle
        ? { ...contest, isBookmarked: !contest.isBookmarked }
        : contest
    ));
  };

  const toggleBookmark = (contest: Contest) => {
    setBookmarks((prevBookmarks) => {
      const isBookmarked = prevBookmarks.some((item) => item.title === contest.title); // Compare by ID

      if (isBookmarked) {
        return prevBookmarks.filter((item) => item.title !== contest.title); // Remove contest by ID
      } else {
        return [...prevBookmarks, contest]; // Add contest
      }
    });
  };



  // Open solution modal
  const openSolutionModal = (contestTitle: string, contestPlatform: string) => {
    setSelectedContest({ contestTitle, contestPlatform });
    setIsModalOpen(true);
  };


  // Platform-specific colors
  const getPlatformColor = (platform: Platform): string => {
    switch (platform) {
      case Platform.LEETCODE:
        return '#FFA116';
      case Platform.CODEFORCES:
        return '#1790C9';
      case Platform.CODECHEF:
        return '#674923';
      default:
        return '#333';
    }
  };

  // Platform-specific icons
  const getPlatformIcon = (platform: Platform): string => {
    switch (platform) {
      case Platform.LEETCODE:
        return leetcodeLogo;
      case Platform.CODEFORCES:
        return codeforcesLogo;
      case Platform.CODECHEF:
        return codechefLogo;
      default:
        return '';
    }
  };

  const formatDateFromSeconds = (seconds: number): string => {
    const date = new Date(seconds * 1000); // Convert seconds to milliseconds
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',  // Full day of the week (e.g., "Monday")
      year: 'numeric',  // Full numeric year (e.g., "2025")
      month: 'long',    // Full month name (e.g., "March")
      day: 'numeric',   // Day of the month as a number (e.g., "20")
      hour: '2-digit',  // 2-digit hour (e.g., "04")
      minute: '2-digit',// 2-digit minute (e.g., "30")
      second: '2-digit',// 2-digit second (e.g., "45")
      hour12: true,     // AM/PM time format (e.g., "PM" instead of 24-hour format)
    }).format(date);
  };


  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-black-700 text-white' : 'bg-gray-50'}`}>
      <Head>
        <title>CodeTracker - All Coding Contests</title>
        <meta name="description" content="Track all coding contests from LeetCode, CodeForces, and CodeChef" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      
      { hasMounted && <FloatingBackground darkMode = {darkMode}/>}

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Theme toggle button - top right corner */}
        <motion.button
          className={`fixed top-4 right-4 p-3 rounded-full z-50 ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-700'} shadow-lg`}
          onClick={toggleTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </motion.button>

        <header className="mb-12">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl md:text-6xl font-bold mb-6 relative inline-block"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <span className={`text-transparent bg-clip-text ${darkMode ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300' : 'bg-gradient-to-r from-blue-700 via-purple-600 to-blue-500'}`}>Code</span>
              <motion.span
                className={`text-transparent bg-clip-text ${darkMode ? 'bg-gradient-to-r from-purple-400 to-indigo-400' : 'bg-gradient-to-r from-purple-600 to-indigo-600'} font-black`}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                Tracker
              </motion.span>
            </motion.h1>

            <motion.p
              className={`text-xl max-w-2xl mx-auto font-light leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Your <span className={`font-semibold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>ultimate companion</span> for tracking competitive coding contests across multiple platforms
            </motion.p>
          </motion.div>
        </header>

        {/* Enhanced Search & Filter Container with Glassmorphic Effect */}
        <motion.div
          className={`rounded-xl overflow-hidden backdrop-blur-lg mb-8 border-t border-l shadow-2xl
          ${darkMode
              ? 'bg-gray-900/80 text-white border-white/10'
              : 'bg-white/80 text-gray-800 border-white/40'}`}
          style={{
            boxShadow: darkMode
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 25px rgba(124, 58, 237, 0.3)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 25px rgba(139, 92, 246, 0.15)'
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {/* Enhanced gradient header */}
          <div
            className={`px-6 py-4 border-b flex justify-between items-center bg-gradient-to-r backdrop-blur-lg
            ${darkMode
                ? 'from-purple-900/40 to-blue-900/40 border-gray-700/30'
                : 'from-purple-200/70 to-blue-200/70 border-white/40'}`}
            style={{
              boxShadow: darkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="flex items-center space-x-3">
              {/* Animated accent bar with glow effect */}
              <motion.div
                className={`w-1.5 h-8 rounded-full 
                ${darkMode
                    ? 'bg-gradient-to-b from-pink-500 to-purple-500'
                    : 'bg-gradient-to-b from-pink-400 to-purple-400'}`}
                style={{
                  boxShadow: darkMode
                    ? '0 0 10px rgba(219, 39, 119, 0.5)'
                    : '0 0 10px rgba(219, 39, 119, 0.4)'
                }}

                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Find Contests
              </h3>
            </div>
          </div>

          <div className="p-6 backdrop-blur-md
          ${darkMode 
            ? 'bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80' 
            : 'bg-gradient-to-br from-white/90 via-white/70 to-white/90'}">

            {/* Search bar with enhanced glass effect */}
            <div className="relative mb-6">
              <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`}>
                <FiSearch size={18} />
              </div>
              <input
                type="text"
                placeholder="Search contests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg transition-all border backdrop-blur-sm
                ${darkMode
                    ? 'bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    : 'bg-white/50 border-gray-200/60 text-gray-900 focus:ring-2 focus:ring-purple-400 focus:border-transparent'}`}
                style={{
                  boxShadow: darkMode
                    ? 'inset 0 2px 4px rgba(0,0,0,0.2)'
                    : 'inset 0 2px 4px rgba(0,0,0,0.05)'
                }}
              />
              {searchQuery && (
                <motion.button
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                >
                  <FiX />
                </motion.button>
              )}
            </div>

            {/* Platform filters with enhanced styling */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-2">
              {/* Platform filter buttons */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <motion.button
                  onClick={() => togglePlatform(Platform.LEETCODE)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 backdrop-blur-sm border
                  ${activePlatforms.includes(Platform.LEETCODE)
                      ? darkMode
                        ? 'bg-amber-800/60 text-amber-100 border-amber-700/70'
                        : 'bg-amber-400/20 text-amber-800 border-amber-300/70'
                      : darkMode
                        ? 'bg-gray-800/60 text-gray-300 border-gray-700/50 hover:bg-gray-700/60'
                        : 'bg-gray-200/40 text-gray-600 border-gray-200/60 hover:bg-gray-200/60'
                    }`}
                  style={{
                    boxShadow: activePlatforms.includes(Platform.LEETCODE)
                      ? darkMode
                        ? '0 0 10px rgba(217, 119, 6, 0.3)'
                        : '0 0 10px rgba(245, 158, 11, 0.2)'
                      : 'none'
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: darkMode
                      ? '0 0 12px rgba(217, 119, 6, 0.4)'
                      : '0 0 12px rgba(245, 158, 11, 0.3)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {hasMounted && <img src={leetcodeLogo} className="w-5 h-5 sm:w-6 sm:h-6" alt="LeetCode" />}
                  <span>LeetCode</span>
                </motion.button>

                <motion.button
                  onClick={() => togglePlatform(Platform.CODEFORCES)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 backdrop-blur-sm border
                  ${activePlatforms.includes(Platform.CODEFORCES)
                      ? darkMode
                        ? 'bg-blue-800/60 text-blue-100 border-blue-700/70'
                        : 'bg-blue-400/20 text-blue-800 border-blue-300/70'
                      : darkMode
                        ? 'bg-gray-800/60 text-gray-300 border-gray-700/50 hover:bg-gray-700/60'
                        : 'bg-gray-200/40 text-gray-600 border-gray-200/60 hover:bg-gray-200/60'
                    }`}
                  style={{
                    boxShadow: activePlatforms.includes(Platform.CODEFORCES)
                      ? darkMode
                        ? '0 0 10px rgba(29, 78, 216, 0.3)'
                        : '0 0 10px rgba(59, 130, 246, 0.2)'
                      : 'none'
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: darkMode
                      ? '0 0 12px rgba(29, 78, 216, 0.4)'
                      : '0 0 12px rgba(59, 130, 246, 0.3)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {hasMounted && <img src={codeforcesLogo} className="w-4 h-4 sm:w-5 sm:h-5" alt="CodeForces" />}
                  <span>CodeForces</span>
                </motion.button>

                <motion.button
                  onClick={() => togglePlatform(Platform.CODECHEF)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 backdrop-blur-sm border
                  ${activePlatforms.includes(Platform.CODECHEF)
                      ? darkMode
                        ? 'bg-amber-800/60 text-amber-100 border-amber-700/70'
                        : 'bg-amber-400/20 text-amber-800 border-amber-300/70'
                      : darkMode
                        ? 'bg-gray-800/60 text-gray-300 border-gray-700/50 hover:bg-gray-700/60'
                        : 'bg-gray-200/40 text-gray-600 border-gray-200/60 hover:bg-gray-200/60'
                    }`}
                  style={{
                    boxShadow: activePlatforms.includes(Platform.CODECHEF)
                      ? darkMode
                        ? '0 0 10px rgba(217, 119, 6, 0.3)'
                        : '0 0 10px rgba(245, 158, 11, 0.2)'
                      : 'none'
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: darkMode
                      ? '0 0 12px rgba(217, 119, 6, 0.4)'
                      : '0 0 12px rgba(245, 158, 11, 0.3)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {hasMounted && <img src={codechefLogo} className="w-4 h-4 sm:w-5 sm:h-5 rounded-full" alt="CodeChef" />}
                  <span>CodeChef</span>
                </motion.button>
              </div>

              {/* Bookmark filter buttons */}
              <div className="flex gap-2 self-end sm:self-auto">
                {isBookmarks && (
                  <motion.button
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 backdrop-blur-sm border
                    ${darkMode
                        ? 'bg-purple-900/80 text-purple-100 border-purple-700/70'
                        : 'bg-purple-400/20 text-purple-800 border-purple-300/70'}`}
                    style={{
                      boxShadow: darkMode
                        ? '0 0 10px rgba(124, 58, 237, 0.3)'
                        : '0 0 10px rgba(139, 92, 246, 0.2)'
                    }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: darkMode
                        ? '0 0 12px rgba(124, 58, 237, 0.4)'
                        : '0 0 12px rgba(139, 92, 246, 0.3)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsBookmarks(false)}
                  >
                    <FiBarChart size={16} />
                    <span className="whitespace-nowrap">All Contest</span>
                  </motion.button>
                )}

                <motion.button
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 backdrop-blur-sm border
                  ${darkMode
                      ? 'bg-blue-900/80 text-blue-100 border-blue-700/70'
                      : 'bg-blue-400/20 text-blue-600 border-blue-300/70'}`}
                  style={{
                    boxShadow: darkMode
                      ? '0 0 10px rgba(29, 78, 216, 0.3)'
                      : '0 0 10px rgba(59, 130, 246, 0.2)'
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: darkMode
                      ? '0 0 12px rgba(29, 78, 216, 0.4)'
                      : '0 0 12px rgba(59, 130, 246, 0.3)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsBookmarks(true)}
                >
                  <FiBookmark size={16} />
                  <span className="whitespace-nowrap">My Bookmarks</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12">
            <motion.div
              className={`inline-block w-12 h-12 border-4 ${darkMode ? 'border-blue-400' : 'border-blue-500'} border-t-transparent rounded-full`}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading contests...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {(isBookmarks ? bookmarks : filteredContests).map((contest) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow ${darkMode ? 'bg-slate-900' : 'bg-white'
                    }`}
                >
                  {/* Redesigned card header */}
                  <div
                    className="p-4 border-b relative"
                    style={{
                      borderColor: darkMode
                        ? `${getPlatformColor(contest.platform)}70`
                        : `${getPlatformColor(contest.platform)}20`
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center p-1.5"
                          style={{
                            backgroundColor: darkMode
                              ? `${getPlatformColor(contest.platform)}40`
                              : `${getPlatformColor(contest.platform)}15`
                          }}
                        >
                          <img
                            src={getPlatformIcon(contest.platform)}
                            alt={contest.platform}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: darkMode
                                ? `${getPlatformColor(contest.platform)}40`
                                : `${getPlatformColor(contest.platform)}15`,
                              color: darkMode
                                ? `${getPlatformColor(contest.platform)}FF`
                                : getPlatformColor(contest.platform)
                            }}
                          >
                            {contest.platform}
                          </span>
                          <h3 className={`text-lg font-medium mt-0.5 ${darkMode ? 'text-blue-50' : 'text-gray-800'
                            }`}>{contest.title}</h3>
                        </div>
                      </div>
                      {
                        isBookmarks === false ? (
                          <motion.button
                            onClick={() => {
                              toggleBookmark(contest)
                              toggleBookmarkColor(contest.title)
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-lg p-1.5 rounded-full"
                            style={{
                              color: contest.isBookmarked
                                ? (darkMode ? "#60A5FA" : "#3B82F6")
                                : (darkMode ? "#A5B4FC" : "#9CA3AF")
                            }}
                          >
                            <FiBookmark
                              fill={contest.isBookmarked
                                ? (darkMode ? "#60A5FA" : "#3B82F6")
                                : "none"}
                              size={18}
                            />
                          </motion.button>
                        ) : (null)
                      }
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="p-4">
                    {/* Status indicator */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 ${contest.isFinished
                            ? darkMode
                              ? 'bg-red-900/30 text-red-300 border border-red-700'
                              : 'bg-red-50 text-red-600 border border-red-200'
                            : darkMode
                              ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-700'
                              : 'bg-green-50 text-green-600 border border-green-200'
                          }`}
                      >
                        {contest.isFinished ? 'Finished' : 'Upcoming'}
                      </span>
                    </div>

                    {/* Time info */}
                    <div className={`space-y-2 mb-4 text-sm ${darkMode ? 'text-indigo-200' : 'text-gray-600'
                      }`}>
                      <div className="flex items-center gap-2">
                        <FiCalendar className={`${darkMode ? 'text-indigo-300' : 'text-gray-400'
                          } flex-shrink-0`} size={16} />
                        <div>
                          <div className="flex gap-1">
                            <span className={
                              darkMode ? 'text-indigo-300' : 'text-gray-500'
                            }>Start:</span>
                            <span className="font-medium">{contest.startTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between mt-5">
                      <a
                        href={contest.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${darkMode
                            ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                      >
                        <FiExternalLink size={14} />
                        Visit
                      </a>

                      <button
                        onClick={() => openSolutionModal(contest.title, contest.platform)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${darkMode
                            ? 'bg-blue-800/50 text-blue-100 hover:bg-blue-700/50'
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                          }`}
                      >
                        <FiCode size={14} />
                        Solutions
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Solution Modal - Updated for dark mode */}
      <AnimatePresence>
        {isModalOpen && selectedContest && (
          <Modal
            onClose={() => setIsModalOpen(false)}
            contestObject={{ platform: selectedContest.contestPlatform, title: selectedContest.contestTitle }}
            isDarkMode={darkMode}
          >
            <div className="p-6">
              <p className={`italic ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                This modal would contain the solutions for {selectedContest.contestTitle}.
              </p>
              <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                (Solutions content would be displayed here)
              </p>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;