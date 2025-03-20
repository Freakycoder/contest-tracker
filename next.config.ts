import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};
module.exports = {
  env: {
    LEETCODE_PLAYLIST_ID: process.env.LEETCODE_PLAYLIST_ID,
    CODEFORCES_PLAYLIST_ID: process.env.CODEFORCES_PLAYLIST_ID,
    CODECHEF_PLAYLIST_ID: process.env.CODECHEF_PLAYLIST_ID,
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  },
};

export default nextConfig;
