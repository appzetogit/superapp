/**
 * Demo catalogue for every vertical, with real photos.
 *
 * Fills an empty install so each app has something to show:
 *   food           categories, restaurants per zone, menus, home banners
 *   quick commerce categories + subcategories, stores per zone, products, banners
 *   medical        medicine products on the seeded pharmacies
 *   taxi           vehicle types, per-zone fares, banners
 *   services       icons for SP categories/brands/services, SP home content
 *
 * Images are downloaded ONCE into UPLOAD_STORAGE_ROOT/seed/ and served from
 * UPLOAD_BASE_URL/seed/, so the catalogue does not depend on a third-party host
 * staying up. Photos come from loremflickr (Creative Commons Flickr images by tag);
 * `lock` pins each slot to one photo so re-runs do not reshuffle them.
 *
 * Idempotent: every row is upserted on a natural key and marked `seedTag`.
 * Zones must exist first (scripts/seed-demo-zones.js).
 *
 *   node scripts/seed-demo-catalogue.js
 *   node scripts/seed-demo-catalogue.js --remove   # deletes rows carrying seedTag
 */
import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import mongoose from 'mongoose';

const SEED_TAG = 'demo-catalogue-v1';
const STORAGE_ROOT = process.env.UPLOAD_STORAGE_ROOT || path.resolve('uploads');
const BASE_URL = (process.env.UPLOAD_BASE_URL || '/uploads').replace(/\/+$/, '');
const SEED_DIR = path.join(STORAGE_ROOT, 'seed');

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const now = () => new Date();

// ── images ──────────────────────────────────────────────────────────────────
let lockSeq = 100;
const imageJobs = new Map(); // file -> {url}

/** Register a photo for `tags`; returns its public URL. Download happens later. */
const img = (tags, name, { w = 800, h = 600 } = {}) => {
    const file = `${slug(name)}.jpg`;
    if (!imageJobs.has(file)) {
        const tagPath = tags.split(/[,\s]+/).filter(Boolean).map((t) => encodeURIComponent(t.trim())).join(',');
        imageJobs.set(file, `https://loremflickr.com/${w}/${h}/${tagPath}?lock=${lockSeq++}`);
    }
    return `${BASE_URL}/seed/${file}`;
};

const downloadAll = async () => {
    await fs.mkdir(SEED_DIR, { recursive: true });
    const jobs = [...imageJobs.entries()];
    let done = 0, skipped = 0, failed = 0;
    const worker = async () => {
        while (jobs.length) {
            const [file, url] = jobs.shift();
            const dest = path.join(SEED_DIR, file);
            try {
                await fs.access(dest);
                skipped++;
                continue;
            } catch { /* not there yet */ }
            for (let attempt = 1; attempt <= 3; attempt++) {
                try {
                    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(30000) });
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    const buf = Buffer.from(await res.arrayBuffer());
                    if (buf.length < 2000) throw new Error('too small');
                    await fs.writeFile(dest, buf);
                    done++;
                    break;
                } catch (err) {
                    if (attempt === 3) { failed++; console.log(`  ! image ${file}: ${err.message}`); }
                }
            }
        }
    };
    await Promise.all(Array.from({ length: 6 }, worker));
    console.log(`images: ${done} downloaded, ${skipped} already present, ${failed} failed`);
};

// ── data ────────────────────────────────────────────────────────────────────
const FOOD_CATEGORIES = [
    ['Pizza', 'pizza'], ['Burgers', 'burger'], ['Biryani', 'biryani'], ['North Indian', 'paneer,curry'],
    ['South Indian', 'dosa'], ['Chinese', 'noodles'], ['Rolls & Wraps', 'wrap,roll'],
    ['Desserts', 'dessert,cake'], ['Beverages', 'milkshake,drink'], ['Thali', 'thali,indian'],
];

