import axios from "axios"
import { Router } from "express"
export const codeforces = Router()

codeforces.get('/contest-list', async (req, res) => {
    try {
        const response = await axios.get('https://codeforces.com/api/contest.list');
        const responseObject = response.data;
        console.log("response from codeforces: ", responseObject);
        console.log("succesfully fetched contests");
        res.status(200).json(responseObject);
    } catch (e) {
        console.log("Error in fetching contests");
        res.status(404).json({ message: `error ${e}` });
    }
})