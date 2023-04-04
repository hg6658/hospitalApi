"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const node_cache_1 = __importDefault(require("node-cache"));
let obj = {
    nodeCache: new node_cache_1.default(),
};
module.exports = obj;
