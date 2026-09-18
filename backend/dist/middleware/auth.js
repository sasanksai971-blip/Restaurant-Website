"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'pizza-secret-key-dev-2024');
        const user = await prisma_1.default.user.findUnique({ where: { id: decoded.userId } });
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        req.user = { id: user.id, phone: user.phone };
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};
exports.authMiddleware = authMiddleware;