// [name, cuisines, pureVeg, menu: [name, category, price, Veg|Non-Veg, imageTag, description]]
const RESTAURANTS = [
    ['Spice Route Kitchen', ['North Indian', 'Thali'], false, [
        ['Butter Chicken', 'North Indian', 320, 'Non-Veg', 'butter,chicken', 'Tandoori chicken simmered in a creamy tomato gravy.'],
        ['Paneer Tikka Masala', 'North Indian', 280, 'Veg', 'paneer', 'Chargrilled paneer in a smoky masala.'],
        ['Dal Makhani', 'North Indian', 220, 'Veg', 'dal,lentils', 'Black lentils slow-cooked overnight with butter.'],
        ['Garlic Naan', 'North Indian', 60, 'Veg', 'naan', 'Tandoor-baked naan brushed with garlic butter.'],
        ['Veg Thali', 'Thali', 249, 'Veg', 'thali', 'Two sabzis, dal, rice, rotis, raita and a sweet.'],
        ['Gulab Jamun (2 pcs)', 'Desserts', 80, 'Veg', 'gulab,jamun', 'Soft milk dumplings in rose syrup.'],
    ]],
    ['Biryani Blues', ['Biryani', 'Mughlai'], false, [
        ['Hyderabadi Chicken Biryani', 'Biryani', 299, 'Non-Veg', 'chicken,biryani', 'Dum-cooked basmati with spiced chicken.'],
        ['Mutton Biryani', 'Biryani', 389, 'Non-Veg', 'mutton,biryani', 'Tender mutton layered with saffron rice.'],
        ['Veg Dum Biryani', 'Biryani', 229, 'Veg', 'vegetable,biryani', 'Garden vegetables and fragrant rice, sealed and slow-cooked.'],
        ['Chicken 65', 'North Indian', 249, 'Non-Veg', 'fried,chicken', 'Crisp, fiery fried chicken bites.'],
        ['Mirchi Ka Salan', 'North Indian', 149, 'Veg', 'curry', 'Chillies in a tangy peanut-sesame gravy.'],
        ['Double Ka Meetha', 'Desserts', 120, 'Veg', 'bread,pudding', 'Hyderabadi bread pudding with nuts.'],
    ]],
    ['Napoli Pizza Co.', ['Pizza', 'Italian'], false, [
        ['Margherita Pizza', 'Pizza', 249, 'Veg', 'margherita,pizza', 'San Marzano tomato, mozzarella, basil.'],
        ['Farmhouse Pizza', 'Pizza', 329, 'Veg', 'vegetable,pizza', 'Onion, capsicum, mushroom and corn.'],
        ['Pepperoni Pizza', 'Pizza', 399, 'Non-Veg', 'pepperoni,pizza', 'Loaded with spicy pepperoni.'],
        ['Garlic Breadsticks', 'Pizza', 139, 'Veg', 'garlic,bread', 'Oven-fresh with a cheesy dip.'],
        ['Penne Arrabbiata', 'Pizza', 269, 'Veg', 'pasta,penne', 'Penne in a spicy tomato sauce.'],
        ['Choco Lava Cake', 'Desserts', 109, 'Veg', 'chocolate,lava,cake', 'Molten chocolate centre.'],
    ]],
    ['The Burger Barn', ['Burgers', 'American'], false, [
        ['Classic Veg Burger', 'Burgers', 129, 'Veg', 'veggie,burger', 'Crunchy veg patty, lettuce, house sauce.'],
        ['Crispy Chicken Burger', 'Burgers', 179, 'Non-Veg', 'chicken,burger', 'Buttermilk fried chicken, slaw, mayo.'],
        ['Double Cheese Burger', 'Burgers', 229, 'Non-Veg', 'cheeseburger', 'Two patties, double cheddar.'],
        ['Peri Peri Fries', 'Burgers', 99, 'Veg', 'french,fries', 'Fries tossed in peri peri spice.'],
        ['Oreo Shake', 'Beverages', 149, 'Veg', 'milkshake', 'Thick shake blended with Oreo.'],
        ['Cold Coffee', 'Beverages', 119, 'Veg', 'iced,coffee', 'Creamy iced coffee.'],
    ]],
    ['Dosa Plaza', ['South Indian'], true, [
        ['Masala Dosa', 'South Indian', 119, 'Veg', 'masala,dosa', 'Crisp dosa with spiced potato filling.'],
        ['Idli Sambar (3 pcs)', 'South Indian', 79, 'Veg', 'idli', 'Steamed rice cakes with sambar and chutney.'],
        ['Medu Vada (2 pcs)', 'South Indian', 89, 'Veg', 'vada', 'Crisp lentil fritters.'],
        ['Mysore Masala Dosa', 'South Indian', 139, 'Veg', 'dosa', 'Red chutney-smeared dosa with masala.'],
        ['Uttapam', 'South Indian', 129, 'Veg', 'uttapam', 'Thick rice pancake with onion and tomato.'],
        ['Filter Coffee', 'Beverages', 49, 'Veg', 'filter,coffee', 'Strong South Indian coffee.'],
    ]],
    ['Wok Express', ['Chinese', 'Asian'], false, [
        ['Veg Hakka Noodles', 'Chinese', 169, 'Veg', 'hakka,noodles', 'Wok-tossed noodles with vegetables.'],
        ['Chicken Fried Rice', 'Chinese', 199, 'Non-Veg', 'fried,rice', 'Egg and chicken fried rice.'],
        ['Chilli Paneer', 'Chinese', 219, 'Veg', 'chilli,paneer', 'Paneer in a hot and tangy sauce.'],
        ['Veg Manchurian', 'Chinese', 179, 'Veg', 'manchurian', 'Vegetable balls in Manchurian gravy.'],
        ['Chicken Momos (8 pcs)', 'Chinese', 149, 'Non-Veg', 'momos,dumplings', 'Steamed dumplings with red chutney.'],
        ['Kathi Roll', 'Rolls & Wraps', 139, 'Non-Veg', 'kathi,roll', 'Paratha roll with chicken tikka.'],
    ]],
];

