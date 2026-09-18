import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../lib/prisma';

const router = Router();

router.post('/bulk-orders', [
  body('name').isString(),
  body('phone').isString(),
  body('email').isEmail(),
  body('eventDate').isString(),
  body('eventType').isString(),
  body('guestCount').isInt({ min: 10 }),
  body('location').isString()
], async (req: any, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { name, phone, email, eventDate, eventType, guestCount, location, requirements } = req.body;
  const bulkOrder = await prisma.bulkOrder.create({
    data: { name, phone, email, eventDate, eventType, guestCount, location, requirements }
  });
  res.json({ success: true, data: bulkOrder });
});

export default router;
