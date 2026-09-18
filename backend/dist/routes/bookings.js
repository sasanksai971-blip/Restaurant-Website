"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/bookings', auth_1.authMiddleware, [
    (0, express_validator_1.body)('storeId').isString(),
    (0, express_validator_1.body)('date').isString(),
    (0, express_validator_1.body)('time').isString(),
    (0, express_validator_1.body)('guests').isInt({ min: 1 })
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });
    const { storeId, date, time, guests } = req.body;
    const booking = await prisma_1.default.tableBooking.create({
        data: { userId: req.user.id, storeId, date, time, guests }
    });
    res.json({ success: true, data: booking });
});
router.get('/bookings', auth_1.authMiddleware, async (req, res) => {
    const bookings = await prisma_1.default.tableBooking.findMany({
        where: { userId: req.user.id },
        include: { store: true }
    });
    res.json({ success: true, data: bookings });
});
exports.default = router;
