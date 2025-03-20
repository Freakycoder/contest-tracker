// types.ts
export enum Platform {
  LEETCODE = 'leetcode',
  CODEFORCES = 'codeforces',
  CODECHEF = 'codechef',
}

export interface Contest {
  title: string;
  platform: Platform;
  startTime: string;
  url: string;
  isFinished: boolean;
  isBookmarked: boolean;
}

export interface playlistVideo {
  title: string,
  videoId: string,
  playlistId: string,
  thumbnail: string
}

export const leetCodeFilter = (array: [], title: string): any => {
  return array.filter((video: any) => {
    const firstHalfTitle = video.snippet.title.split('|')[0]
    const words = firstHalfTitle.split(' ')
    const requiredTitle = `${words[1]} ${words[2]} ${words[3]}`
    return requiredTitle === title
  })
}

export const codeForceFilter = (array: [], title: string): any => {
  return array.filter((video: any) => {
    const youtubeTitle = video.snippet.title.split('|')[0].trim(); // "Educational Codeforces Round 176"
    const firstHalfTitle = title.split('(')[0].trim(); // "Educational Codeforces Round 176"
    return firstHalfTitle === youtubeTitle;
  })
}

export const codeChefFilter = (array: [], title: string): any => {
  return array.filter((video: any) => {
    const firstHalfTitle = title.split('(')[0].trim(); // "Starters 176"
    const youtubeTitle = video.snippet.title.split('|')[0].trim(); // "CodeChef Starters 176"
    const youtubeTitleWords = youtubeTitle.split(' ');
    const finalYoutubeTitle = youtubeTitleWords.slice(-2).join(' '); // "Starters 176"
    return firstHalfTitle === finalYoutubeTitle;
  })
}

