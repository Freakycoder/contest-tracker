"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.codechef = void 0;
const axios_1 = __importDefault(require("axios"));
const express_1 = require("express");
exports.codechef = (0, express_1.Router)();
exports.codechef.get('/contest-list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get('https://www.codechef.com/api/list/contests/all?limit=10');
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
}));
