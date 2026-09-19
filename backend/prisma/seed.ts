import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean up in order of dependencies
  await prisma.tableBooking.deleteMany();
  await prisma.bulkOrder.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.store.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.coupon.deleteMany();

  // Custom Pizza tables cleanup
  await prisma.pizzaSize.deleteMany();
  await prisma.pizzaCrust.deleteMany();
  await prisma.pizzaSauce.deleteMany();
  await prisma.pizzaCheese.deleteMany();
  await prisma.pizzaTopping.deleteMany();
  await prisma.pizzaExtra.deleteMany();

  console.log('🗑️  Cleared existing data...');

  // ─── Custom Pizza Seed Data ────────────────────────────────────────────────
  console.log('🍕 Seeding Custom Pizza options...');

  // 1. Pizza Sizes (Spec Section 3)
  const sizes = [
    { name: 'Small', description: 'Serves 1', basePrice: 199, servingSize: '7 inches • 4 Slices', sortOrder: 1 },
    { name: 'Medium', description: 'Serves 2', basePrice: 299, servingSize: '10 inches • 6 Slices', sortOrder: 2 },
    { name: 'Large', description: 'Serves 3-4', basePrice: 399, servingSize: '12 inches • 8 Slices', sortOrder: 3 },
  ];
  for (const s of sizes) {
    await prisma.pizzaSize.create({ data: s });
  }

  // 2. Crusts (Spec Section 4)
  const crusts = [
    { name: 'Classic Hand Tossed', description: 'Traditional thick crust with crispy edges and soft crumb', additionalPrice: 0, sortOrder: 1 },
    { name: 'Thin Crust', description: 'Crispy, lightweight crust that lets the toppings shine', additionalPrice: 30, sortOrder: 2 },
    { name: 'Cheese Burst', description: 'Crust filled with molten, gooey liquid mozzarella', additionalPrice: 80, sortOrder: 3 },
    { name: 'Stuffed Crust', description: 'Crust edges stuffed with rich cheddar and herbs', additionalPrice: 100, sortOrder: 4 },
  ];
  for (const c of crusts) {
    await prisma.pizzaCrust.create({ data: c });
  }

  // 3. Sauces (Spec Section 5)
  const sauces = [
    { name: 'Classic Tomato', description: 'Rich sauce made from Italian San Marzano sun-ripened tomatoes', additionalPrice: 0, color: '#C62828', sortOrder: 1 },
    { name: 'Spicy Tomato', description: 'Zesty marinara sauce infused with red chili flakes and black pepper', additionalPrice: 0, color: '#B71C1C', sortOrder: 2 },
    { name: 'BBQ Sauce', description: 'Smoky, sweet barbecue reduction with caramelized brown sugar', additionalPrice: 0, color: '#4E342E', sortOrder: 3 },
    { name: 'Garlic Herb', description: 'Creamy white garlic sauce infused with parsley, oregano and thyme', additionalPrice: 0, color: '#FFF8E1', sortOrder: 4 },
  ];
  for (const sc of sauces) {
    await prisma.pizzaSauce.create({ data: sc });
  }

  // 4. Cheeses (Spec Section 6)
  const cheeses = [
    { name: 'Mozzarella', description: '100% pure dairy mozzarella with that classic golden cheese pull', additionalPrice: 0, color: '#FFF9C4', sortOrder: 1 },
    { name: 'Extra Mozzarella', description: 'Double layer of mozzarella for maximum gooey decadence', additionalPrice: 40, color: '#FFF59D', sortOrder: 2 },
    { name: 'Cheddar Blend', description: 'Sharp aged cheddar mixed with creamy mozzarella for rich flavor', additionalPrice: 50, color: '#FFE082', sortOrder: 3 },
    { name: 'Vegan Cheese', description: 'Plant-based dairy-free coconut cheese that melts smoothly', additionalPrice: 70, color: '#FFFDE7', sortOrder: 4 },
  ];
  for (const ch of cheeses) {
    await prisma.pizzaCheese.create({ data: ch });
  }

  // 5. Toppings (Spec Section 7 & 8)
  const toppings = [
    // Vegetables
    { name: 'Onion', category: 'Vegetables', price: 30, extraPrice: 50, vegetarian: true, color: '#BA68C8', sortOrder: 1 },
    { name: 'Capsicum', category: 'Vegetables', price: 30, extraPrice: 50, vegetarian: true, color: '#4CAF50', sortOrder: 2 },
    { name: 'Mushroom', category: 'Vegetables', price: 30, extraPrice: 50, vegetarian: true, color: '#8D6E63', sortOrder: 3 },
    { name: 'Sweet Corn', category: 'Vegetables', price: 30, extraPrice: 50, vegetarian: true, color: '#FDD835', sortOrder: 4 },
    { name: 'Olives', category: 'Vegetables', price: 30, extraPrice: 50, vegetarian: true, color: '#263238', sortOrder: 5 },
    { name: 'Jalapeño', category: 'Vegetables', price: 30, extraPrice: 50, vegetarian: true, color: '#2E7D32', sortOrder: 6 },
    { name: 'Tomato', category: 'Vegetables', price: 30, extraPrice: 50, vegetarian: true, color: '#E53935', sortOrder: 7 },
    { name: 'Paneer Cubes', category: 'Vegetables', price: 35, extraPrice: 60, vegetarian: true, color: '#ECEFF1', sortOrder: 8 },

    // Non-Veg
    { name: 'Chicken', category: 'Non-Veg', price: 40, extraPrice: 70, vegetarian: false, color: '#D84315', sortOrder: 9 },
    { name: 'Peri Peri Chicken', category: 'Non-Veg', price: 40, extraPrice: 70, vegetarian: false, color: '#C2185B', sortOrder: 10 },
    { name: 'Chicken Sausage', category: 'Non-Veg', price: 40, extraPrice: 70, vegetarian: false, color: '#BF360C', sortOrder: 11 },
    { name: 'Pepperoni', category: 'Non-Veg', price: 40, extraPrice: 70, vegetarian: false, color: '#B71C1C', sortOrder: 12 },
    { name: 'Chicken Tikka', category: 'Non-Veg', price: 40, extraPrice: 70, vegetarian: false, color: '#E65100', sortOrder: 13 },

    // Premium
    { name: 'Extra Chicken', category: 'Premium', price: 80, extraPrice: 120, vegetarian: false, color: '#FF5722', sortOrder: 14 },
    { name: 'Premium Pepperoni', category: 'Premium', price: 60, extraPrice: 90, vegetarian: false, color: '#880E4F', sortOrder: 15 },
    { name: 'Extra Mushroom', category: 'Premium', price: 40, extraPrice: 60, vegetarian: true, color: '#5D4037', sortOrder: 16 },
    { name: 'Double Cheese', category: 'Premium', price: 60, extraPrice: 90, vegetarian: true, color: '#FFD54F', sortOrder: 17 },
  ];
  for (const t of toppings) {
    await prisma.pizzaTopping.create({ data: t });
  }

  // 6. Extras (Spec Section 9)
  const extras = [
    { name: 'Extra Cheese', category: 'Add-ons', price: 50, sortOrder: 1 },
    { name: 'Garlic Dip', category: 'Dips', price: 30, sortOrder: 2 },
    { name: 'Spicy Dip', category: 'Dips', price: 30, sortOrder: 3 },
    { name: 'Garlic Bread', category: 'Breads', price: 99, sortOrder: 4 },
    { name: 'Coke (500ml)', category: 'Drinks', price: 60, sortOrder: 5 },
    { name: 'Choco Lava Brownie', category: 'Desserts', price: 89, sortOrder: 6 },
  ];
  for (const ex of extras) {
    await prisma.pizzaExtra.create({ data: ex });
  }

  // ─── Standard Menu Categories ──────────────────────────────────────────────
  const categoryData = [
    { name: 'Cheese Lava', slug: 'cheese-lava' },
    { name: 'Big Big Pizza', slug: 'big-big-pizza' },
    { name: 'Lunch Feast', slug: 'lunch-feast' },
    { name: 'Veg Pizza', slug: 'veg-pizza' },
    { name: 'Non-Veg Pizza', slug: 'non-veg-pizza' },
    { name: 'Deals', slug: 'deals' },
    { name: 'Chicken Feast', slug: 'chicken-feast' },
    { name: 'Cheese Burst Pizza', slug: 'cheese-burst-pizza' },
    { name: 'Cheese Volcano', slug: 'cheese-volcano' },
    { name: 'Pizza Mania', slug: 'pizza-mania' },
    { name: 'Garlic Breads and Dips', slug: 'garlic-breads-dips' },
    { name: 'Beverages', slug: 'beverages' },
    { name: 'Dessert', slug: 'dessert' },
    { name: 'No Onion No Garlic', slug: 'no-onion-no-garlic' },
    { name: 'Tacos and Parcel', slug: 'tacos-parcel' },
    { name: 'Slices', slug: 'slices' },
    { name: '2 in 1 Cheese Burst', slug: 'cheese-burst-2in1' },
  ];

  for (const cat of categoryData) {
    await prisma.category.create({ data: cat });
  }

  const allCategories = await prisma.category.findMany();
  const catMap = new Map(allCategories.map((c) => [c.slug, c.id]));
  console.log(`✅ Created ${allCategories.length} categories`);

  const pizzaPhotos = [
    '1513104890138-7c749659a591',
  '1579751626657-72bc17010498',
  '1574071318508-1cdbab80d002',
  '1579751626657-72bc17010498',
  '1593560708920-61dd98c8b2e3',
  '1571407970349-bc81e7e96d47',
  '1566843972142-a7fcb70de55a',
  '1594007654729-407eedc4be65',
  '1548365328-8b849e6f90a4',
  '1576618148400-6f4e7e8c3b6f',
  ];

  function getPhoto(i: number) {
    return `https://images.unsplash.com/photo-${pizzaPhotos[i % pizzaPhotos.length]}?w=400&q=80`;
  }

  const products = [
    { slug: 'veg-pizza', name: 'Margherita Supreme', isBestSeller: true, isVeg: true, price: 299, discountedPrice: 249, photoIdx: 0, description: 'Classic tomato sauce with fresh mozzarella and fragrant basil leaves on a crispy golden crust.', ingredients: 'Pizza dough, tomato sauce, mozzarella cheese, fresh basil, olive oil, oregano', calories: 620, protein: 22, carbs: 78, fat: 18, sugar: 6, sodium: 540 },
    { slug: 'veg-pizza', name: 'Farmhouse Delight', isBestSeller: false, isVeg: true, price: 349, photoIdx: 1, description: 'Loaded with capsicum, onions, mushrooms, and sweet corn on a creamy base.', ingredients: 'Pizza dough, white sauce, capsicum, onion, mushroom, sweet corn, mozzarella', calories: 680, protein: 24, carbs: 82, fat: 20, sugar: 7, sodium: 590 },
    { slug: 'veg-pizza', name: 'Paneer Tikka Special', isBestSeller: false, isVeg: true, price: 379, photoIdx: 2, description: 'Tandoori-spiced paneer cubes with roasted bell peppers and a spicy tikka sauce.', ingredients: 'Pizza dough, tikka sauce, paneer, capsicum, red onion, cheddar cheese, chaat masala', calories: 720, protein: 28, carbs: 80, fat: 24, sugar: 5, sodium: 650 },
    { slug: 'cheese-burst-pizza', name: 'Double Cheese Margarita', isBestSeller: true, isVeg: true, price: 399, discountedPrice: 349, photoIdx: 3, description: 'Two layers of premium mozzarella with a golden crust that oozes cheese with every bite.', ingredients: 'Cheese burst dough, double mozzarella, tomato sauce, basil, parmesan', calories: 780, protein: 30, carbs: 85, fat: 32, sugar: 5, sodium: 720 },
    { slug: 'cheese-lava', name: 'Cheese Lava Burst', isBestSeller: true, isVeg: true, price: 449, discountedPrice: 399, photoIdx: 4, description: 'Our signature lava pizza with a molten cheese center that flows with every slice.', ingredients: 'Special lava dough, lava cheese blend, mozzarella, jalapeno, tomato sauce', calories: 860, protein: 32, carbs: 90, fat: 38, sugar: 4, sodium: 800 },
    { slug: 'non-veg-pizza', name: 'Chicken Supreme', isBestSeller: true, isVeg: false, price: 399, discountedPrice: 349, photoIdx: 5, description: 'Tender chicken tikka with roasted capsicum, caramelized onions on a spicy BBQ base.', ingredients: 'Pizza dough, BBQ sauce, chicken tikka, capsicum, onion, jalapeño, mozzarella', calories: 750, protein: 38, carbs: 78, fat: 28, sugar: 6, sodium: 720 },
    { slug: 'non-veg-pizza', name: 'Pepperoni Feast', isBestSeller: false, isVeg: false, price: 429, photoIdx: 6, description: 'Generous layers of spiced pepperoni over rich tomato sauce and gooey mozzarella.', ingredients: 'Pizza dough, tomato sauce, pepperoni, mozzarella, oregano, red pepper flakes', calories: 800, protein: 36, carbs: 76, fat: 34, sugar: 5, sodium: 890 },
    { slug: 'chicken-feast', name: 'BBQ Chicken Fiesta', isBestSeller: true, isVeg: false, price: 449, discountedPrice: 399, photoIdx: 7, description: 'Smoky BBQ-glazed chicken with caramelized onions, roasted peppers and ranch drizzle.', ingredients: 'Pizza dough, BBQ sauce, grilled chicken, onion, capsicum, ranch, mozzarella', calories: 820, protein: 42, carbs: 82, fat: 32, sugar: 8, sodium: 780 },
    { slug: 'garlic-breads-dips', name: 'Classic Garlic Bread', isBestSeller: true, isVeg: true, price: 149, photoIdx: 8, description: 'Butter-toasted garlic bread with herbs — the perfect starter or side.', ingredients: 'Baguette, garlic butter, mixed herbs, parsley', calories: 380, protein: 10, carbs: 52, fat: 15, sugar: 2, sodium: 480 },
    { slug: 'garlic-breads-dips', name: 'Cheesy Garlic Bread', isBestSeller: false, isVeg: true, price: 199, discountedPrice: 169, photoIdx: 8, description: 'Loaded with mozzarella and cheddar, baked until golden and gooey.', ingredients: 'Baguette, garlic butter, mozzarella, cheddar, herbs', calories: 520, protein: 18, carbs: 58, fat: 24, sugar: 2, sodium: 620 },
    { slug: 'deals', name: 'Crazy Deal Combo', isBestSeller: true, isVeg: true, price: 499, discountedPrice: 399, photoIdx: 0, description: '2 medium pizzas + 1 garlic bread + 2 beverages at an unbeatable price!', ingredients: '2 medium pizzas, garlic bread, 2 beverages', calories: 1800, protein: 60, carbs: 230, fat: 60, sugar: 22, sodium: 1800 },
    { slug: 'dessert', name: 'Chocolate Lava Cake', isBestSeller: false, isVeg: true, price: 149, photoIdx: 9, description: 'Warm dark-chocolate cake with a molten center — served with a vanilla ice cream scoop.', ingredients: 'Dark chocolate, butter, eggs, sugar, flour', calories: 480, protein: 8, carbs: 62, fat: 22, sugar: 40, sodium: 120 },
    { slug: 'pizza-mania', name: 'Pizza Mania Classic', isBestSeller: false, isVeg: true, price: 199, discountedPrice: 169, photoIdx: 1, description: 'Our value-for-money mini pizza with tomato sauce and melted cheese.', ingredients: 'Mini pizza base, tomato sauce, mozzarella, mixed herbs', calories: 350, protein: 14, carbs: 48, fat: 10, sugar: 4, sodium: 320 },
    { slug: 'cheese-volcano', name: 'Volcano Cheese Eruption', isBestSeller: false, isVeg: true, price: 499, photoIdx: 3, description: 'A dome-shaped cheese crust that erupts with molten cheese when you cut through it.', ingredients: 'Volcano crust, 4-cheese blend, tomato sauce, basil oil', calories: 900, protein: 33, carbs: 92, fat: 40, sugar: 3, sodium: 830 },
  ];

  for (const p of products) {
    const cid = catMap.get(p.slug);
    if (!cid) continue;
    await prisma.product.create({
      data: {
        categoryId: cid,
        name: p.name,
        description: p.description,
        ingredients: p.ingredients,
        isVeg: p.isVeg,
        price: p.price,
        discountedPrice: p.discountedPrice ?? null,
        isBestSeller: p.isBestSeller,
        image: getPhoto(p.photoIdx),
        calories: p.calories,
        protein: p.protein,
        carbs: p.carbs,
        fat: p.fat,
        sugar: p.sugar,
        sodium: p.sodium,
      },
    });
  }

  // Stores
  const storeData = [
    { name: 'Downtown Central', address: '12 MG Road', city: 'Bangalore', latitude: 12.9716, longitude: 77.5946, openingTime: '10:00', closingTime: '23:00' },
    { name: 'Koramangala Hub', address: '5th Block, Koramangala', city: 'Bangalore', latitude: 12.9352, longitude: 77.6245, openingTime: '10:00', closingTime: '23:30' },
    { name: 'Indiranagar Express', address: '100 Feet Road, Indiranagar', city: 'Bangalore', latitude: 12.9784, longitude: 77.6408, openingTime: '11:00', closingTime: '23:00' },
    { name: 'Whitefield Outlet', address: 'ITPL Road, Whitefield', city: 'Bangalore', latitude: 12.9698, longitude: 77.7499, openingTime: '10:30', closingTime: '22:30' },
    { name: 'JP Nagar Branch', address: '24th Main, JP Nagar', city: 'Bangalore', latitude: 12.9102, longitude: 77.5930, openingTime: '10:00', closingTime: '23:00' },
  ];
  for (const s of storeData) {
    await prisma.store.create({ data: s });
  }

  // Offers
  const offerData = [
    { title: 'Flat 50% OFF on First Order', description: 'Get 50% off on your very first order. Max discount ₹200. Use code FIRST50.', discount: '50% OFF', color: 'blue' },
    { title: 'Flat ₹249 OFF on Dine In', description: 'Enjoy ₹249 off when you dine in with us. Min order ₹599. Use code DINEIN249.', discount: '₹249 OFF', color: 'orange' },
    { title: 'Flat ₹499 OFF on Take Away', description: 'Save ₹499 on your takeaway orders above ₹999. Use code TAKEAWAY499.', discount: '₹499 OFF', color: 'blue' },
  ];
  for (const o of offerData) {
    await prisma.offer.create({ data: o });
  }

  // Coupons
  const couponData = [
    { code: 'FIRST50', description: 'Get 50% off on first order (max ₹200)', discountType: 'percentage', discountValue: 50, minimumOrder: 199, maxUses: 1 },
    { code: 'DINEIN249', description: '₹249 off on dine-in orders', discountType: 'fixed', discountValue: 249, minimumOrder: 599 },
    { code: 'TAKEAWAY499', description: '₹499 off on takeaway orders', discountType: 'fixed', discountValue: 499, minimumOrder: 999 },
    { code: 'SAVE100', description: '₹100 off on orders above ₹399', discountType: 'fixed', discountValue: 100, minimumOrder: 399 },
  ];
  for (const c of couponData) {
    await prisma.coupon.create({ data: c });
  }

  console.log('🎉 Seed with Custom Pizza completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