const QC_CATEGORIES = [
    ['Fruits & Vegetables', 'vegetables,market', [
        ['Fresh Vegetables', 'vegetables', [['Tomato', 1, 'kg', 40, 'tomato'], ['Onion', 1, 'kg', 35, 'onion'], ['Potato', 1, 'kg', 30, 'potato'], ['Capsicum', 500, 'g', 45, 'capsicum']]],
        ['Fresh Fruits', 'fruits', [['Banana', 12, 'pcs', 60, 'banana'], ['Apple Shimla', 1, 'kg', 180, 'apple'], ['Pomegranate', 500, 'g', 110, 'pomegranate'], ['Mango Alphonso', 1, 'kg', 250, 'mango']]],
    ]],
    ['Dairy, Bread & Eggs', 'dairy,milk', [
        ['Milk & Curd', 'milk', [['Toned Milk', 500, 'ml', 28, 'milk,bottle'], ['Fresh Curd', 400, 'g', 45, 'yogurt'], ['Paneer', 200, 'g', 90, 'paneer,cheese']]],
        ['Bread & Eggs', 'bread', [['Brown Bread', 400, 'g', 50, 'bread,loaf'], ['Farm Eggs', 6, 'pcs', 60, 'eggs'], ['Butter', 100, 'g', 58, 'butter']]],
    ]],
    ['Snacks & Munchies', 'snacks,chips', [
        ['Chips & Namkeen', 'chips', [['Potato Chips Salted', 52, 'g', 20, 'potato,chips'], ['Aloo Bhujia', 200, 'g', 55, 'namkeen,snack'], ['Nachos', 150, 'g', 99, 'nachos']]],
        ['Biscuits & Cookies', 'cookies', [['Chocolate Cookies', 120, 'g', 40, 'chocolate,cookies'], ['Cream Biscuits', 100, 'g', 30, 'biscuits'], ['Digestive Biscuits', 250, 'g', 80, 'digestive,biscuit']]],
    ]],
    ['Cold Drinks & Juices', 'soft,drinks', [
        ['Soft Drinks', 'soda,can', [['Cola', 750, 'ml', 40, 'cola'], ['Lemon Soda', 750, 'ml', 40, 'lemonade'], ['Energy Drink', 250, 'ml', 125, 'energy,drink']]],
        ['Juices', 'juice', [['Orange Juice', 1, 'l', 120, 'orange,juice'], ['Mixed Fruit Juice', 1, 'l', 115, 'fruit,juice'], ['Coconut Water', 200, 'ml', 45, 'coconut,water']]],
    ]],
    ['Atta, Rice & Dal', 'rice,grains', [
        ['Rice', 'rice', [['Basmati Rice', 1, 'kg', 140, 'basmati,rice'], ['Sona Masoori Rice', 5, 'kg', 380, 'rice,bag']]],
        ['Atta & Dals', 'flour', [['Whole Wheat Atta', 5, 'kg', 260, 'flour,wheat'], ['Toor Dal', 1, 'kg', 160, 'lentils'], ['Moong Dal', 1, 'kg', 150, 'moong,dal']]],
    ]],
    ['Personal Care', 'shampoo,cosmetics', [
        ['Bath & Body', 'soap', [['Bathing Soap', 3, 'pcs', 120, 'soap,bar'], ['Body Wash', 250, 'ml', 199, 'body,wash']]],
        ['Hair Care', 'shampoo', [['Anti-Dandruff Shampoo', 340, 'ml', 299, 'shampoo,bottle'], ['Hair Oil', 200, 'ml', 145, 'hair,oil']]],
    ]],
    ['Cleaning Essentials', 'cleaning,supplies', [
        ['Detergents', 'detergent', [['Detergent Powder', 1, 'kg', 125, 'detergent'], ['Liquid Detergent', 1, 'l', 229, 'laundry']]],
        ['Home Cleaners', 'cleaner', [['Floor Cleaner', 1, 'l', 189, 'floor,cleaner'], ['Dishwash Liquid', 500, 'ml', 105, 'dish,soap']]],
    ]],
];

