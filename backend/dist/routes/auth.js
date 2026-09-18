"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const otpStore = new Map();
router.post('/send-otp', [
    (0, express_validator_1.body)('phone').isString().isLength({ min: 10 }).withMessage('Valid phone number required')
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(phone, { otp, expires: Date.now() + 10 * 60 * 1000 }); // 10 mins
    console.log(`OTP for ${phone}: ${otp}`);
    return res.json({
        success: true,
        message: 'OTP sent',
        ...(process.env.NODE_ENV !== 'production' && { dev_otp: otp })
    });
});
router.post('/verify-otp', [
    (0, express_validator_1.body)('phone').isString().notEmpty(),
    (0, express_validator_1.body)('otp').isString().isLength({ min: 6, max: 6 })
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });
    const { phone, otp } = req.body;
    const record = otpStore.get(phone);
    if (!record || record.otp !== otp || record.expires < Date.now()) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    otpStore.delete(phone);
    let user = await prisma_1.default.user.findUnique({ where: { phone } });
    if (!user) {
        user = await prisma_1.default.user.create({ data: { phone } });
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id, phone: user.phone }, process.env.JWT_SECRET || 'pizza-secret-key-dev-2024', { expiresIn: '7d' });
    return res.json({ success: true, data: { token, user } });
});
router.get('/me', auth_1.authMiddleware, async (req, res) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: req.user.id },
        include: { addresses: true }
    });
    return res.json({ success: true, data: user });
});
exports.default = router;
