import axios from "axios";
import { Router } from "express"

export const codechef = Router();

export interface ContestList {
    "contest_code": string,
    "contest_name": string,
    "contest_start_date": Date,
    "contest_end_date": Date,
    "contest_duration": number,
    "distinct_users"?: number
}

codechef.get('/contest-list', async (req, res) => {

    try {
        const response = await axios.get('https://www.codechef.com/api/list/contests/all');
        const futureContestList = response.data.future_contests;
        const pastContestList = response.data.past_contests;

        console.log("recieved list of contest");
        res.status(200).json({
            future_contests: futureContestList,
            past_contests: pastContestList
        });
    }
    catch (e) {
        console.log("error in fetching: ", e);
        res.status(404).json("error in fetching contest list");
    }
})