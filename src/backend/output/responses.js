"use strict";
// const [futureContest, setfutureContest] = useState<ContestList[]>([]);
//     const [pastContest, setpastContest] = useState<ContestList[]>([]);
//     useEffect(() => {
//         const fetchContest = async () => {
//             try {
//                 const response = await axios.get(`${backend_url}/codechef/contest-list`);
//                 setfutureContest(response.data.future_contests);
//                 setpastContest(response.data.past_contests)
//             } catch (error) {
//                 console.error("Error fetching contests:", error);
//             }
//         };
//         fetchContest();
//     }, [])
//     const [contestList, setcontestList] = useState<contest[]>([]);
//   useEffect(() => {
//     const fetchContest = async () => {
//       try {
//         const response = await axios.get(`${backend_url}/codeforce/contest-list`);
//         setcontestList(response.data.result);
//       } catch (error) {
//         console.error("Error fetching contests:", error);
//       }
//     };
//     fetchContest();
//   }, []);
//   const [contestList, setcontestList] = useState<leetContest[]>([]);
//     const now = Date.now();
//     useEffect(() => {
//         const fetchContest = async () => {
//             try {
//                 const response = await axios.get(`${backend_url}/leetcode/contest-list`);
//                 const contestArray: leetContest[] = response.data.map((contest: leetContest) => ({
//                     status: contest.startTime * 1000 > now ? "upcoming" : "finished",
//                     title: contest.title,
//                     startTime: contest.startTime,
//                     duration: contest.duration,
//                     titleSlug: `https://leetcode.com/contest/${contest.titleSlug}`
//                 }));
//                 setcontestList(contestArray);
//             } catch (error) {
//                 console.error("Error fetching contests:", error);
//             }
//         };
//         fetchContest();
//     }, [now]);
