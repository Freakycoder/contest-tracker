import express from "express"
const app = express();
import cors from "cors"
import { codeforces } from "./routes/codeforces";
import { codechef } from "./routes/codechef";
import { leetcode } from "./routes/leetcode";


app.use(express.json())
app.use(cors())
const port = 3001;
app.use('/codeforce', codeforces);
app.use('/codechef', codechef);
app.use('/leetcode', leetcode)

app.listen(port, () => {
    console.log(`the server is running at port ${port}`);
})


