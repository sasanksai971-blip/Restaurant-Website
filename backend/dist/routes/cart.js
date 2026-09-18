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
router.get('/cart', auth_1.authMiddleware, async (req, res) => {
    let cart = await prisma_1.default.cart.findFirst({
        where: { userId: req.user.id },
        include: { items: { include: { product: true } } }
    });
    if (!cart) {
        cart = await prisma_1.default.cart.create({
            data: { userId: req.user.id },
            include: { items: { include: { product: true } } }
        });
    }
    res.json({ success: true, data: cart });
});
router.post('/cart/items', auth_1.authMiddleware, [
    (0, express_validator_1.body)('productId').isString().notEmpty(),
    (0, express_validator_1.body)('quantity').isInt({ min: 1 }),
    (0, express_validator_1.body)('price').isFloat({ min: 0 })
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });
    const { productId, quantity, price, customization } = req.body;
    let cart = await prisma_1.default.cart.findFirst({ where: { userId: req.user.id } });
    if (!cart) {
        cart = await prisma_1.default.cart.create({ data: { userId: req.user.id } });
    }
    const existingItem = await prisma_1.default.cartItem.findFirst({
        where: { cartId: cart.id, productId, customization: customization || null }
    });
    if (existingItem) {
        await prisma_1.default.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + quantity }
        });
    }
    else {
        await prisma_1.default.cartItem.create({
            data: { cartId: cart.id, productId, quantity, price, customization }
        });
    }
    const updatedCart = await prisma_1.default.cart.findUnique({
        where: { id: cart.id },
        include: { items: { include: { product: true } } }
    });
    res.json({ success: true, data: updatedCart });
});
router.patch('/cart/items/:id', auth_1.authMiddleware, [
    (0, express_validator_1.body)('quantity').isInt({ min: 1 })
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });
    await prisma_1.default.cartItem.update({
        where: { id: req.params.id },
        data: { quantity: req.body.quantity }
    });
    res.json({ success: true, message: 'Updated' });
});
router.delete('/cart/items/:id', auth_1.authMiddleware, async (req, res) => {
    await prisma_1.default.cartItem.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Deleted' });
});
router.delete('/cart', auth_1.authMiddleware, async (req, res) => {
    const cart = await prisma_1.default.cart.findFirst({ where: { userId: req.user.id } });
    if (cart) {
        await prisma_1.default.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    res.json({ success: true, message: 'Cart cleared' });
});
exports.default = router;