const QC_STORES = [
    ['FreshMart Supermarket', 'supermarket'],
    ['Daily Needs Kirana', 'kirana'],
];

const MEDICINES = [
    ['Paracetamol 650mg (15 tabs)', 'Pain Relief', 32, 'pills,tablets'],
    ['Cetirizine 10mg (10 tabs)', 'Allergy', 25, 'medicine,pills'],
    ['ORS Electrolyte Powder', 'Hydration', 22, 'sachet,powder'],
    ['Vitamin C 500mg (20 tabs)', 'Vitamins', 110, 'vitamins'],
    ['Antiseptic Liquid 250ml', 'First Aid', 135, 'antiseptic,bottle'],
    ['Adhesive Bandages (20)', 'First Aid', 60, 'bandage'],
    ['Digital Thermometer', 'Devices', 199, 'thermometer'],
    ['Hand Sanitizer 500ml', 'Hygiene', 150, 'hand,sanitizer'],
    ['Cough Syrup 100ml', 'Cold & Cough', 98, 'syrup,medicine'],
    ['N95 Face Mask (5)', 'Hygiene', 175, 'face,mask'],
];

const TAXI_VEHICLES = [
    ['Bike', 'bike', 1, 'Quick and affordable solo rides', 'motorbike', 20, 2, 7, 1],
    ['Auto', 'auto', 3, 'Doorstep auto rickshaw rides', 'auto,rickshaw', 30, 2, 12, 1.5],
    ['Mini', 'car', 4, 'Compact hatchbacks for everyday trips', 'hatchback,car', 50, 2, 14, 2],
    ['Sedan', 'car', 4, 'Comfortable sedans with extra legroom', 'sedan,car', 70, 2, 17, 2],
    ['SUV', 'suv', 6, 'Spacious SUVs for groups and luggage', 'suv', 100, 2, 22, 2.5],
];

// ── helpers ─────────────────────────────────────────────────────────────────
const col = (name) => mongoose.connection.db.collection(name);

const upsert = async (collection, filter, doc) => {
    const ts = now();
    const res = await col(collection).findOneAndUpdate(
        filter,
        { $set: { ...doc, seedTag: SEED_TAG, updatedAt: ts }, $setOnInsert: { createdAt: ts } },
        { upsert: true, returnDocument: 'after' },
    );
    return res?.value ?? res; // driver v4 wraps in {value}, v6 returns the doc
};

const zoneCentre = (zone) => {
    const lats = (zone.coordinates || []).map((c) => Number(c.latitude));
    const lngs = (zone.coordinates || []).map((c) => Number(c.longitude));
    return { lat: (Math.min(...lats) + Math.max(...lats)) / 2, lng: (Math.min(...lngs) + Math.max(...lngs)) / 2 };
};
const offset = ({ lat, lng }, northKm, eastKm) => ({
    lat: lat + northKm / 111,
    lng: lng + eastKm / (111 * Math.cos((lat * Math.PI) / 180)),
});
const point = (p, zoneName, area) => ({
    type: 'Point',
    coordinates: [p.lng, p.lat],
    latitude: p.lat,
    longitude: p.lng,
    formattedAddress: `${area}, ${zoneName}`,
    address: `${area}, ${zoneName}`,
    addressLine1: area,
    area,
    city: zoneName,
    state: zoneName === 'Indore' ? 'Madhya Pradesh' : 'Maharashtra',
});
const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
let phoneSeq = 9811000100;
const phoneFor = () => String(phoneSeq++);

const storeBase = (name, zone, p, area, extra = {}) => {
    const phone = extra.ownerPhone || phoneFor();
    return {
        restaurantName: name,
        restaurantNameNormalized: name.toLowerCase().replace(/\s+/g, ' ').trim(),
        ownerName: `${name.split(' ')[0]} Owner`,
        ownerEmail: `${slug(name)}-${slug(zone.name)}.seed@appzeto.test`,
        ownerPhone: phone,
        ownerPhoneLast10: phone.slice(-10),
        primaryContactNumber: phone,
        countryCode: '+91',
        pureVegRestaurant: false,
        openingTime: '08:00',
        closingTime: '23:30',
        openDays: ALL_DAYS,
        isAcceptingOrders: true,
        autoAcceptOrders: false,
        outsideHoursOverride: false,
        estimatedDeliveryTime: '25-30 mins',
        estimatedDeliveryTimeMinutes: 30,
        status: 'approved',
        approvedAt: now(),
        zoneId: zone._id,
        city: zone.name,
        area,
        location: point(p, zone.name, area),
        rating: Number((3.9 + Math.random() * 0.9).toFixed(1)),
        ...extra,
    };
};

