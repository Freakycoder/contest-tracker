# Contest Tracker

## Overview
The **Contest Tracker** is a web application that helps competitive programmers keep track of upcoming and past coding contests from **Codeforces, CodeChef, and LeetCode**. It provides filtering options, bookmarking capabilities, and links to video solutions for past contests from a YouTube channel.

### Features
- Fetches upcoming and past contests from **Codeforces, CodeChef, and LeetCode**.
- Displays contest date and time remaining before it starts.
- Allows users to filter contests by platform (e.g., Codeforces only or Codeforces + LeetCode).
- Users can bookmark contests for quick access.
- Provides a way to attach YouTube solution links for past contests.
- **Bonus:** Automatically fetches solution links from YouTube.
- **Bonus:** Mobile and tablet responsive UI with dark mode.

## Tech Stack
- **Frontend:** Next.js (React + TypeScript)
- **Backend:** Node.js with Express (or Django if applicable)
- **Database:** PostgreSQL (managed with Prisma)
- **APIs:** Codeforces API, CodeChef API (if applicable), YouTube Data API
- **Authentication:** NextAuth (if implemented)
- **State Management:** Recoil (or any other state management library used)

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- Node.js & npm (or yarn)
- PostgreSQL (if using a database)

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/contest-tracker.git
   cd contest-tracker
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   - Create a `.env.local` file and add the necessary API keys and database connection details.
   ```env
   NEXT_PUBLIC_API_KEY=your_api_key
   DATABASE_URL=your_database_url
   ```
4. Run the development server:
   ```sh
   npm run dev
   ```
5. Open `http://localhost:3000` in your browser.

## Features Breakdown
### Fetching Contests
- Uses APIs to fetch contests from **Codeforces, CodeChef, and LeetCode**.
- Data is displayed in an organized table or list format.

### Filtering Contests
- Users can filter contests based on platforms.
- Multi-select options allow filtering contests from multiple platforms.

### Bookmarking Contests
- Users can save contests they are interested in for quick access.

### YouTube Solution Links
- A separate admin panel allows team members to attach solution links.
- **Bonus:** Automatically fetches YouTube solution links based on contest title.

## API Integration
### Codeforces API
- Endpoint: `https://codeforces.com/api/contest.list`
- Fetches both **upcoming** and **past contests**.

### CodeChef API (if applicable)
- Requires authentication to fetch contest data.

### YouTube Data API (for solution links)
- Fetches video links matching contest names.
- Auto-updates the database when new solutions are uploaded.

## Future Improvements
- Add reminders/notifications for upcoming contests.
- Implement a dashboard for personalized contest tracking.
- Support for more contest platforms.

## Contributing
If you’d like to contribute, fork the repo and create a pull request. We welcome improvements and bug fixes!



