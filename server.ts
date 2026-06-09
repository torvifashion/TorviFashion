import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DB_PATH = path.join(process.cwd(), 'db.json');

app.use(express.json());

// Helper to write database
const saveDB = (data: any) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to database:', err);
  }
};

// Helper to read database or auto-initialize
const loadDB = (): any => {
  if (!fs.existsSync(DB_PATH)) {
    // Elegant seed data to make the boutique alive with premium content on first load!
    const sampleProducts = [
      {
        id: 'elegance-p1',
        name: 'Aurelia Clasp Handbag',
        description: 'Embody timeless luxury with our signature Aurelia Handbag. Handcrafted from top-grain rose-blush calfskin leather and finished with bespoke polished gold metal hardware. Featuring an organized interior lined with silk, a zipper pocket, and an adjustable shoulder strap for dual wear.',
        category: 'Handbags',
        price: 240,
        rating: 4.8,
        reviewCount: 38,
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
        isBestSeller: true,
        isNewArrival: false,
        isFeatured: true,
        stock: 12,
        colors: ['Blush Pink', 'Enigma Black', 'Pure Ivory'],
        features: [
          '100% genuine calfskin leather',
          'Soft luxurious silk-blend inner lining',
          'Interiors: 1 phone slot, 1 card drawer, 1 main compartment',
          'Polished 18k gold-plated brass security buckle'
        ],
        reviews: [
          { id: 'r1', userName: 'Sofia K.', rating: 5, comment: 'Absolutely mesmerizing handbag! The leather smells divine and the pink shade is perfect.', date: '2026-05-15' },
          { id: 'r2', userName: 'Emma G.', rating: 4, comment: 'Stunning design, highly elegant. Good space for cards and makeup essential kits.', date: '2026-05-20' }
        ]
      },
      {
        id: 'elegance-p2',
        name: 'Chevron Quilted Shoulder Bag',
        description: 'Exude sophistication on every occasion. This shoulder bag features rich, chevron-quilted nappa leather, structured panels, and a convertible golden slide chain strap. The dark metallic finish lends a contemporary edge to classic feminine grace.',
        category: 'Shoulder Bags',
        price: 185,
        rating: 4.9,
        reviewCount: 42,
        imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=80',
        isBestSeller: true,
        isNewArrival: true,
        isFeatured: false,
        stock: 15,
        colors: ['Noir Black', 'Crimson Velvet', 'Gold Dust'],
        features: [
          'High density premium structured nappa leather',
          'Multi-way sliding chain strap (shoulder/crossbody)',
          'Interior slide divider with zipped divider wall',
          'Secure magnetic front flap with golden crest monogram'
        ],
        reviews: [
          { id: 'r3', userName: 'Olivia H.', rating: 5, comment: 'Perfect addition for dinner dates. The chain feels sturdy and high-quality.', date: '2026-05-10' }
        ]
      },
      {
        id: 'elegance-p3',
        name: 'Sienna Workday Tote',
        description: 'Designed for the modern, multi-passionate woman. Combining spacious proportions with refined minimalist sensibilities, the Sienna Tote is crafted from premium textured canvas bounded by waterproof protective leather trimming. Easily fits a 14-inch laptop, tablets, and journals.',
        category: 'Tote Bags',
        price: 135,
        rating: 4.6,
        reviewCount: 29,
        imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
        isBestSeller: false,
        isNewArrival: false,
        isFeatured: true,
        stock: 8,
        colors: ['Sienna Beige', 'Classic Navy', 'Charcoal Onyx'],
        features: [
          'Durable weave canvas & water-resistant polyurethane protection',
          'Accommodates tablets, books, cosmetic pouches, and up to 14" laptops',
          'Double-handle carry with luxurious leather hand protection padding',
          'Stained wood bottom feet studs for damage prevention'
        ],
        reviews: [
          { id: 'r4', userName: 'Chloe M.', rating: 4, comment: 'Extremely roomy. I take it to the office and cafes every day.', date: '2026-05-18' }
        ]
      },
      {
        id: 'elegance-p4',
        name: 'Belle Mini Crossbody',
        description: 'Compact size, grand impressions. The Belle Crossbody is a delicate companion for walks and strolls. Crafted from pebble-textured vegan leather, it includes double secure zip compartments to keep your phone, keys, and lipsticks snug.',
        category: 'Crossbody Bags',
        price: 95,
        rating: 4.7,
        reviewCount: 19,
        imageUrl: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&auto=format&fit=crop&q=80',
        isBestSeller: false,
        isNewArrival: true,
        isFeatured: false,
        stock: 25,
        colors: ['Blush Pink', 'Caramel Tan', 'Soft Sage'],
        features: [
          'Pebble grain cruelty-free vegan leather outer',
          'Dual zipper main compartments',
          'Adjustable tactile matching cross-body strap',
          'Lightweight design weighing under 300g'
        ],
        reviews: [
          { id: 'r5', userName: 'Zoe R.', rating: 5, comment: 'Sweetest little bag! Soft pink matches all my summer outfits.', date: '2026-05-22' }
        ]
      },
      {
        id: 'elegance-p5',
        name: 'Elysian Bifold Wallet',
        description: 'Sleek profiles meet practical elegance. This bifold designer wallet fits comfortably in clutches or totes. Packed with 8 card slots, a cash slot, and a smooth zipper pocket for coins.',
        category: 'Fashion Accessories',
        price: 65,
        rating: 4.8,
        reviewCount: 54,
        imageUrl: 'https://images.unsplash.com/photo-1627124118400-f94d930fe360?w=600&auto=format&fit=crop&q=80',
        isBestSeller: true,
        isNewArrival: false,
        isFeatured: false,
        stock: 40,
        colors: ['Warm Taupe', 'Dusk Black', 'Powder Pink'],
        features: [
          'RFID secure shielding to prevent signal cloning',
          'Premium cowhide saffiano grain texture',
          'Compact dimensions: 11cm x 9cm x 2cm',
          'Golden snap button clasp'
        ],
        reviews: []
      },
      {
        id: 'elegance-p6',
        name: 'Monique Pearl Pendant',
        description: 'Understated luxury for the minimalist romanticist. This stunning double-layered layering piece showcases an organic high-grade white freshwater pearl suspended on a dainty 18k gold vermeil chain. Adds a romantic finishing highlight to collared linen shirts or cocktail gowns.',
        category: 'Jewelry Accessories',
        price: 78,
        rating: 4.9,
        reviewCount: 61,
        imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80',
        isBestSeller: true,
        isNewArrival: false,
        isFeatured: true,
        stock: 30,
        colors: ['18k Gold', 'Aura Silver'],
        features: [
          'Genuine hand-selected freshwater baroque pearl',
          '925 sterling silver base under double-thick 18k gold plating',
          'Anti-tarnish hypoallergenic coat for sensitive skin types',
          'Comes nestled in luxury Torvi velvet custom product box'
        ],
        reviews: [
          { id: 'r6', userName: 'Grace L.', rating: 5, comment: 'Looks so dainty and expensive. I get compliments whenever I wear it.', date: '2026-05-19' }
        ]
      },
      {
        id: 'elegance-p7',
        name: 'Seraphina Mesh Watch',
        description: 'Grace defined by seconds. The Seraphina Mesh Watch boasts a minimalist rose gold sunray dial, matching mesh magnetic strap, and water resistance up to 30 meters. This luxury wristwear transitions smoothly from afternoon studio work to client gala dinners.',
        category: 'Fashion Accessories',
        price: 180,
        rating: 4.7,
        reviewCount: 23,
        imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80',
        isBestSeller: false,
        isNewArrival: true,
        isFeatured: true,
        stock: 10,
        colors: ['Rose Gold', 'Metallic Platinum', 'Eternal Slate'],
        features: [
          'High precision Japanese Quartz Movement',
          'Ultra-thin 7mm sandblast dial design',
          'Adjustable quick-lock steel mesh magnetic wristband',
          'Resilient scratch-proof sapphire crystal glass'
        ],
        reviews: []
      },
      {
        id: 'elegance-p8',
        name: 'Capri Cat-Eye Sunglasses',
        description: 'Bring the charm of the Italian Riviera with you. These elegant cat-eye sunglasses feature frame corners tinted in warm beige/amber shell-tones, delivering instant Hollywood flair while offering reliable UV400 sun protection.',
        category: 'Fashion Accessories',
        price: 55,
        rating: 4.5,
        reviewCount: 30,
        imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
        isBestSeller: false,
        isNewArrival: true,
        isFeatured: false,
         stock: 50,
        colors: ['Blush Amber', 'Jet Onyx', 'Soft Cream'],
        features: [
          'UV400 Category 3 light lenses providing deep solar shelter',
          'Lightweight acetate frames with reinforced metal core templates',
          'Torvi Fashion engraved inner-tip typography',
          'Includes luxury protective faux suede carry case'
        ],
        reviews: []
      },
      {
        id: 'elegance-p9',
        name: 'Camille Silk Scrunchie Set',
        description: 'Nurture your hair with luxurious, trace-less hold. Our silk scrunchies are handmade from standard 19-momme natural mulberry silk. Designed to prevent hair breakage and minimize frizzy friction throughout sleep or errands.',
        category: 'Fashion Accessories',
        price: 35,
        rating: 4.9,
        reviewCount: 75,
        imageUrl: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=600&auto=format&fit=crop&q=80',
        isBestSeller: true,
        isNewArrival: false,
        isFeatured: false,
        stock: 100,
        colors: ['Assorted Pastels', 'Ebony & Ivory'],
        features: [
          'Made of pure mulberry natural silk thread',
          'Ultra elastic core band provides safe all-day snugness without pulling',
          'Includes: 3 scrunchies (Lavender, Sage & Blush Pink) + 1 golden alloy comb clip',
          'Handwash friendly'
        ],
        reviews: [
          { id: 'r7', userName: 'Leila J.', rating: 5, comment: 'These do not crease my hair at all! Super soft and great price.', date: '2026-05-23' }
        ]
      },
      {
        id: 'elegance-p10',
        name: 'Gilded Hoop Earrings',
        description: 'Chunky yet incredibly lightweight, the Gilded Hoops are a jewelry drawer essential. Engineered with a hollow inner core, these custom-carved classic shapes hang comfortably all day, complementing anything from cozy knitwear to elegant blazers.',
        category: 'Jewelry Accessories',
        price: 49,
        rating: 4.8,
        reviewCount: 45,
        imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80', // we can reuse similar Unsplash jewelry image
        isBestSeller: true,
        isNewArrival: false,
        isFeatured: false,
        stock: 35,
        colors: ['18k Gold', 'Brilliant Silver'],
        features: [
          'Featherlight hollow tube architecture',
          '18k sterling gold electroplated brass base',
          'Secure click-close latch hinge mechanism',
          'Diameter: 2.5cm'
        ],
        reviews: []
      },
      {
        id: 'elegance-p11',
        name: 'Evelyn Suede Satchel',
        description: 'Understated modern vintage. Crafted from butter-soft vegan camel suede and trimmed with beautiful rigid saddle leather accents. Features dual compartments, top handles, and a detachable long shoulder belt.',
        category: 'Handbags',
        price: 195,
        rating: 4.7,
        reviewCount: 16,
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
        isBestSeller: false,
        isNewArrival: true,
        isFeatured: true,
        stock: 5,
        colors: ['Camel Suede', 'Forest Green Suede'],
        features: [
          'Soft luxurious brushed vegan suede microfiber flat',
          'Rigid vegetable tanned trim base detailing',
          'Dual internal secure pockets with heavy metal sliders',
          'Adjustable and detachable matching crossbody strap'
        ],
        reviews: []
      },
      {
        id: 'elegance-p12',
        name: 'Ophelia Evening Envelope',
        description: 'Steal the spotlight. This stunning, hand-beaded envelope clutch features delicate blush pink sequins, crystalline glass beads, and ivory pearls carefully woven into premium satin. Comes with a hidden attachable fine chain strap.',
        category: 'Crossbody Bags',
        price: 110,
        rating: 4.9,
        reviewCount: 22,
        imageUrl: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&auto=format&fit=crop&q=80',
        isBestSeller: true,
        isNewArrival: true,
        isFeatured: true,
        stock: 6,
        colors: ['Blush Sequin', 'Golden Dust', 'Midnight Sequin'],
        features: [
          'Hand-sewn crystalline glass beads and sequins',
          'Heavy satin fabric base construction',
          'Hidden detachable 110cm metal chain belt',
          'Beautiful inner card sleeve pocket'
        ],
        reviews: []
      }
    ];

    const sampleCoupons = [
      { code: 'WELCOME10', type: 'percentage', value: 10, minSpend: 50, isActive: true, description: 'Enjoy 10% off on your first fashion upgrade! (Min spend $50)' },
      { code: 'ELEGANCE20', type: 'percentage', value: 20, minSpend: 150, isActive: true, description: 'Premium fashion upgrade! Double up style with 20% off over $150.' },
      { code: 'BOUTIQUE30', type: 'fixed', value: 30, minSpend: 200, isActive: true, description: 'Luxury loyalty gift! Take flat $30 off orders above $200.' }
    ];

    const sampleUsers = [
      { id: 'u-admin', email: 'shihabsany.ix@gmail.com', name: 'Shihab Sany (Admin)', role: 'admin', createdAt: new Date().toISOString() },
      { id: 'u-customer', email: 'customer@elegance.com', name: 'Amelia Watson', role: 'customer', createdAt: new Date().toISOString() }
    ];

    const sampleOrders = [
      {
        id: 'ORD-104928',
        userId: 'u-customer',
        customerName: 'Amelia Watson',
        customerEmail: 'customer@elegance.com',
        customerPhone: '+880 1711-223344',
        shippingAddress: 'House 42, Road 11, Banani, Dhaka, Bangladesh',
        paymentMethod: 'bkash',
        paymentStatus: 'paid',
        orderStatus: 'processing',
        items: [
          {
            productId: 'elegance-p1',
            productName: 'Aurelia Clasp Handbag',
            productImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
            price: 240,
            quantity: 1,
            color: 'Blush Pink'
          },
          {
            productId: 'elegance-p9',
            productName: 'Camille Silk Scrunchie Set',
            productImage: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=600&auto=format&fit=crop&q=80',
            price: 35,
            quantity: 2,
            color: 'Assorted Pastels'
          }
        ],
        subtotal: 310,
        discount: 31,
        shipping: 10,
        total: 289,
        couponCode: 'WELCOME10',
        createdAt: '2026-05-23T14:30:22.000Z',
        trackingNumber: 'TRK-240523-8841',
        notes: 'Please wrap carefully as this is a gift.'
      }
    ];

    const sampleContacts = [
      { id: 'c1', name: 'Laura Carter', email: 'laura@gmail.com', subject: 'Corporate bulk inquiry', message: 'Hello! I am writing on behalf of our team regarding bulk orders of watches for our annual female leadership summit. Do you support custom embossing?', createdAt: new Date().toISOString(), isRead: false }
    ];

    const initData = {
      products: sampleProducts,
      coupons: sampleCoupons,
      users: sampleUsers,
      orders: sampleOrders,
      contacts: sampleContacts
    };

    saveDB(initData);
    return initData;
  }

  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json, resetting database state...');
    return {};
  }
};