const AREAS = {
    Nagpur: ['Dharampeth', 'Sitabuldi', 'Sadar', 'Civil Lines', 'Manish Nagar', 'Ramdaspeth'],
    Indore: ['Vijay Nagar', 'Palasia', 'Rajwada', 'Sapna Sangeeta', 'Bhawarkua', 'Scheme 54'],
};
const OFFSETS = [[0.5, 0.4], [-1.2, 1.0], [1.8, -1.1], [-2.0, -1.5], [2.4, 1.9], [-0.6, 2.6]];

// ── verticals ───────────────────────────────────────────────────────────────
const seedFood = async () => {
    const zones = await col('food_zones').find({ isActive: true }).toArray();
    const catIds = {};
    let order = 0;
    for (const [name, tag] of FOOD_CATEGORIES) {
        const c = await upsert('food_categories', { name, restaurantId: null }, {
            name, image: img(tag, `food-cat-${name}`, { w: 400, h: 400 }), type: 'food',
            approvalStatus: 'approved', isApproved: true, isActive: true, sortOrder: order++,
            foodTypeScope: 'Both', restaurantId: null, zoneId: null,
        });
        catIds[name] = c._id;
    }
    let restaurants = 0, items = 0;
    for (const zone of zones) {
        const centre = zoneCentre(zone);
        for (const [i, [rName, cuisines, pureVeg, menu]] of RESTAURANTS.entries()) {
            const area = AREAS[zone.name]?.[i] || zone.name;
            const p = offset(centre, ...OFFSETS[i % OFFSETS.length]);
            const r = await upsert('food_restaurants', { restaurantName: rName, zoneId: zone._id }, storeBase(rName, zone, p, area, {
                pureVegRestaurant: pureVeg,
                cuisines,
                profileImage: img(`restaurant,${cuisines[0]}`, `food-rest-${rName}-logo`, { w: 400, h: 400 }),
                coverImage: img(`${cuisines[0]},food`, `food-rest-${rName}-cover`, { w: 1200, h: 600 }),
                coverImages: [img(`${cuisines[0]},food`, `food-rest-${rName}-cover`, { w: 1200, h: 600 })],
                galleryImages: [img('restaurant,interior', `food-rest-${rName}-gallery`, { w: 800, h: 600 })],
                offer: i % 2 ? '20% OFF up to ₹100' : 'Flat ₹50 OFF above ₹299',
                costForTwo: 300 + i * 50,
            }));
            restaurants++;
            for (const [iName, cat, price, foodType, tag, description] of menu) {
                await upsert('food_items', { restaurantId: r._id, name: iName }, {
                    restaurantId: r._id, name: iName, description, price, basePrice: price,
                    categoryId: catIds[cat] || null, categoryName: cat, foodType,
                    image: img(tag, `food-item-${iName}`),
                    approvalStatus: 'approved', isActive: true, isAvailable: true,
                    isRecommended: items % 3 === 0, preparationTime: '15-20 mins',
                });
                items++;
            }
        }
    }
    const banners = [
        ['Biryani fest - up to 40% off', 'biryani'], ['Pizza night deals', 'pizza'], ['Healthy bowls under ₹199', 'salad,bowl'],
    ];
    for (const [i, [title, tag]] of banners.entries()) {
        await upsert('food_hero_banners', { title, module: 'food' }, {
            title, module: 'food', imageUrl: img(tag, `banner-food-${title}`, { w: 1200, h: 500 }),
            publicId: `seed/banner-food-${i}`, isActive: true, sortOrder: i,
        });
    }
    for (const [i, [title, tag]] of [['Groceries in 10 minutes', 'groceries'], ['Fresh fruits daily', 'fruits']].entries()) {
        await upsert('food_hero_banners', { title, module: 'quick_commerce' }, {
            title, module: 'quick_commerce', imageUrl: img(tag, `banner-qc-hero-${title}`, { w: 1200, h: 500 }),
            publicId: `seed/banner-qc-hero-${i}`, isActive: true, sortOrder: i,
        });
    }
    for (const [i, [title, tag, module]] of [['Rides at your doorstep', 'taxi,city', 'taxi'], ['Home services by experts', 'electrician', 'services'], ['Medicines delivered fast', 'pharmacy', 'medical']].entries()) {
        await upsert('food_hero_banners', { title, module }, {
            title, module, imageUrl: img(tag, `banner-${module}-${title}`, { w: 1200, h: 500 }),
            publicId: `seed/banner-${module}-${i}`, isActive: true, sortOrder: i,
        });
    }
    for (const [i, [title, tag]] of [['Under ₹250 meals', 'street,food'], ['Weekend combos', 'fast,food']].entries()) {
        await upsert('food_home_promotion_banners', { title }, {
            title, imageUrl: img(tag, `promo-food-${title}`, { w: 1000, h: 400 }),
            publicId: `seed/promo-food-${i}`, isActive: true, zoneId: null,
        });
    }
    console.log(`food: ${FOOD_CATEGORIES.length} categories, ${restaurants} restaurants, ${items} items, banners`);
};

