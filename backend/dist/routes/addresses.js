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
router.get('/addresses', auth_1.authMiddleware, async (req, res) => {
    const addresses = await prisma_1.default.address.findMany({ where: { userId: req.user.id } });
    res.json({ success: true, data: addresses });
});
router.post('/addresses', auth_1.authMiddleware, [
    (0, express_validator_1.body)('addressLine').isString(),
    (0, express_validator_1.body)('city').isString(),
    (0, express_validator_1.body)('state').isString(),
    (0, express_validator_1.body)('postalCode').isString(),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });
    const { addressLine, city, state, postalCode, latitude, longitude, isDefault } = req.body;
    if (isDefault) {
        await prisma_1.default.address.updateMany({
            where: { userId: req.user.id },
            data: { isDefault: false }
        });
    }
    const address = await prisma_1.default.address.create({
        data: { userId: req.user.id, addressLine, city, state, postalCode, latitude, longitude, isDefault: isDefault || false }
    });
    res.json({ success: true, data: address });
});
router.patch('/addresses/:id', auth_1.authMiddleware, async (req, res) => {
    const address = await prisma_1.default.address.update({
        where: { id: req.params.id },
        data: req.body
    });
    res.json({ success: true, data: address });
});
router.delete('/addresses/:id', auth_1.authMiddleware, async (req, res) => {
    await prisma_1.default.address.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Deleted' });
});
exports.default = router;