const adminGuard = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const email = (req.headers['x-admin-email'] || '') as string;
  const role = (req.headers['x-admin-role'] || '') as string;
  
  const db = loadDB();
  const validEmails = ['shihabsany.ix@gmail.com', 'admin@torvifashion.com'];
  if (db.adminEmail) {
    validEmails.push(db.adminEmail.toLowerCase());
  }
  const isMatch = validEmails.includes(email.toLowerCase()) && role === 'admin';
  
  if (!isMatch) {
    return res.status(403).json({ error: 'Access Denied: Administrative privileges required.' });
  }
  next();
};

// GET: /api/products
app.get('/api/products', (req, res) => {
  const db = loadDB();
  res.json(db.products || []);
});

// GET: /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const db = loadDB();
  const product = db.products?.find((p: any) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  // Include related products in the same category
  const related = db.products?.filter((p: any) => p.category === product.category && p.id !== product.id).slice(0, 4) || [];
  res.json({ ...product, related });
});

// POST: /api/products (Admin panel)
app.post('/api/products', adminGuard, (req, res) => {
  const db = loadDB();
  const newProduct = {
    id: `elegance-p-${Date.now()}`,
    name: req.body.name,
    description: req.body.description,
    category: req.body.category || 'Handbags',
    price: Number(req.body.price) || 0,
    rating: 5.0,
    reviewCount: 0,
    imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
    isBestSeller: req.body.isBestSeller || false,
    isNewArrival: req.body.isNewArrival || true,
    isFeatured: req.body.isFeatured || false,
    stock: Number(req.body.stock) || 10,
    colors: req.body.colors || ['Standard Pink', 'Beige Lux'],
    features: req.body.features || ['Premium boutique design', 'Soft touch texture'],
    reviews: []
  };

  db.products.push(newProduct);
  saveDB(db);
  res.status(201).json(newProduct);
});