const seedQuickCommerce = async () => {
    const zones = await col('qc_zones').find({ isActive: true }).toArray();
    const subcats = [];
    for (const [i, [name, tag, subs]] of QC_CATEGORIES.entries()) {
        const parent = await upsert('qc_categories', { name, parentId: null }, {
            name, image: img(tag, `qc-cat-${name}`, { w: 400, h: 400 }), approvalStatus: 'approved', isApproved: true,
            isActive: true, sortOrder: i, parentId: null, restaurantId: null, zoneId: null,
        });
        for (const [j, [sName, sTag, products]] of subs.entries()) {
            const sub = await upsert('qc_categories', { name: sName, parentId: parent._id }, {
                name: sName, image: img(sTag, `qc-sub-${sName}`, { w: 400, h: 400 }), approvalStatus: 'approved', isApproved: true,
                isActive: true, sortOrder: j, parentId: parent._id, restaurantId: null, zoneId: null,
            });
            subcats.push({ sub, parent, products });
        }
    }
    let stores = 0, items = 0;
    for (const zone of zones) {
        const centre = zoneCentre(zone);
        for (const [i, [sName, storeType]] of QC_STORES.entries()) {
            const area = AREAS[zone.name]?.[i + 2] || zone.name;
            const p = offset(centre, ...OFFSETS[(i + 3) % OFFSETS.length]);
            const s = await upsert('qc_restaurants', { restaurantName: sName, zoneId: zone._id }, storeBase(sName, zone, p, area, {
                storeType, estimatedDeliveryTime: '10-15 mins', estimatedDeliveryTimeMinutes: 12,
                profileImage: img('grocery,store', `qc-store-${sName}-logo`, { w: 400, h: 400 }),
                coverImage: img('supermarket', `qc-store-${sName}-cover`, { w: 1200, h: 600 }),
                storageCapability: ['chilled'],
            }));
            stores++;
            for (const { sub, parent, products } of subcats) {
                for (const [pName, qty, unit, price, tag] of products) {
                    const image = img(tag, `qc-item-${pName}`);
                    await upsert('qc_items', { restaurantId: s._id, name: pName }, {
                        restaurantId: s._id, name: pName, description: `${pName}, ${qty} ${unit}`,
                        price, mrp: Math.round(price * 1.15), packSize: `${qty} ${unit}`,
                        categoryId: sub._id, categoryName: sub.name, parentCategoryId: parent._id,
                        image, images: [image], stockQty: 100, foodType: 'Veg',
                        approvalStatus: 'approved', isAvailable: true, perishability: 'ambient',
                        sku: `SEED-${slug(pName).toUpperCase()}`,
                    });
                    items++;
                }
            }
        }
    }
    for (const [i, [title, tag]] of [['Fresh groceries in 10 min', 'groceries'], ['Snack attack deals', 'snacks'], ['Stock up on staples', 'rice,grains']].entries()) {
        await upsert('qc_hero_banners', { title }, {
            title, imageUrl: img(tag, `qc-hero-${title}`, { w: 1200, h: 500 }), publicId: `seed/qc-hero-${i}`,
            isActive: true, sortOrder: i,
        });
        await upsert('qc_top_banners', { publicId: `seed/qc-top-${i}` }, {
            image: img(tag, `qc-top-${title}`, { w: 1200, h: 400 }), publicId: `seed/qc-top-${i}`, order: i, isActive: true,
        });
    }
    console.log(`quick commerce: ${QC_CATEGORIES.length} categories, ${subcats.length} subcategories, ${stores} stores, ${items} products, banners`);
};

