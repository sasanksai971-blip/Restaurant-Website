import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const otpStore = new Map<string, { otp: string, expires: number }>();

router.post('/send-otp', [
  body('phone').isString().isLength({ min: 10 }).withMessage('Valid phone number required')
], async (req: any, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

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
  body('phone').isString().notEmpty(),
  body('otp').isString().isLength({ min: 6, max: 6 })
], async (req: any, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { phone, otp } = req.body;
  const record = otpStore.get(phone);

  if (!record || record.otp !== otp || record.expires < Date.now()) {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }

  otpStore.delete(phone);

  let user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    user = await prisma.user.create({ data: { phone } });
  }

  const token = jwt.sign(
    { userId: user.id, phone: user.phone },
    process.env.JWT_SECRET || 'pizza-secret-key-dev-2024',
    { expiresIn: '7d' }
  );

  return res.json({ success: true, data: { token, user } });
});

router.get('/me', authMiddleware, async (req: AuthRequest, res: any) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: { addresses: true }
  });
  return res.json({ success: true, data: user });
});

export default router;