// PUT: /api/products/:id (Admin edit)
app.put('/api/products/:id', adminGuard, (req, res) => {
  const db = loadDB();
  const index = db.products?.findIndex((p: any) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existing = db.products[index];
  db.products[index] = {
    ...existing,
    name: req.body.name !== undefined ? req.body.name : existing.name,
    description: req.body.description !== undefined ? req.body.description : existing.description,
    category: req.body.category !== undefined ? req.body.category : existing.category,
    price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : existing.stock,
    imageUrl: req.body.imageUrl !== undefined ? req.body.imageUrl : existing.imageUrl,
    isBestSeller: req.body.isBestSeller !== undefined ? req.body.isBestSeller : existing.isBestSeller,
    isNewArrival: req.body.isNewArrival !== undefined ? req.body.isNewArrival : existing.isNewArrival,
    isFeatured: req.body.isFeatured !== undefined ? req.body.isFeatured : existing.isFeatured,
    colors: req.body.colors !== undefined ? req.body.colors : existing.colors,
    features: req.body.features !== undefined ? req.body.features : existing.features
  };

  saveDB(db);
  res.json(db.products[index]);
});

// DELETE: /api/products/:id (Admin delete)
app.delete('/api/products/:id', adminGuard, (req, res) => {
  const db = loadDB();
  const initialCount = db.products.length;
  db.products = db.products.filter((p: any) => String(p.id).trim() !== String(req.params.id).trim());
  if (db.products.length === initialCount) {
    return res.status(404).json({ error: 'Product not found' });
  }
  saveDB(db);
  res.json({ success: true, message: 'Product successfully deleted' });
});

// POST: /api/reviews
app.post('/api/reviews', (req, res) => {
  const { productId, userName, rating, comment } = req.body;
  if (!productId || !userName || !rating) {
    return res.status(400).json({ error: 'Missing review requirements' });
  }

  const db = loadDB();
  const product = db.products?.find((p: any) => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    userName,
    rating: Number(rating),
    comment: comment || '',
    date: new Date().toISOString().split('T')[0]
  };

  if (!product.reviews) {
    product.reviews = [];
  }
  product.reviews.push(newReview);
  
  // Update calculations
  const totalRating = product.reviews.reduce((acc: number, item: any) => acc + item.rating, 0);
  product.rating = parseFloat((totalRating / product.reviews.length).toFixed(1));
  product.reviewCount = product.reviews.length;

  saveDB(db);
  res.status(201).json(product);
});

// GET: /api/orders
app.get('/api/orders', (req, res) => {
  const email = (req.headers['x-admin-email'] || '') as string;
  const role = (req.headers['x-admin-role'] || '') as string;
  const db = loadDB();
  const validEmails = ['shihabsany.ix@gmail.com', 'admin@torvifashion.com'];
  if (db.adminEmail) {
    validEmails.push(db.adminEmail.toLowerCase());
  }
  const isAdmin = validEmails.includes(email.toLowerCase()) && role === 'admin';
  
  const allOrders = db.orders || [];
  
  if (isAdmin) {
    return res.json(allOrders);
  }
  
  const userEmail = (req.headers['x-user-email'] || '') as string;
  const userId = (req.headers['x-user-id'] || '') as string;
  
  if (userEmail || userId) {
    const filteredOrders = allOrders.filter((o: any) => 
      o.customerEmail.toLowerCase() === userEmail.toLowerCase() || o.userId === userId
    );
    return res.json(filteredOrders);
  }
  
  res.status(403).json({ error: 'Access Denied: Unauthenticated access.' });
});

// GET: /api/orders/track/:tracking
app.get('/api/orders/track/:tracking', (req, res) => {
  const db = loadDB();
  const order = db.orders?.find((o: any) => o.trackingNumber.toUpperCase() === req.params.tracking.toUpperCase() || o.id.toUpperCase() === req.params.tracking.toUpperCase());
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

// POST: /api/orders (Checkout)
app.post('/api/orders', (req, res) => {
  const db = loadDB();
  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const trackNum = `TRK-${new Date().toISOString().replace(/[-:T]/g, '').substring(2, 8)}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const newOrder = {
    id: orderId,
    userId: req.body.userId || 'guest-user',
    customerName: req.body.customerName,
    customerEmail: req.body.customerEmail,
    customerPhone: req.body.customerPhone,
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod || 'cod',
    paymentStatus: req.body.paymentMethod === 'cod' ? 'cod_pending' : 'paid', // instant online validation or COD
    orderStatus: 'pending',
    items: req.body.items || [],
    subtotal: Number(req.body.subtotal) || 0,
    discount: Number(req.body.discount) || 0,
    shipping: Number(req.body.shipping) || 0,
    total: Number(req.body.total) || 0,
    couponCode: req.body.couponCode,
    createdAt: new Date().toISOString(),
    trackingNumber: trackNum,
    notes: req.body.notes || ''
  };

  // Adjust stock
  if (Array.isArray(newOrder.items)) {
    newOrder.items.forEach((item: any) => {
      const prod = db.products?.find((p: any) => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    });
  }

  db.orders.push(newOrder);
  saveDB(db);
  res.status(201).json(newOrder);
});

// PUT: /api/orders/:id (Admin transition progress)
app.put('/api/orders/:id', adminGuard, (req, res) => {
  const db = loadDB();
  const index = db.orders?.findIndex((o: any) => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const existing = db.orders[index];
  db.orders[index] = {
    ...existing,
    orderStatus: req.body.orderStatus !== undefined ? req.body.orderStatus : existing.orderStatus,
    paymentStatus: req.body.paymentStatus !== undefined ? req.body.paymentStatus : existing.paymentStatus,
    shippingAddress: req.body.shippingAddress !== undefined ? req.body.shippingAddress : existing.shippingAddress
  };

  saveDB(db);
  res.json(db.orders[index]);
});

// GET: /api/customers (Admin list generated dynamically from orders & users)
app.get('/api/customers', adminGuard, (req, res) => {
  const db = loadDB();
  const customersMap = new Map();
  
  // Standard seeded customers
  if (db.users) {
    db.users.forEach((u: any) => {
      if (u.role === 'customer') {
        customersMap.set(u.email, {
          id: u.id,
          name: u.name,
          email: u.email,
          createdAt: u.createdAt,
          totalSpent: 0,
          ordersCount: 0
        });
      }
    });
  }

  // Customers captured from orders
  if (db.orders) {
    db.orders.forEach((o: any) => {
      const spent = Number(o.total) || 0;
      if (customersMap.has(o.customerEmail)) {
        const item = customersMap.get(o.customerEmail);
        item.totalSpent += spent;
        item.ordersCount += 1;
      } else {
        customersMap.set(o.customerEmail, {
          id: o.userId || `guest-${Date.now()}`,
          name: o.customerName,
          email: o.customerEmail,
          createdAt: o.createdAt,
          totalSpent: spent,
          ordersCount: 1
        });
      }
    });
  }

  res.json(Array.from(customersMap.values()));
});

// GET/POST: /api/discounts
app.get('/api/discounts', (req, res) => {
  const db = loadDB();
  res.json(db.coupons || []);
});

app.post('/api/discounts', adminGuard, (req, res) => {
  const db = loadDB();
  const { code, type, value, minSpend, description } = req.body;
  if (!code || !type || value === undefined) {
    return res.status(400).json({ error: 'Invalid coupon format' });
  }

  // Replace case-insensitively or insert
  const existingIndex = db.coupons?.findIndex((c: any) => c.code.toUpperCase() === code.toUpperCase());
  const newCoupon = {
    code: code.toUpperCase(),
    type,
    value: Number(value),
    minSpend: Number(minSpend) || 0,
    isActive: true,
    description: description || `Save ${type === 'percentage' ? value + '%' : '$' + value} on your orders.`
  };

  if (existingIndex !== -1 && existingIndex !== undefined) {
    db.coupons[existingIndex] = newCoupon;
  } else {
    if (!db.coupons) db.coupons = [];
    db.coupons.push(newCoupon);
  }

  saveDB(db);
  res.status(201).json(newCoupon);
});

// POST: /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, name } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const db = loadDB();
  const restrictedEmails = ['admin@torvifashion.com'];
  if (db.adminEmail) {
    restrictedEmails.push(db.adminEmail.toLowerCase());
  }

  if (restrictedEmails.includes(email.toLowerCase())) {
    return res.status(403).json({ error: 'Administrative emails are restricted on the public gate. Please authenticate via the Secure Admin Lounge Gateway.' });
  }

  // Quick dynamic check
  const existingUser = db.users?.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  
  if (existingUser) {
    return res.json({ user: existingUser });
  }

  // Treat Shihab Sany's workspace email specifically as Admin
  const targetEmail = 'shihabsany.ix@gmail.com';
  const role = email.toLowerCase() === targetEmail ? 'admin' : 'customer';
  
  const newUser = {
    id: `u-${Date.now()}`,
    email: email.toLowerCase(),
    name: name || email.split('@')[0],
    role,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDB(db);
  
  res.json({ user: newUser });
});

// POST: /api/admin/login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = loadDB();
  const currentAdminEmail = (db.adminEmail || 'admin@torvifashion.com').toLowerCase();
  const allowedLogins = ['admin@torvifashion.com', currentAdminEmail];

  if (!allowedLogins.includes(email.toLowerCase())) {
    return res.status(401).json({ error: 'Access Denied. Invalid admin credentials.' });
  }

  const storedPassword = db.adminPassword || 'TorviSecure2026!';
  const firstSetupDone = db.adminFirstSetupDone === true;

  if (password !== storedPassword) {
    return res.status(401).json({ error: 'Access Denied. Invalid password.' });
  }

  res.json({
    success: true,
    mustChangePassword: !firstSetupDone,
    user: {
      id: 'u-sec-admin',
      email: email.toLowerCase(),
      name: 'Torvi Administrator',
      role: firstSetupDone ? 'admin' : 'customer',
      createdAt: new Date().toISOString()
    }
  });
});

// POST: /api/admin/change-password
app.post('/api/admin/change-password', (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const db = loadDB();
  const currentAdminEmail = (db.adminEmail || 'admin@torvifashion.com').toLowerCase();
  const allowedEmails = ['admin@torvifashion.com', currentAdminEmail];

  if (!allowedEmails.includes(email.toLowerCase())) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const storedPassword = db.adminPassword || 'TorviSecure2026!';
  
  if (currentPassword !== storedPassword) {
    return res.status(401).json({ error: 'Current password does not match' });
  }

  if (newPassword === 'TorviSecure2026!') {
    return res.status(400).json({ error: 'Please choose a different password from the temporary setup key' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long' });
  }

  db.adminPassword = newPassword;
  db.adminFirstSetupDone = true;

  // Sync users list
  if (!db.users) db.users = [];
  const adminIdx = db.users.findIndex((u: any) => u.id === 'u-sec-admin' || u.email.toLowerCase() === currentAdminEmail);
  const adminObj = {
    id: 'u-sec-admin',
    email: currentAdminEmail,
    name: 'Torvi Administrator',
    role: 'admin',
    createdAt: new Date().toISOString()
  };

  if (adminIdx !== -1) {
    db.users[adminIdx] = adminObj;
  } else {
    db.users.push(adminObj);
  }

  saveDB(db);

  res.json({
    success: true,
    message: 'Password initialized. Admin account successfully verified and granted access.',
    user: adminObj
  });
});

// POST: /api/admin/change-email
app.post('/api/admin/change-email', (req, res) => {
  const { currentEmail, newEmail, confirmEmail, currentPassword } = req.body;
  if (!currentEmail || !newEmail || !confirmEmail || !currentPassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (newEmail.toLowerCase() !== confirmEmail.toLowerCase()) {
    return res.status(400).json({ error: 'Confirm email does not match' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const db = loadDB();
  const currentAdminEmail = (db.adminEmail || 'admin@torvifashion.com').toLowerCase();
  const allowedEmails = ['admin@torvifashion.com', currentAdminEmail];

  if (!allowedEmails.includes(currentEmail.toLowerCase())) {
    return res.status(403).json({ error: 'Forbidden. You are not authenticated with admin privileges.' });
  }

  const storedPassword = db.adminPassword || 'TorviSecure2026!';
  if (currentPassword !== storedPassword) {
    return res.status(401).json({ error: 'Current password does not match. Authentication required.' });
  }

  // Prevent duplicate email check against customers in db
  if (db.users) {
    const isDuplicate = db.users.some(
      (u: any) => u.email.toLowerCase() === newEmail.toLowerCase() && u.id !== 'u-sec-admin'
    );
    if (isDuplicate) {
      return res.status(400).json({ error: 'This email is already registered to a regular customer account.' });
    }
  }

  // Store new administrative email
  db.adminEmail = newEmail.toLowerCase();

  // Sync users list inside database
  if (!db.users) db.users = [];
  const adminIdx = db.users.findIndex((u: any) => u.id === 'u-sec-admin' || u.email.toLowerCase() === currentAdminEmail);
  const adminObj = {
    id: 'u-sec-admin',
    email: db.adminEmail,
    name: 'Torvi Administrator',
    role: 'admin',
    createdAt: new Date().toISOString()
  };

  if (adminIdx !== -1) {
    db.users[adminIdx] = adminObj;
  } else {
    db.users.push(adminObj);
  }

  saveDB(db);

  res.json({
    success: true,
    message: 'Boutique administrative email has been revised.',
    user: adminObj
  });
});

// CONTACT API
app.get('/api/contact', (req, res) => {
  const db = loadDB();
  res.json(db.contacts || []);
});

app.post('/api/contact', (req, res) => {
  const db = loadDB();
  const newMessage = {
    id: `c-${Date.now()}`,
    name: req.body.name || 'Anonymous',
    email: req.body.email || 'no-email@elegance.com',
    subject: req.body.subject || 'Standard Query',
    message: req.body.message || '',
    createdAt: new Date().toISOString(),
    isRead: false
  };

  if (!db.contacts) db.contacts = [];
  db.contacts.push(newMessage);
  saveDB(db);
  res.status(201).json({ success: true, message: 'Message recorded successfully!' });
});

// Admin stats endpoint
app.get('/api/admin/analytics', adminGuard, (req, res) => {
  const db = loadDB();
  const products = db.products || [];
  const orders = db.orders || [];
  
  const revenue = orders
    .filter((o: any) => o.paymentStatus === 'paid' || o.orderStatus === 'delivered')
    .reduce((acc: number, o: any) => acc + (o.total || 0), 0);
  
  // Set up sales over key mock dates + new orders
  const salesByDayMap = new Map();
  // seed standard days
  salesByDayMap.set('May 20', 310);
  salesByDayMap.set('May 21', 480);
  salesByDayMap.set('May 22', 150);
  salesByDayMap.set('May 23', 620);
  
  orders.forEach((o: any) => {
    const rawDate = new Date(o.createdAt);
    const dayFmt = rawDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const current = salesByDayMap.get(dayFmt) || 0;
    salesByDayMap.set(dayFmt, current + o.total);
  });

  const salesByDay = Array.from(salesByDayMap.entries()).map(([day, amount]) => ({
    day,
    amount
  })).slice(-7); // take last 7 days

  // Category sales shares
  const categorySalesMap: { [key: string]: number } = {};
  orders.forEach((o: any) => {
    o.items?.forEach((item: any) => {
      // Find category
      const p = products.find((prod: any) => prod.id === item.productId || prod.name === item.productName);
      const cat = p ? p.category : 'Handbags';
      categorySalesMap[cat] = (categorySalesMap[cat] || 0) + (item.price * item.quantity);
    });
  });

  // Fallbacks to enrich visual beauty if no real orders have categories yet
  const categoriesList = ['Handbags', 'Shoulder Bags', 'Tote Bags', 'Crossbody Bags', 'Cosmetic Bags', 'Jewelry Accessories', 'Fashion Accessories'];
  categoriesList.forEach(c => {
    if (!categorySalesMap[c]) {
      // Small randomized decorative weights for visual beauty
      categorySalesMap[c] = c === 'Handbags' ? 450 : c === 'Jewelry Accessories' ? 250 : c === 'Fashion Accessories' ? 320 : 120;
    }
  });

  const categorySales = Object.entries(categorySalesMap).map(([category, value]) => ({
    category,
    value
  }));

  // Unique customers counts
  const customersCount = new Set(orders.map((o: any) => o.customerEmail)).size + 1; // including guest or mock

  res.json({
    revenue,
    totalOrders: orders.length,
    totalProducts: products.length,
    totalCustomers: customersCount,
    salesByDay,
    categorySales
  });
});

// GET: /api/categories
app.get('/api/categories', (req, res) => {
  const db = loadDB();
  if (!db.categories) {
    db.categories = [
      {
        name: 'Handbags',
        desc: 'Unparalleled classical luxury. Designed from top grain leather handles with solid clasp brass hardware. Made for grand occasions and formal presentations.',
        img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
        slug: 'handbags'
      },
      {
        name: 'Shoulder Bags',
        desc: 'The perfect harmony of structural elegance and chain convenience. Convertible straps let you transition effortlessly from business hours to evening cocktails.',
        img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
        slug: 'shoulder-bags'
      },
      {
        name: 'Tote Bags',
        desc: 'Generous proportions for the modern multi-passionate woman. Designed with durable weave canvas boundaries, accommodating up to 14" office notebooks.',
        img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
        slug: 'tote-bags'
      },
      {
        name: 'Crossbody Bags',
        desc: 'Snug companion for social weekend strolls. Dual zipped compartments packed in pebble grained vegan skins providing safe, lightweight mobility.',
        img: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&auto=format&fit=crop&q=80',
        slug: 'crossbody-bags'
      },
      {
        name: 'Cosmetic Bags',
        desc: 'Sleek luxury storage for your beauty essentials. Featuring premium water-resistant interior lining, custom organization compartments, and heavy gold-finished zippers.',
        img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80',
        slug: 'cosmetic-bags'
      },
      {
        name: 'Jewelry Accessories',
        desc: 'Exquisite jewelry pieces crafted from hypoallergenic 18k sterling gold plating and natural freshwater pearls, suspending romance down your collars.',
        img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
        slug: 'jewelry-accessories'
      },
      {
        name: 'Fashion Accessories',
        desc: 'Premium accents designed to refine luxury. Discover standard Japanese Quartz watches matching sandblast rose-gold dials, amber sunglasses, and pure mulberry silk scrunchies.',
        img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
        slug: 'fashion-accessories'
      }
    ];
    saveDB(db);
  }
  res.json(db.categories);
});

// POST: /api/categories
app.post('/api/categories', adminGuard, (req, res) => {
  const db = loadDB();
  if (!db.categories) db.categories = [];
  
  const { name, desc, img } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  const exists = db.categories.find((c: any) => c.slug === slug || c.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: 'A category with this name already exists' });
  }

  const newCategory = {
    name,
    desc: desc || '',
    img: img || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
    slug
  };

  db.categories.push(newCategory);
  saveDB(db);
  res.status(201).json(newCategory);
});

// PUT: /api/categories/:slug
app.put('/api/categories/:slug', adminGuard, (req, res) => {
  const db = loadDB();
  if (!db.categories) db.categories = [];

  const { slug } = req.params;
  const { name, desc, img } = req.body;

  const catIdx = db.categories.findIndex((c: any) => c.slug === slug);
  if (catIdx === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }

  const oldName = db.categories[catIdx].name;
  const newName = name || oldName;
  const newSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  db.categories[catIdx] = {
    ...db.categories[catIdx],
    name: newName,
    desc: desc !== undefined ? desc : db.categories[catIdx].desc,
    img: img !== undefined ? img : db.categories[catIdx].img,
    slug: newSlug
  };

  if (newName !== oldName) {
    db.products = (db.products || []).map((p: any) => {
      if (p.category === oldName) {
        return { ...p, category: newName };
      }
      return p;
    });
  }

  saveDB(db);
  res.json(db.categories[catIdx]);
});

// DELETE: /api/categories/:slug
app.delete('/api/categories/:slug', adminGuard, (req, res) => {
  const db = loadDB();
  if (!db.categories) db.categories = [];

  const { slug } = req.params;
  const catIdx = db.categories.findIndex((c: any) => c.slug === slug);
  if (catIdx === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }

  const catName = db.categories[catIdx].name;
  db.categories.splice(catIdx, 1);

  saveDB(db);
  res.json({ success: true, message: `Category '${catName}' deleted successfully` });
});

// STARTUP PERSISTENCE INITIALIZATION
loadDB();

// Integration of Vite serving middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Boutique server active on http://localhost:${PORT}`);
  });
}

startServer();
