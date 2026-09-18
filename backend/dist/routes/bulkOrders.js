"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
router.post('/bulk-orders', [
    (0, express_validator_1.body)('name').isString(),
    (0, express_validator_1.body)('phone').isString(),
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('eventDate').isString(),
    (0, express_validator_1.body)('eventType').isString(),
    (0, express_validator_1.body)('guestCount').isInt({ min: 10 }),
    (0, express_validator_1.body)('location').isString()
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });
    const { name, phone, email, eventDate, eventType, guestCount, location, requirements } = req.body;
    const bulkOrder = await prisma_1.default.bulkOrder.create({
        data: { name, phone, email, eventDate, eventType, guestCount, location, requirements }
    });
    res.json({ success: true, data: bulkOrder });
});
exports.default = router;
