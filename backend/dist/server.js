"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const socket_1 = require("./socket");
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer(app_1.default);
// Connect DB
(0, db_1.default)();
(0, socket_1.initSocket)(server);
// Static folder
app_1.default.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
const PORT = process.env.PORT || 5000;
// 🚀 Use server.listen NOT app.listen
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
