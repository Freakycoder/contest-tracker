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
exports.codeforces = void 0;
const axios_1 = __importDefault(require("axios"));
const express_1 = require("express");
exports.codeforces = (0, express_1.Router)();
exports.codeforces.get('/contest-list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get('https://codeforces.com/api/contest.list');
        const responseObject = response.data;
        console.log("response from codeforces: ", responseObject);
        console.log("succesfully fetched contests");
        res.status(200).json(responseObject);
    }
    catch (e) {
        console.log("Error in fetching contests");
        res.status(404).json({ message: `error ${e}` });
    }
}));
