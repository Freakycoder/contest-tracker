import axios from "axios"
import { Router } from "express"

export const leetcode = Router()

export interface leetContest {
    status: "finished" | "upcoming"
    title: string
    startTime: number
    duration: number
    titleSlug: string
}

leetcode.get('/contest-list', async (req, res) => {
    const queryObject = {
        query: `query getContestList {
        allContests {
        title
        startTime
        duration
        titleSlug
        }
        }`
    }
    const response = await axios.post('https://leetcode.com/graphql', queryObject, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const contestList = response.data.data.allContests;
    res.status(200).json(contestList);
})