const seedMedical = async () => {
    const pharmacies = await col('qc_restaurants').find({ storeType: 'pharmacy', status: 'approved' }).toArray();
    // No qc_categories rows for medicines: that collection is quick commerce's
    // grocery tree, and pharmacy groupings would show up among its aisles.
    let items = 0;
    for (const ph of pharmacies) {
        if (!ph.profileImage || !String(ph.profileImage).includes('/seed/')) {
            await col('qc_restaurants').updateOne({ _id: ph._id }, { $set: { profileImage: img('pharmacy', `med-store-${ph.restaurantName}`, { w: 400, h: 400 }) } });
        }
        for (const [name, cat, price, tag] of MEDICINES) {
            const image = img(tag, `med-item-${name}`);
            await upsert('qc_items', { restaurantId: ph._id, name }, {
                restaurantId: ph._id, name, description: name, price, mrp: Math.round(price * 1.1),
                categoryId: null, categoryName: cat, image, images: [image], stockQty: 200,
                foodType: 'Veg', approvalStatus: 'approved', isAvailable: true, perishability: 'ambient',
                sku: `SEED-MED-${slug(name).toUpperCase()}`,
            });
            items++;
        }
    }
    console.log(`medical: ${pharmacies.length} pharmacies stocked, ${items} medicine listings`);
};

const seedTaxi = async () => {
    const zones = await col('taxizones').find({}).toArray();
    let prices = 0;
    for (const [name, iconType, capacity, desc, tag, base, baseKm, perKm, perMin] of TAXI_VEHICLES) {
        const icon = img(tag, `taxi-${name}`, { w: 400, h: 300 });
        const v = await upsert('taxivehicles', { name, transport_type: 'taxi' }, {
            name, transport_type: 'taxi', icon_types: iconType, capacity, short_description: desc,
            description: desc, image: icon, icon, map_icon: icon, dispatch_type: 'normal', status: 1, active: true,
        });
        for (const zone of zones) {
            await upsert('taxisetprices', { zone_id: zone._id, vehicle_type: v._id, transport_type: 'taxi' }, {
                zone_id: zone._id, vehicle_type: v._id, transport_type: 'taxi', pricing_scope: 'ride',
                base_price: base, base_distance: baseKm, price_per_distance: perKm, time_price: perMin,
                waiting_charge: 1, free_waiting_before: 3, free_waiting_after: 3,
                payment_type: ['cash', 'online'], active: 1, status: 'active',
            });
            prices++;
        }
    }
    for (const [i, [title, tag]] of [['Ride safe, ride smart', 'taxi,city'], ['First ride 50% off', 'car,road']].entries()) {
        await upsert('taxibanners', { title }, {
            title, image: img(tag, `taxi-banner-${title}`, { w: 1200, h: 500 }), link_type: 'deep_link', active: true, sort_order: i,
        });
    }
    console.log(`taxi: ${TAXI_VEHICLES.length} vehicle types, ${prices} zone fares, banners`);
};

const SP_TAGS = {
    'AC Service and Repair': 'air,conditioner', 'AC & Appliance Repair': 'appliance,repair', Cooler: 'air,cooler',
    LED: 'television', 'Kitchen Chimney': 'kitchen,chimney', 'Washing Machine Repair': 'washing,machine',
    'Refrigerator Repair': 'refrigerator', Microwave: 'microwave', 'Water Heater Repair': 'water,heater',
    'Fan Repair': 'ceiling,fan', 'Switch & Socket Installation': 'electrical,socket', 'Tap Repair': 'faucet,plumbing',
    'Drill & Hang': 'drill,tools', 'Home Wiring Installation': 'electrician,wiring',
    'Electrical Installation & Repair': 'electrician', 'Smart Home Setup': 'smart,home',
    Cleaning: 'house,cleaning', 'Massage for Men': 'massage,spa',
};

