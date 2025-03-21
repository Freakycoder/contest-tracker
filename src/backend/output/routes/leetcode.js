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
exports.leetcode = void 0;
const axios_1 = __importDefault(require("axios"));
const express_1 = require("express");
exports.leetcode = (0, express_1.Router)();
exports.leetcode.get('/contest-list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queryObject = {
        query: `query getContestList {
        allContests {
        title
        startTime
        duration
        titleSlug
        }
        }`
    };
    const response = yield axios_1.default.post('https://leetcode.com/graphql', queryObject, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const contestList = response.data.data.allContests;
    res.status(200).json(contestList);
}));
