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

  console.log('🗑️  Cleared existing data...');

  // ─── Categories ───────────────────────────────────────────────────────────
  const categoryData = [
    { name: 'Cheese Lava', slug: 'cheese-lava', image: '🧀' },
    { name: 'Big Big Pizza', slug: 'big-big-pizza', image: '🍕' },
    { name: 'Lunch Feast', slug: 'lunch-feast', image: '🍱' },
    { name: 'Veg Pizza', slug: 'veg-pizza', image: '🥗' },
    { name: 'Non-Veg Pizza', slug: 'non-veg-pizza', image: '🍗' },
    { name: 'Deals', slug: 'deals', image: '🏷️' },
    { name: 'Chicken Feast', slug: 'chicken-feast', image: '🍗' },
    { name: 'Cheese Burst Pizza', slug: 'cheese-burst-pizza', image: '🫧' },
    { name: 'Cheese Volcano', slug: 'cheese-volcano', image: '🌋' },
    { name: 'Pizza Mania', slug: 'pizza-mania', image: '🎯' },
    { name: 'Garlic Breads and Dips', slug: 'garlic-breads-dips', image: '🍞' },
    { name: 'Beverages', slug: 'beverages', image: '🥤' },
    { name: 'Dessert', slug: 'dessert', image: '🎂' },
    { name: 'No Onion No Garlic', slug: 'no-onion-no-garlic', image: '🚫' },
    { name: 'Tacos and Parcel', slug: 'tacos-parcel', image: '🌮' },
    { name: 'Slices', slug: 'slices', image: '✂️' },
    { name: '2 in 1 Cheese Burst', slug: 'cheese-burst-2in1', image: '2️⃣' },
  ];

  for (const cat of categoryData) {
    await prisma.category.create({ data: { name: cat.name, slug: cat.slug } });
  }

  const allCategories = await prisma.category.findMany();
  const catMap = new Map(allCategories.map((c) => [c.slug, c.id]));
  console.log(`✅ Created ${allCategories.length} categories`);

  // Unsplash photo IDs (pizza-related)
  const pizzaPhotos = [
    '1565299624096-d0d9bbf4ab22', // Margherita
    '1513104890138-7c749659a591', // slice
    '1534308983596-a01c86a64e32', // pizza oven
    '1551024601-bec78aea704b', // cheese pizza
    '1528137871618-79d2021a23ae', // toppings
    '1504674900247-0877df9cc836', // rustic pizza
    '1571407970349-bc81e7e96d47', // pizza board
    '1474979890656-6d8f62d1e5f7', // pizza slice up close
    '1548365538-d3cf44148440', // garlic bread
    '1585325701165-c128d0637735', // pepperoni
    '1567620905732-2d1ec7ab7445', // flatbread
    '1606787369722-e7c5d13a3c9b', // margherita overhead
    '1593560708920-61dd98c46a4e', // cheese pull
    '1590947132387-155cc02f3212', // veg pizza
    '1532767153582-b1a0e5145009', // calzone
  ];

  function getPhoto(i: number) {
    return `https://images.unsplash.com/photo-${pizzaPhotos[i % pizzaPhotos.length]}?w=400&q=80`;
  }

  // ─── Products ──────────────────────────────────────────────────────────────
  type ProductInput = {
    slug: string;
    name: string;
    description: string;
    ingredients: string;
    isVeg: boolean;
    price: number;
    discountedPrice?: number;
    isBestSeller: boolean;
    photoIdx: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
    sodium: number;
  };

  const products: ProductInput[] = [
    // ── Veg Pizza ──
    {
      slug: 'veg-pizza', name: 'Margherita Supreme', isBestSeller: true, isVeg: true,
      price: 299, discountedPrice: 249, photoIdx: 0,
      description: 'Classic tomato sauce with fresh mozzarella and fragrant basil leaves on a crispy golden crust.',
      ingredients: 'Pizza dough, tomato sauce, mozzarella cheese, fresh basil, olive oil, oregano',
      calories: 620, protein: 22, carbs: 78, fat: 18, sugar: 6, sodium: 540,
    },
    {
      slug: 'veg-pizza', name: 'Farmhouse Delight', isBestSeller: false, isVeg: true,
      price: 349, photoIdx: 13,
      description: 'Loaded with capsicum, onions, mushrooms, and sweet corn on a creamy base.',
      ingredients: 'Pizza dough, white sauce, capsicum, onion, mushroom, sweet corn, mozzarella',
      calories: 680, protein: 24, carbs: 82, fat: 20, sugar: 7, sodium: 590,
    },
    {
      slug: 'veg-pizza', name: 'Paneer Tikka Special', isBestSeller: false, isVeg: true,
      price: 379, photoIdx: 11,
      description: 'Tandoori-spiced paneer cubes with roasted bell peppers and a spicy tikka sauce.',
      ingredients: 'Pizza dough, tikka sauce, paneer, capsicum, red onion, cheddar cheese, chaat masala',
      calories: 720, protein: 28, carbs: 80, fat: 24, sugar: 5, sodium: 650,
    },
    {
      slug: 'no-onion-no-garlic', name: 'NO OG Jain Classic', isBestSeller: false, isVeg: true,
      price: 319, photoIdx: 12,
      description: 'A pure Jain-friendly pizza with rich tomato sauce, fresh veggies and premium cheese — no onion, no garlic.',
      ingredients: 'Pizza dough, tomato sauce (no garlic), capsicum, corn, tomatoes, mozzarella',
      calories: 610, protein: 20, carbs: 75, fat: 17, sugar: 6, sodium: 480,
    },
    {
      slug: 'no-onion-no-garlic', name: 'Spice Garden (NO OG)', isBestSeller: false, isVeg: true,
      price: 349, photoIdx: 9,
      description: 'Garden-fresh vegetables on a tangy sauce base — Jain-certified, no onion, no garlic.',
      ingredients: 'Pizza dough, tomato base, broccoli, baby corn, capsicum, mozzarella',
      calories: 590, protein: 19, carbs: 72, fat: 15, sugar: 5, sodium: 460,
    },
    // ── Cheese Burst ──
    {
      slug: 'cheese-burst-pizza', name: 'Double Cheese Margarita', isBestSeller: true, isVeg: true,
      price: 399, discountedPrice: 349, photoIdx: 3,
      description: 'Two layers of premium mozzarella with a golden crust that oozes cheese with every bite.',
      ingredients: 'Cheese burst dough, double mozzarella, tomato sauce, basil, parmesan',
      calories: 780, protein: 30, carbs: 85, fat: 32, sugar: 5, sodium: 720,
    },
    {
      slug: 'cheese-burst-pizza', name: 'Cheese Burst Veg Supreme', isBestSeller: false, isVeg: true,
      price: 429, photoIdx: 12,
      description: 'A vegetarian extravaganza with cheese-stuffed crust and colorful veggie toppings.',
      ingredients: 'Cheese burst dough, mushroom, capsicum, onion, olives, mozzarella, cheddar',
      calories: 810, protein: 28, carbs: 88, fat: 34, sugar: 6, sodium: 750,
    },
    // ── Cheese Lava ──
    {
      slug: 'cheese-lava', name: 'Cheese Lava Burst', isBestSeller: true, isVeg: true,
      price: 449, discountedPrice: 399, photoIdx: 12,
      description: 'Our signature lava pizza with a molten cheese center that flows with every slice.',
      ingredients: 'Special lava dough, lava cheese blend, mozzarella, jalapeno, tomato sauce',
      calories: 860, protein: 32, carbs: 90, fat: 38, sugar: 4, sodium: 800,
    },
    {
      slug: 'cheese-lava', name: 'Triple Lava Delight', isBestSeller: false, isVeg: true,
      price: 499, photoIdx: 3,
      description: 'Three types of cheese meld together in this molten lava masterpiece.',
      ingredients: 'Lava dough, mozzarella, cheddar, gouda, tomato base, fresh herbs',
      calories: 920, protein: 35, carbs: 94, fat: 42, sugar: 4, sodium: 850,
    },
    // ── Cheese Volcano ──
    {
      slug: 'cheese-volcano', name: 'Volcano Cheese Eruption', isBestSeller: false, isVeg: true,
      price: 499, photoIdx: 12,
      description: 'A dome-shaped cheese crust that erupts with molten cheese when you cut through it.',
      ingredients: 'Volcano crust, 4-cheese blend, tomato sauce, basil oil, sea salt',
      calories: 900, protein: 33, carbs: 92, fat: 40, sugar: 3, sodium: 830,
    },
    {
      slug: 'cheese-volcano', name: 'Spicy Volcano', isBestSeller: false, isVeg: true,
      price: 529, photoIdx: 7,
      description: 'All the cheese lava goodness with a fiery kick of jalapeños and red chilli.',
      ingredients: 'Volcano crust, mozzarella, jalapeno, red chilli, tomato sauce, herbs',
      calories: 880, protein: 31, carbs: 88, fat: 38, sugar: 3, sodium: 870,
    },
    // ── Non-Veg Pizza ──
    {
      slug: 'non-veg-pizza', name: 'Chicken Supreme', isBestSeller: true, isVeg: false,
      price: 399, discountedPrice: 349, photoIdx: 4,
      description: 'Tender chicken tikka with roasted capsicum, caramelized onions on a spicy BBQ base.',
      ingredients: 'Pizza dough, BBQ sauce, chicken tikka, capsicum, onion, jalapeño, mozzarella',
      calories: 750, protein: 38, carbs: 78, fat: 28, sugar: 6, sodium: 720,
    },
    {
      slug: 'non-veg-pizza', name: 'Pepperoni Feast', isBestSeller: false, isVeg: false,
      price: 429, photoIdx: 9,
      description: 'Generous layers of spiced pepperoni over rich tomato sauce and gooey mozzarella.',
      ingredients: 'Pizza dough, tomato sauce, pepperoni, mozzarella, oregano, red pepper flakes',
      calories: 800, protein: 36, carbs: 76, fat: 34, sugar: 5, sodium: 890,
    },
    {
      slug: 'non-veg-pizza', name: 'Meat Lovers Paradise', isBestSeller: false, isVeg: false,
      price: 479, photoIdx: 5,
      description: 'A meat-lover\'s dream with chicken, keema, and salami on a rich tomato base.',
      ingredients: 'Pizza dough, tomato sauce, chicken, keema, salami, mozzarella, herbs',
      calories: 880, protein: 44, carbs: 80, fat: 40, sugar: 4, sodium: 950,
    },
    // ── Chicken Feast ──
    {
      slug: 'chicken-feast', name: 'BBQ Chicken Fiesta', isBestSeller: true, isVeg: false,
      price: 449, discountedPrice: 399, photoIdx: 5,
      description: 'Smoky BBQ-glazed chicken with caramelized onions, roasted peppers and ranch drizzle.',
      ingredients: 'Pizza dough, BBQ sauce, grilled chicken, onion, capsicum, ranch, mozzarella',
      calories: 820, protein: 42, carbs: 82, fat: 32, sugar: 8, sodium: 780,
    },
    {
      slug: 'chicken-feast', name: 'Tandoori Chicken Burst', isBestSeller: true, isVeg: false,
      price: 469, photoIdx: 4,
      description: 'Marinated tandoori chicken with mint chutney drizzle and crispy onion rings.',
      ingredients: 'Pizza dough, mint sauce, tandoori chicken, onion rings, mozzarella, chaat masala',
      calories: 790, protein: 40, carbs: 80, fat: 30, sugar: 6, sodium: 760,
    },
    {
      slug: 'chicken-feast', name: 'Grilled Chicken Classico', isBestSeller: false, isVeg: false,
      price: 399, photoIdx: 14,
      description: 'Simply grilled chicken breast with herbs, mushrooms and a light white sauce.',
      ingredients: 'Pizza dough, white sauce, grilled chicken, mushroom, herbs, parmesan',
      calories: 710, protein: 38, carbs: 74, fat: 25, sugar: 4, sodium: 640,
    },
    // ── Big Big Pizza ──
    {
      slug: 'big-big-pizza', name: 'Big Feast Combo (XL)', isBestSeller: false, isVeg: true,
      price: 599, photoIdx: 1,
      description: 'Our biggest pizza loaded with 8 toppings on a hand-stretched XL base — feeds the whole family.',
      ingredients: 'XL dough, tomato sauce, capsicum, corn, mushroom, olive, onion, tomato, mozzarella',
      calories: 1200, protein: 42, carbs: 150, fat: 42, sugar: 10, sodium: 1100,
    },
    {
      slug: 'big-big-pizza', name: 'Party Monster (XL)', isBestSeller: false, isVeg: false,
      price: 699, photoIdx: 6,
      description: 'XL non-veg pizza with chicken, pepperoni, salami and 4 cheese blend.',
      ingredients: 'XL dough, BBQ sauce, chicken, pepperoni, salami, 4-cheese, jalapeño',
      calories: 1400, protein: 58, carbs: 155, fat: 56, sugar: 8, sodium: 1400,
    },
    // ── Pizza Mania ──
    {
      slug: 'pizza-mania', name: 'Pizza Mania Classic', isBestSeller: false, isVeg: true,
      price: 199, discountedPrice: 169, photoIdx: 10,
      description: 'Our value-for-money mini pizza with tomato sauce and melted cheese — great for a quick bite.',
      ingredients: 'Mini pizza base, tomato sauce, mozzarella, mixed herbs',
      calories: 350, protein: 14, carbs: 48, fat: 10, sugar: 4, sodium: 320,
    },
    {
      slug: 'pizza-mania', name: 'Mania Veggie Blast', isBestSeller: false, isVeg: true,
      price: 219, photoIdx: 13,
      description: 'Mini pizza loaded with colorful veggies, ideal as a starter or light meal.',
      ingredients: 'Mini base, tomato sauce, capsicum, corn, tomato, mozzarella',
      calories: 380, protein: 15, carbs: 52, fat: 11, sugar: 5, sodium: 340,
    },
    // ── Lunch Feast ──
    {
      slug: 'lunch-feast', name: 'Lunch Combo Veg', isBestSeller: false, isVeg: true,
      price: 299, photoIdx: 11,
      description: 'A satisfying lunch combo: 1 medium veg pizza + garlic bread + a beverage.',
      ingredients: 'Medium veg pizza, garlic bread, choice of beverage',
      calories: 980, protein: 32, carbs: 130, fat: 30, sugar: 10, sodium: 900,
    },
    {
      slug: 'lunch-feast', name: 'Lunch Combo Non-Veg', isBestSeller: false, isVeg: false,
      price: 349, photoIdx: 6,
      description: 'A filling lunch combo: 1 medium chicken pizza + garlic bread + a beverage.',
      ingredients: 'Medium chicken pizza, garlic bread, choice of beverage',
      calories: 1100, protein: 48, carbs: 134, fat: 36, sugar: 9, sodium: 1050,
    },
    // ── Deals ──
    {
      slug: 'deals', name: 'Crazy Deal Combo', isBestSeller: true, isVeg: true,
      price: 499, discountedPrice: 399, photoIdx: 1,
      description: '2 medium pizzas + 1 garlic bread + 2 beverages at an unbeatable price!',
      ingredients: '2 medium pizzas (choice), garlic bread, 2 Pepsi cans',
      calories: 1800, protein: 60, carbs: 230, fat: 60, sugar: 22, sodium: 1800,
    },
    {
      slug: 'deals', name: 'Family Saver Pack', isBestSeller: false, isVeg: true,
      price: 799, discountedPrice: 649, photoIdx: 0,
      description: '1 large pizza + 1 medium pizza + 2 garlic breads + 4 beverages.',
      ingredients: '1 large pizza, 1 medium pizza, 2 garlic breads, 4 beverages',
      calories: 3200, protein: 110, carbs: 420, fat: 110, sugar: 40, sodium: 3400,
    },
    // ── Garlic Breads and Dips ──
    {
      slug: 'garlic-breads-dips', name: 'Classic Garlic Bread', isBestSeller: true, isVeg: true,
      price: 149, photoIdx: 8,
      description: 'Butter-toasted garlic bread with herbs — the perfect starter or side.',
      ingredients: 'Baguette, garlic butter, mixed herbs, parsley',
      calories: 380, protein: 10, carbs: 52, fat: 15, sugar: 2, sodium: 480,
    },
    {
      slug: 'garlic-breads-dips', name: 'Cheesy Garlic Bread', isBestSeller: false, isVeg: true,
      price: 199, discountedPrice: 169, photoIdx: 8,
      description: 'Loaded with mozzarella and cheddar, baked until golden and gooey.',
      ingredients: 'Baguette, garlic butter, mozzarella, cheddar, herbs',
      calories: 520, protein: 18, carbs: 58, fat: 24, sugar: 2, sodium: 620,
    },
    {
      slug: 'garlic-breads-dips', name: 'Cheesy Dip Combo', isBestSeller: false, isVeg: true,
      price: 229, photoIdx: 8,
      description: 'Garlic bread served with creamy cheese dip and tangy marinara on the side.',
      ingredients: 'Garlic bread, cheese dip, marinara sauce, herbs',
      calories: 600, protein: 20, carbs: 64, fat: 28, sugar: 4, sodium: 700,
    },
    // ── Beverages ──
    {
      slug: 'beverages', name: 'Pepsi (500ml)', isBestSeller: false, isVeg: true,
      price: 79, photoIdx: 12,
      description: 'Chilled Pepsi to complement your pizza experience.',
      ingredients: 'Carbonated water, sugar, caramel color, phosphoric acid, natural flavors',
      calories: 200, protein: 0, carbs: 52, fat: 0, sugar: 50, sodium: 30,
    },
    {
      slug: 'beverages', name: '7Up (500ml)', isBestSeller: false, isVeg: true,
      price: 79, photoIdx: 12,
      description: 'Refreshing lemon-lime 7Up to cool you down.',
      ingredients: 'Carbonated water, sugar, citric acid, natural lemon-lime flavors',
      calories: 190, protein: 0, carbs: 50, fat: 0, sugar: 48, sodium: 40,
    },
    {
      slug: 'beverages', name: 'Iced Tea (Lemon)', isBestSeller: false, isVeg: true,
      price: 99, photoIdx: 14,
      description: 'Freshly brewed iced tea with a zingy lemon twist.',
      ingredients: 'Brewed black tea, lemon juice, sugar syrup, ice',
      calories: 120, protein: 0, carbs: 32, fat: 0, sugar: 28, sodium: 10,
    },
    // ── Dessert ──
    {
      slug: 'dessert', name: 'Chocolate Lava Cake', isBestSeller: false, isVeg: true,
      price: 149, photoIdx: 13,
      description: 'Warm dark-chocolate cake with a molten center — served with a vanilla ice cream scoop.',
      ingredients: 'Dark chocolate, butter, eggs, sugar, flour, vanilla ice cream',
      calories: 480, protein: 8, carbs: 62, fat: 22, sugar: 40, sodium: 120,
    },
    {
      slug: 'dessert', name: 'Choco Brownie Sundae', isBestSeller: false, isVeg: true,
      price: 179, photoIdx: 13,
      description: 'Rich chocolate brownie topped with vanilla ice cream and hot fudge drizzle.',
      ingredients: 'Brownie, vanilla ice cream, hot fudge, whipped cream, cherry',
      calories: 520, protein: 7, carbs: 70, fat: 24, sugar: 48, sodium: 140,
    },
    // ── 2 in 1 Cheese Burst ──
    {
      slug: 'cheese-burst-2in1', name: '2 in 1 Cheese Burst Veg', isBestSeller: false, isVeg: true,
      price: 449, photoIdx: 3,
      description: 'Half Margherita, half Farmhouse — cheese-burst crust with the best of both worlds.',
      ingredients: 'Cheese burst dough, tomato sauce, mozzarella, mixed veg toppings',
      calories: 840, protein: 30, carbs: 92, fat: 36, sugar: 6, sodium: 780,
    },
    {
      slug: 'cheese-burst-2in1', name: '2 in 1 Cheese Burst Non-Veg', isBestSeller: false, isVeg: false,
      price: 499, photoIdx: 9,
      description: 'Half Chicken Supreme, half Pepperoni — the ultimate non-veg cheese burst.',
      ingredients: 'Cheese burst dough, BBQ sauce, chicken, pepperoni, mozzarella',
      calories: 920, protein: 46, carbs: 88, fat: 42, sugar: 5, sodium: 950,
    },
    // ── Tacos and Parcel ──
    {
      slug: 'tacos-parcel', name: 'Pizza Taco Veg', isBestSeller: false, isVeg: true,
      price: 249, photoIdx: 11,
      description: 'Pizza flavors wrapped in a taco shell — crispy, cheesy and uniquely delicious.',
      ingredients: 'Taco shell, pizza sauce, mozzarella, capsicum, corn, sour cream',
      calories: 420, protein: 14, carbs: 56, fat: 16, sugar: 5, sodium: 520,
    },
    {
      slug: 'tacos-parcel', name: 'Chicken Pizza Taco', isBestSeller: false, isVeg: false,
      price: 279, photoIdx: 4,
      description: 'Spicy chicken tikka with pizza sauce and cheese in a crispy taco shell.',
      ingredients: 'Taco shell, pizza sauce, chicken tikka, mozzarella, jalapeño, sour cream',
      calories: 480, protein: 26, carbs: 52, fat: 20, sugar: 4, sodium: 620,
    },
    // ── Slices ──
    {
      slug: 'slices', name: 'Classic Veg Slice', isBestSeller: false, isVeg: true,
      price: 99, photoIdx: 1,
      description: 'A fresh-cut slice of our classic veg pizza — quick, easy, satisfying.',
      ingredients: 'Pizza dough, tomato sauce, mozzarella, mixed veg, herbs',
      calories: 250, protein: 9, carbs: 34, fat: 8, sugar: 3, sodium: 280,
    },
    {
      slug: 'slices', name: 'Chicken Slice', isBestSeller: false, isVeg: false,
      price: 129, photoIdx: 5,
      description: 'A meaty chicken slice loaded with BBQ chicken and cheese.',
      ingredients: 'Pizza dough, BBQ sauce, chicken, mozzarella, herbs',
      calories: 310, protein: 18, carbs: 32, fat: 12, sugar: 3, sodium: 380,
    },
  ];

  let productCount = 0;
  for (const p of products) {
    const cid = catMap.get(p.slug);
    if (!cid) {
      console.warn(`⚠️  Category not found for slug: ${p.slug}`);
      continue;
    }
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
    productCount++;
  }
  console.log(`✅ Created ${productCount} products`);

  // ─── Stores ───────────────────────────────────────────────────────────────
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
  console.log(`✅ Created ${storeData.length} stores`);

  // ─── Offers ───────────────────────────────────────────────────────────────
  const offerData = [
    { title: 'Flat 50% OFF on First Order', description: 'Get 50% off on your very first order. Max discount ₹200. Use code FIRST50.', discount: '50% OFF', color: 'blue' },
    { title: 'Flat ₹249 OFF on Dine In', description: 'Enjoy ₹249 off when you dine in with us. Min order ₹599. Use code DINEIN249.', discount: '₹249 OFF', color: 'orange' },
    { title: 'Flat ₹499 OFF on Take Away', description: 'Save ₹499 on your takeaway orders above ₹999. Use code TAKEAWAY499.', discount: '₹499 OFF', color: 'blue' },
  ];

  for (const o of offerData) {
    await prisma.offer.create({ data: o });
  }
  console.log(`✅ Created ${offerData.length} offers`);

  // ─── Coupons ──────────────────────────────────────────────────────────────
  const couponData = [
    { code: 'FIRST50', description: 'Get 50% off on first order (max ₹200)', discountType: 'percentage', discountValue: 50, minimumOrder: 199, maxUses: 1 },
    { code: 'DINEIN249', description: '₹249 off on dine-in orders', discountType: 'fixed', discountValue: 249, minimumOrder: 599 },
    { code: 'TAKEAWAY499', description: '₹499 off on takeaway orders', discountType: 'fixed', discountValue: 499, minimumOrder: 999 },
    { code: 'SAVE100', description: '₹100 off on orders above ₹399', discountType: 'fixed', discountValue: 100, minimumOrder: 399 },
    { code: 'WELCOME150', description: '₹150 off on your welcome order', discountType: 'fixed', discountValue: 150, minimumOrder: 299 },
  ];

  for (const c of couponData) {
    await prisma.coupon.create({ data: c });
  }
  console.log(`✅ Created ${couponData.length} coupons`);

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
