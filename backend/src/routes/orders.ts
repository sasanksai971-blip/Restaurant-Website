import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/orders', authMiddleware, [
  body('items').isArray({ min: 1 }),
  body('orderType').isString(),
], async (req: AuthRequest, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { items, storeId, addressId, orderType, discount = 0, deliveryFee = 0, scheduledDate, scheduledTime, couponCode, paymentMethod } = req.body;

  try {
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.price * item.quantity;
    }
    const tax = subtotal * 0.05;
    const total = Math.max(0, subtotal + tax + deliveryFee - discount);

    const order = await prisma.order.create({
      data: {
        userId: req.user!.id,
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
          create: items.map((i: any) => ({
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

    const cart = await prisma.cart.findFirst({ where: { userId: req.user!.id } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Order creation error', error);
    res.status(500).json({ success: false, message: 'Server error creating order' });
  }
});

router.get('/orders', authMiddleware, async (req: AuthRequest, res: any) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } }, store: true, address: true }
  });
  res.json({ success: true, data: orders });
});

router.get('/orders/:id', async (req: any, res: any) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { items: { include: { product: true } }, store: true, address: true }
  });
  if (!order) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: order });
});

router.get('/orders/:id/track', async (req: any, res: any) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id }
  });
  if (!order) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: { status: order.status } });
});

export default router;
