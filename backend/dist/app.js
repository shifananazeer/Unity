"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./routes/user/authRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/user/paymentRoutes"));
const userRoutes_1 = __importDefault(require("./routes/user/userRoutes"));
const authRoutes_2 = __importDefault(require("./routes/superadmin/authRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/superadmin/dashboardRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/admin/adminRoutes"));
const coordinatorRoutes_1 = __importDefault(require("./routes/coordinator/coordinatorRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
// Default route
app.get("/", (req, res) => {
    res.send("Backend is running successfully 🚀");
});
//user routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/payment", paymentRoutes_1.default);
app.use("/api/user", userRoutes_1.default);
//superadminroutes
app.use("/api/superadmin", authRoutes_2.default);
app.use("/api/superadmin", dashboardRoutes_1.default);
//admin routes
app.use("/api/admin", adminRoutes_1.default);
//coordinator  routes 
app.use("/api/coordinator", coordinatorRoutes_1.default);
app.use("/api/chat", chatRoutes_1.default);
exports.default = app;
