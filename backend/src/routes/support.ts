import { Router } from 'express';

const router = Router();

router.post('/support/chat', async (req, res) => {
  const { message } = req.body;
  const msg = message.toLowerCase();
  
  let reply = "I'm sorry, I don't understand. Can you please call our support line?";
  let suggestions = ["Track Order", "Cancel Order", "Talk to Human"];

  if (msg.includes('pizza') || msg.includes('order')) {
    reply = "You can place a new pizza order from our menu. Do you need help with a specific item?";
    suggestions = ["View Menu", "Track Order", "Offers"];
  } else if (msg.includes('delivery')) {
    reply = "Delivery usually takes 30-45 minutes depending on your location and traffic conditions.";
    suggestions = ["Track Order", "Change Address"];
  }

  res.json({ success: true, data: { reply, suggestions } });
});

export default router;
