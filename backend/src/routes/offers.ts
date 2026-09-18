import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../lib/prisma';

const router = Router();

router.get('/offers', async (req, res) => {
  const offers = await prisma.offer.findMany({ where: { isActive: true } });
  res.json({ success: true, data: offers });
});

router.get('/coupons', async (req, res) => {
  const coupons = await prisma.coupon.findMany({ where: { isActive: true } });
  res.json({ success: true, data: coupons });
});

router.post('/coupons/apply', [
  body('code').isString().notEmpty(),
  body('subtotal').isFloat({ min: 0 })
], async (req: any, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { code, subtotal } = req.body;
  const coupon = await prisma.coupon.findUnique({ where: { code } });

  if (!coupon || !coupon.isActive) {
    return res.status(400).json({ success: false, message: 'Invalid or inactive coupon' });
  }

  if (subtotal < coupon.minimumOrder) {
    return res.status(400).json({ success: false, message: `Minimum order amount is ₹${coupon.minimumOrder}` });
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (subtotal * coupon.discountValue) / 100;
  } else {
    discount = coupon.discountValue;
  }

  return res.json({ success: true, data: { discount, couponId: coupon.id } });
});

export default router;
