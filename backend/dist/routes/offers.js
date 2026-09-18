"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
router.get('/offers', async (req, res) => {
    const offers = await prisma_1.default.offer.findMany({ where: { isActive: true } });
    res.json({ success: true, data: offers });
});
router.get('/coupons', async (req, res) => {
    const coupons = await prisma_1.default.coupon.findMany({ where: { isActive: true } });
    res.json({ success: true, data: coupons });
});
router.post('/coupons/apply', [
    (0, express_validator_1.body)('code').isString().notEmpty(),
    (0, express_validator_1.body)('subtotal').isFloat({ min: 0 })
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });
    const { code, subtotal } = req.body;
    const coupon = await prisma_1.default.coupon.findUnique({ where: { code } });
    if (!coupon || !coupon.isActive) {
        return res.status(400).json({ success: false, message: 'Invalid or inactive coupon' });
    }
    if (subtotal < coupon.minimumOrder) {
        return res.status(400).json({ success: false, message: `Minimum order amount is ₹${coupon.minimumOrder}` });
    }
    let discount = 0;
    if (coupon.discountType === 'percentage') {
        discount = (subtotal * coupon.discountValue) / 100;
    }
    else {
        discount = coupon.discountValue;
    }
    return res.json({ success: true, data: { discount, couponId: coupon.id } });
});
exports.default = router;
