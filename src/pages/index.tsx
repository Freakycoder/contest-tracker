import { useState, useEffect, Fragment, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { FiBookmark, FiSearch, FiX, FiExternalLink, FiCode, FiCalendar, FiBarChart } from 'react-icons/fi';
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
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>CodeTracker - All Coding Contests</title>
        <meta name="description" content="Track all coding contests from LeetCode, CodeForces, and CodeChef" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Floating animated background - only render client-side */}
      <FloatingBackground />

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Enhanced Hero Section with animated text and gradients */}
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-blue-500">Code</span>
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 font-black"
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
              className="text-xl text-gray-700 max-w-2xl mx-auto font-light leading-relaxed"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Your <span className="font-semibold text-indigo-600">ultimate companion</span> for tracking competitive coding contests across multiple platforms
            </motion.p>
          </motion.div>
        </header>

        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {/* Search bar */}
          <div className="relative mb-6">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search contests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            )}
          </div>

          {/* Platform filters - Responsive design */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
            {/* Platform filter buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <motion.button
                onClick={() => togglePlatform(Platform.LEETCODE)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 ${activePlatforms.includes(Platform.LEETCODE)
                    ? 'bg-amber-100 text-amber-800 border-2 border-amber-300'
                    : 'bg-gray-100 text-gray-600 border-2 border-transparent'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {hasMounted && <img src={leetcodeLogo} className="w-5 h-5 sm:w-6 sm:h-6" alt="LeetCode" />}
                <span>LeetCode</span>
              </motion.button>

              <motion.button
                onClick={() => togglePlatform(Platform.CODEFORCES)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 ${activePlatforms.includes(Platform.CODEFORCES)
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                    : 'bg-gray-100 text-gray-600 border-2 border-transparent'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {hasMounted && <img src={codeforcesLogo} className="w-4 h-4 sm:w-5 sm:h-5" alt="CodeForces" />}
                <span>CodeForces</span>
              </motion.button>

              <motion.button
                onClick={() => togglePlatform(Platform.CODECHEF)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 ${activePlatforms.includes(Platform.CODECHEF)
                    ? 'bg-amber-100 text-amber-800 border-2 border-amber-300'
                    : 'bg-gray-100 text-gray-600 border-2 border-transparent'
                  }`}
                whileHover={{ scale: 1.05 }}
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
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 bg-purple-100 text-purple-800 border-2 border-purple-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsBookmarks(false)}
                >
                  <FiBarChart size={16} />
                  <span className="whitespace-nowrap">All Contest</span>
                </motion.button>
              )}

              <motion.button
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 bg-blue-100 text-blue-800 border-2 border-blue-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsBookmarks(true)}
              >
                <FiBookmark size={16} />
                <span className="whitespace-nowrap">My Bookmarks</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12">
            <motion.div
              className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="mt-4 text-gray-600">Loading contests...</p>
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
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Redesigned card header */}
                  <div
                    className="p-4 border-b relative"
                    style={{ borderColor: `${getPlatformColor(contest.platform)}20` }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center p-1.5"
                          style={{ backgroundColor: `${getPlatformColor(contest.platform)}15` }}
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
                              backgroundColor: `${getPlatformColor(contest.platform)}15`,
                              color: getPlatformColor(contest.platform)
                            }}
                          >
                            {contest.platform}
                          </span>
                          <h3 className="text-lg font-medium mt-0.5 text-gray-800">{contest.title}</h3>
                        </div>
                      </div>
                      {
                        isBookmarks === false ? (<motion.button
                          onClick={() => {
                            toggleBookmark(contest)
                            toggleBookmarkColor(contest.title)
                          }
                          }
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-lg p-1.5 rounded-full"
                          style={{ color: contest.isBookmarked ? "#3B82F6" : "#9CA3AF" }}
                        >
                          <FiBookmark fill={contest.isBookmarked ? "#3B82F6" : "none"} size={18} />
                        </motion.button>) : (null)
                      }

                    </div>
                  </div>

                  {/* Card content remains unchanged */}
                  <div className="p-4">
                    {/* Status indicator */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 ${contest.isFinished
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : 'bg-green-50 text-green-600 border border-green-200'
                          }`}
                      >
                        {contest.isFinished ? 'Finished' : 'Upcoming'}
                      </span>
                      {/* <span className="text-xs text-gray-500 font-medium">
                        {getTimeStatus(contest)}
                      </span> */}
                    </div>

                    {/* Time info */}
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-gray-400 flex-shrink-0" size={16} />
                        <div>
                          <div className="flex gap-1">
                            <span className="text-gray-500">Start:</span>
                            <span className="font-medium">{contest.startTime}</span>
                          </div>
                          <div className="flex gap-1">
                            <span className="text-gray-500">End:</span>
                            {/* <span className="font-medium">{formatDate(contest.endTime)}</span> */}
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
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md text-sm hover:bg-gray-200 transition-colors"
                      >
                        <FiExternalLink size={14} />
                        Visit
                      </a>

                      <button
                        onClick={() => openSolutionModal(contest.title, contest.platform)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100 transition-colors"
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
        )
        }
      </div>

      {/* Solution Modal */}
      <AnimatePresence>
        {isModalOpen && selectedContest && (
          <Modal onClose={() => setIsModalOpen(false)} contestObject={{ platform: selectedContest.contestPlatform, title: selectedContest.contestTitle }}>
            <div className="p-6">
              <p className="text-gray-600 italic">
                This modal would contain the solutions for {selectedContest.contestTitle}.
              </p>
              <p className="mt-4 text-gray-600">
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