import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/cart', authMiddleware, async (req: AuthRequest, res: any) => {
  let cart = await prisma.cart.findFirst({
    where: { userId: req.user!.id },
    include: { items: { include: { product: true } } }
  });
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: req.user!.id },
      include: { items: { include: { product: true } } }
    });
  }
  res.json({ success: true, data: cart });
});

router.post('/cart/items', authMiddleware, [
  body('productId').isString().notEmpty(),
  body('quantity').isInt({ min: 1 }),
  body('price').isFloat({ min: 0 })
], async (req: AuthRequest, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { productId, quantity, price, customization } = req.body;

  let cart = await prisma.cart.findFirst({ where: { userId: req.user!.id } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId: req.user!.id } });
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, customization: customization || null }
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity }
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity, price, customization }
    });
  }

  const updatedCart = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: { items: { include: { product: true } } }
  });
  res.json({ success: true, data: updatedCart });
});

router.patch('/cart/items/:id', authMiddleware, [
  body('quantity').isInt({ min: 1 })
], async (req: AuthRequest, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  await prisma.cartItem.update({
    where: { id: req.params.id },
    data: { quantity: req.body.quantity }
  });
  res.json({ success: true, message: 'Updated' });
});

router.delete('/cart/items/:id', authMiddleware, async (req: AuthRequest, res: any) => {
  await prisma.cartItem.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Deleted' });
});

router.delete('/cart', authMiddleware, async (req: AuthRequest, res: any) => {
  const cart = await prisma.cart.findFirst({ where: { userId: req.user!.id } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
  res.json({ success: true, message: 'Cart cleared' });
});

export default router;
