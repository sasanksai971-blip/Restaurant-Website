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
router.post('/orders', auth_1.authMiddleware, [
    (0, express_validator_1.body)('items').isArray({ min: 1 }),
    (0, express_validator_1.body)('orderType').isString(),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });
    const { items, storeId, addressId, orderType, discount = 0, deliveryFee = 0, scheduledDate, scheduledTime, couponCode, paymentMethod } = req.body;
    try {
        let subtotal = 0;
        for (const item of items) {
            subtotal += item.price * item.quantity;
        }
        const tax = subtotal * 0.05;
        const total = Math.max(0, subtotal + tax + deliveryFee - discount);
        const order = await prisma_1.default.order.create({
            data: {
                userId: req.user.id,
                storeId: storeId || null,
                addressId: addressId || null,
                orderType,
                subtotal,
                discount,
                tax,
                deliveryFee,
                total,
                scheduledDate: scheduledDate || null,
                scheduledTime: scheduledTime || null,
                couponCode: couponCode || null,
                paymentMethod: paymentMethod || 'upi',
                items: {
                    create: items.map((i) => ({
                        productId: i.productId,
                        quantity: i.quantity,
                        price: i.price,
                        customization: i.customization || null
                    }))
                }
            },
            include: {
                items: { include: { product: true } },
                store: true,
                address: true
            }
        });
        const cart = await prisma_1.default.cart.findFirst({ where: { userId: req.user.id } });
        if (cart) {
            await prisma_1.default.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
        res.json({ success: true, data: order });
    }
    catch (error) {
        console.error('Order creation error', error);
        res.status(500).json({ success: false, message: 'Server error creating order' });
    }
});
router.get('/orders', auth_1.authMiddleware, async (req, res) => {
    const orders = await prisma_1.default.order.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: true } }, store: true, address: true }
    });
    res.json({ success: true, data: orders });
});
router.get('/orders/:id', async (req, res) => {
    const order = await prisma_1.default.order.findUnique({
        where: { id: req.params.id },
        include: { items: { include: { product: true } }, store: true, address: true }
    });
    if (!order)
        return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: order });
});
router.get('/orders/:id/track', async (req, res) => {
    const order = await prisma_1.default.order.findUnique({
        where: { id: req.params.id }
    });
    if (!order)
        return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: { status: order.status } });
});
exports.default = router;
