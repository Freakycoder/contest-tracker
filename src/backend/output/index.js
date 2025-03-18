"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const codeforces_1 = require("./routes/codeforces");
const codechef_1 = require("./routes/codechef");
const leetcode_1 = require("./routes/leetcode");
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const port = 3001;
app.use('/codeforce', codeforces_1.codeforces);
app.use('/codechef', codechef_1.codechef);
app.use('/leetcode', leetcode_1.leetcode);
app.listen(port, () => {
    console.log(`the server is running at port ${port}`);
});