const seedServices = async () => {
    const cats = await col('sp_categories').find({ status: 'active' }).toArray();
    let services = 0;
    for (const c of cats) {
        const tag = SP_TAGS[c.title] || 'home,repair';
        const icon = img(tag, `sp-cat-${c.title}`, { w: 400, h: 400 });
        await col('sp_categories').updateOne({ _id: c._id }, { $set: { homeIconUrl: icon, imageUrl: img(tag, `sp-cat-${c.title}-wide`, { w: 1000, h: 500 }), updatedAt: now() } });
        await col('sp_brands').updateMany({ categoryIds: c._id }, { $set: { iconUrl: icon, updatedAt: now() } });
        const list = await col('sp_user_services').find({ categoryId: c._id }).toArray();
        for (const s of list) {
            await col('sp_user_services').updateOne({ _id: s._id }, { $set: { iconUrl: img(tag, `sp-svc-${s.title}-${c.title}`, { w: 600, h: 450 }), updatedAt: now() } });
            services++;
        }
    }
    const byTitle = Object.fromEntries(cats.map((c) => [c.title, c]));
    const pick = (t) => byTitle[t]?._id || null;
    const card = (title, tag, price) => ({ title, imageUrl: img(tag, `sp-card-${title}`, { w: 600, h: 450 }), price, rating: 4.7, reviews: 1200 });
    await upsert('sp_home_contents', { cityId: null }, {
        cityId: null, isActive: true,
        banners: [
            { imageUrl: img('air,conditioner', 'sp-banner-ac', { w: 1200, h: 500 }), text: 'AC service from ₹499', targetCategoryId: pick('AC Service and Repair'), order: 0 },
            { imageUrl: img('house,cleaning', 'sp-banner-cleaning', { w: 1200, h: 500 }), text: 'Deep cleaning for your home', targetCategoryId: pick('Cleaning'), order: 1 },
            { imageUrl: img('electrician', 'sp-banner-electrician', { w: 1200, h: 500 }), text: 'Electricians in 60 minutes', targetCategoryId: pick('Electrical Installation & Repair'), order: 2 },
        ],
        promos: [
            { title: 'Summer AC check-up', subtitle: 'Flat 20% off', imageUrl: img('air,conditioner', 'sp-promo-ac', { w: 800, h: 400 }), gradientClass: 'from-sky-500 to-blue-600', targetCategoryId: pick('AC Service and Repair') },
            { title: 'Relax at home', subtitle: 'Massage from ₹799', imageUrl: img('massage,spa', 'sp-promo-massage', { w: 800, h: 400 }), gradientClass: 'from-rose-500 to-pink-600', targetCategoryId: pick('Massage for Men') },
        ],
        noteworthy: [
            { title: 'Smart home setup', imageUrl: img('smart,home', 'sp-note-smart', { w: 500, h: 500 }), targetCategoryId: pick('Smart Home Setup') },
            { title: 'Washing machine repair', imageUrl: img('washing,machine', 'sp-note-washing', { w: 500, h: 500 }), targetCategoryId: pick('Washing Machine Repair') },
            { title: 'Tap & leak fixes', imageUrl: img('faucet,plumbing', 'sp-note-tap', { w: 500, h: 500 }), targetCategoryId: pick('Tap Repair') },
        ],
        booked: [card('AC Service (Split)', 'air,conditioner', 599), card('Full Home Cleaning', 'house,cleaning', 2499), card('Fan Installation', 'ceiling,fan', 199)],
        categorySections: [
            { title: 'Appliance repair', cards: [card('Refrigerator Repair', 'refrigerator', 699), card('Microwave Repair', 'microwave', 499), card('Chimney Cleaning', 'kitchen,chimney', 899)] },
            { title: 'Electrical work', cards: [card('Switch & Socket', 'electrical,socket', 149), card('Home Wiring', 'electrician,wiring', 999), card('Drill & Hang', 'drill,tools', 199)] },
        ],
        curated: [],
    });
    console.log(`services: ${cats.length} categories, ${services} services illustrated, home content`);
};

// ── main ────────────────────────────────────────────────────────────────────
const COLLECTIONS = ['food_categories', 'food_restaurants', 'food_items', 'food_hero_banners', 'food_home_promotion_banners',
    'qc_categories', 'qc_restaurants', 'qc_items', 'qc_hero_banners', 'qc_top_banners',
    'taxivehicles', 'taxisetprices', 'taxibanners', 'sp_home_contents'];

const run = async () => {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) throw new Error('MONGODB_URI is not set');
    await mongoose.connect(uri);
    console.log(`db: ${mongoose.connection.db.databaseName}  images -> ${SEED_DIR}`);

    if (process.argv.includes('--remove')) {
        for (const c of COLLECTIONS) {
            const r = await col(c).deleteMany({ seedTag: SEED_TAG });
            if (r.deletedCount) console.log(`removed ${r.deletedCount} from ${c}`);
        }
        await mongoose.disconnect();
        return;
    }

    await seedFood();
    await seedQuickCommerce();
    await seedMedical();
    await seedTaxi();
    await seedServices();
    await downloadAll();
    await mongoose.disconnect();
};

run().catch(async (err) => {
    console.error(err);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
});
