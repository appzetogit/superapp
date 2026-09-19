/**
 * Import the Quick Drop catalogue (real banners, dishes, restaurants, vehicles)
 * in place of the generic demo catalogue.
 *
 * Input is an EJSON export (see the header of the export step in the deploy notes):
 *   { food_hero_banners: [...], food_items: [...], food_restaurants: [...], ... }
 * Stores arrive WITHOUT owner/contact/KYC fields; this script gives them placeholder
 * contacts and places them inside our own zones (Nagpur/Indore), round-robin.
 *
 * Every remote image (http URL or data: URI) is downloaded into
 * UPLOAD_STORAGE_ROOT/seed/qd/ and rewritten to UPLOAD_BASE_URL/seed/qd/, so nothing
 * depends on the source host.
 *
 *   node scripts/import-quickdrop-catalogue.js /path/to/export.json
 */
import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import mongoose from 'mongoose';

const SEED_TAG = 'quickdrop-import-v1';
const DEMO_TAG = 'demo-catalogue-v1';
const STORAGE_ROOT = process.env.UPLOAD_STORAGE_ROOT || path.resolve('uploads');
const BASE_URL = (process.env.UPLOAD_BASE_URL || '/uploads').replace(/\/+$/, '');
const DIR = path.join(STORAGE_ROOT, 'seed', 'qd');

const file = process.argv[2];
if (!file) { console.error('usage: node scripts/import-quickdrop-catalogue.js <export.json>'); process.exit(1); }

const col = (n) => mongoose.connection.db.collection(n);
const now = () => new Date();

// ── images ──────────────────────────────────────────────────────────────────
const cache = new Map();
let fetched = 0, failed = 0;
const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg', 'image/avif': 'avif' };

const localize = async (src) => {
    if (typeof src !== 'string' || !src) return src;
    if (src.startsWith(BASE_URL)) return src;
    if (!/^https?:\/\/|^data:image\//.test(src)) return src;
    if (cache.has(src)) return cache.get(src);
    const hash = crypto.createHash('sha1').update(src).digest('hex').slice(0, 16);
    let out = src;
    try {
        let buf, type;
        if (src.startsWith('data:')) {
            const m = src.match(/^data:(image\/[a-z+.-]+);base64,(.*)$/s);
            if (!m) throw new Error('bad data uri');
            type = m[1]; buf = Buffer.from(m[2], 'base64');
        } else {
            const res = await fetch(src, { redirect: 'follow', signal: AbortSignal.timeout(30000) });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            type = (res.headers.get('content-type') || '').split(';')[0];
            buf = Buffer.from(await res.arrayBuffer());
        }
        const ext = EXT[type] || path.extname(new URL(src.startsWith('data:') ? 'http://x/a.png' : src).pathname).slice(1) || 'jpg';
        const name = `${hash}.${ext}`;
        await fs.writeFile(path.join(DIR, name), buf);
        out = `${BASE_URL}/seed/qd/${name}`;
        fetched++;
    } catch (err) {
        failed++;
        console.log(`  ! image ${src.slice(0, 80)}: ${err.message}`);
    }
    cache.set(src, out);
    return out;
};

const IMAGE_KEY = /image|icon|banner|cover|logo|gif|photo|thumbnail/i;
/** Walk a document and localize every string under an image-ish key. */
const localizeDoc = async (value, key = '') => {
    if (Array.isArray(value)) return Promise.all(value.map((v) => localizeDoc(v, key)));
    if (value && typeof value === 'object' && !(value instanceof Date) && !(value instanceof mongoose.Types.ObjectId) && value._bsontype === undefined) {
        const out = {};
        for (const [k, v] of Object.entries(value)) out[k] = await localizeDoc(v, k);
        return out;
    }
    if (typeof value === 'string' && (IMAGE_KEY.test(key) || /url$/i.test(key)) && /^https?:\/\/|^data:image\//.test(value)) {
        return localize(value);
    }
    return value;
};

// ── helpers ─────────────────────────────────────────────────────────────────
const replaceAll = async (collection, docs) => {
    let n = 0;
    for (const raw of docs) {
        const doc = await localizeDoc(raw);
        await col(collection).replaceOne({ _id: doc._id }, { ...doc, seedTag: SEED_TAG, updatedAt: now() }, { upsert: true });
        n++;
    }
    return n;
};
const centreOf = (zone) => {
    const lats = zone.coordinates.map((c) => Number(c.latitude));
    const lngs = zone.coordinates.map((c) => Number(c.longitude));
    return { lat: (Math.min(...lats) + Math.max(...lats)) / 2, lng: (Math.min(...lngs) + Math.max(...lngs)) / 2 };
};
const OFFSETS = [[0.6, 0.4], [-1.1, 1.2], [1.7, -0.9], [-2.1, -1.4], [2.3, 1.8], [-0.7, 2.5], [1.2, -2.3], [-1.6, 0.3]];
const AREAS = {
    Nagpur: ['Dharampeth', 'Sitabuldi', 'Sadar', 'Civil Lines', 'Manish Nagar', 'Ramdaspeth', 'Pratap Nagar', 'Itwari'],
    Indore: ['Vijay Nagar', 'Palasia', 'Rajwada', 'Sapna Sangeeta', 'Bhawarkua', 'Scheme 54', 'Annapurna', 'MG Road'],
};
let phoneSeq = 9822000100;

const placeStores = async (collection, stores, zones) => {
    let n = 0;
    for (const [i, raw] of stores.entries()) {
        const zone = zones[i % zones.length];
        const slot = Math.floor(i / zones.length);
        const [north, east] = OFFSETS[slot % OFFSETS.length];
        const c = centreOf(zone);
        const lat = c.lat + north / 111;
        const lng = c.lng + east / (111 * Math.cos((c.lat * Math.PI) / 180));
        const area = AREAS[zone.name]?.[slot % 8] || zone.name;
        const phone = String(phoneSeq++);
        const doc = await localizeDoc(raw);
        const name = doc.restaurantName || `Store ${i + 1}`;
        await col(collection).replaceOne({ _id: doc._id }, {
            ...doc,
            restaurantName: name,
            restaurantNameNormalized: name.toLowerCase().replace(/\s+/g, ' ').trim(),
            ownerName: `${name.split(' ')[0]} Owner`,
            ownerEmail: `store-${doc._id}.seed@appzeto.test`,
            ownerPhone: phone, ownerPhoneLast10: phone, primaryContactNumber: phone, countryCode: '+91',
            pureVegRestaurant: Boolean(doc.pureVegRestaurant),
            openingTime: doc.openingTime || '08:00', closingTime: doc.closingTime || '23:30',
            openDays: doc.openDays?.length ? doc.openDays : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            status: 'approved', approvedAt: now(), isAcceptingOrders: true, autoAcceptOrders: false, outsideHoursOverride: false,
            zoneId: zone._id, city: zone.name, area,
            location: {
                type: 'Point', coordinates: [lng, lat], latitude: lat, longitude: lng,
                formattedAddress: `${area}, ${zone.name}`, address: `${area}, ${zone.name}`, addressLine1: area, area, city: zone.name,
                state: zone.name === 'Indore' ? 'Madhya Pradesh' : 'Maharashtra',
            },
            seedTag: SEED_TAG, createdAt: doc.createdAt || now(), updatedAt: now(),
        }, { upsert: true });
        n++;
    }
    return n;
};

// ── main ────────────────────────────────────────────────────────────────────
const run = async () => {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) throw new Error('MONGODB_URI is not set');
    await mongoose.connect(uri);
    await fs.mkdir(DIR, { recursive: true });
    const { EJSON } = mongoose.mongo.BSON;
    const data = EJSON.parse(await fs.readFile(file, 'utf8'), { relaxed: false });
    console.log(`db: ${mongoose.connection.db.databaseName}`);

    // 1. Retire the generic demo rows this import replaces. Medical listings and
    //    grocery products stay: the source has almost none of either.
    for (const c of ['food_categories', 'food_restaurants', 'food_items', 'food_hero_banners', 'food_home_promotion_banners', 'taxivehicles', 'taxisetprices', 'taxibanners', 'qc_hero_banners', 'qc_top_banners']) {
        const r = await col(c).deleteMany({ seedTag: DEMO_TAG });
        if (r.deletedCount) console.log(`retired ${r.deletedCount} demo rows from ${c}`);
    }

    // 2. Food.
    const foodZones = await col('food_zones').find({ isActive: true }).sort({ name: 1 }).toArray();
    const foodRestaurantIds = new Set(data.food_restaurants.map((r) => String(r._id)));
    console.log(`food restaurants: ${await placeStores('food_restaurants', data.food_restaurants, foodZones)}`);
    const items = data.food_items.filter((it) => foodRestaurantIds.has(String(it.restaurantId)));
    console.log(`food items: ${await replaceAll('food_items', items.map((it) => ({ ...it, approvalStatus: 'approved', isActive: it.isActive !== false, isAvailable: it.isAvailable !== false })))}`);
    const cats = data.food_categories.map((c) => ({ ...c, zoneId: null }));
    console.log(`food categories: ${await replaceAll('food_categories', cats)}`);
    for (const c of ['food_hero_banners', 'food_home_promotion_banners', 'food_under250_banners', 'food_explore_icons']) {
        const docs = (data[c] || []).map((d) => ({ ...d, zoneId: null, isActive: d.isActive !== false, ...(c === 'food_hero_banners' && !d.module ? { module: 'food' } : {}) }));
        if (docs.length) console.log(`${c}: ${await replaceAll(c, docs)}`);
    }

    // 3. Quick commerce: real stores, banners and products; category images by name.
    const qcZones = await col('qc_zones').find({ isActive: true }).sort({ name: 1 }).toArray();
    const grocery = data.qc_restaurants.filter((s) => s.storeType !== 'pharmacy');
    console.log(`qc stores: ${await placeStores('qc_restaurants', grocery, qcZones)}`);
    const qcStoreIds = new Set(grocery.map((s) => String(s._id)));
    const qcItems = data.qc_items.filter((it) => qcStoreIds.has(String(it.restaurantId)));
    if (qcItems.length) console.log(`qc items: ${await replaceAll('qc_items', qcItems.map((it) => ({ ...it, approvalStatus: 'approved', isAvailable: true })))}`);
    for (const c of ['qc_hero_banners', 'qc_top_banners']) {
        if (data[c]?.length) console.log(`${c}: ${await replaceAll(c, data[c].map((d) => ({ ...d, isActive: d.isActive !== false })))}`);
    }
    let catImages = 0;
    for (const src of data.qc_categories) {
        if (!src.image) continue;
        const image = await localize(src.image);
        const r = await col('qc_categories').updateMany({ name: src.name }, { $set: { image, updatedAt: now() } });
        catImages += r.modifiedCount;
    }
    console.log(`qc category images matched by name: ${catImages}`);

    // 4. Taxi: vehicles as-is, fares generated for our zones.
    const vehicles = data.taxivehicles.map((v) => ({ ...v, status: 1, active: true }));
    console.log(`taxi vehicles: ${await replaceAll('taxivehicles', vehicles)}`);
    const taxiZones = await col('taxizones').find({}).toArray();
    const FARE = { bike: [20, 7, 1], auto: [30, 12, 1.5], car: [50, 14, 2], suv: [100, 22, 2.5] };
    let fares = 0;
    for (const v of vehicles) {
        const kind = /bike|moto/i.test(v.name) ? 'bike' : /auto/i.test(v.name) ? 'auto' : /suv|xl|innova/i.test(v.name) ? 'suv' : 'car';
        const [base, perKm, perMin] = FARE[kind];
        for (const z of taxiZones) {
            await col('taxisetprices').updateOne({ zone_id: z._id, vehicle_type: v._id, transport_type: v.transport_type || 'taxi' }, {
                $set: {
                    zone_id: z._id, vehicle_type: v._id, transport_type: v.transport_type || 'taxi', pricing_scope: 'ride',
                    base_price: base, base_distance: 2, price_per_distance: perKm, time_price: perMin, waiting_charge: 1,
                    free_waiting_before: 3, free_waiting_after: 3, payment_type: ['cash', 'online'], active: 1, status: 'active',
                    seedTag: SEED_TAG, updatedAt: now(),
                },
                $setOnInsert: { createdAt: now() },
            }, { upsert: true });
            fares++;
        }
    }
    console.log(`taxi fares: ${fares}`);

    // 5. Service-provider home page content (banners/promos), global row only.
    const home = (data.sp_home_contents || []).find((h) => !h.cityId) || data.sp_home_contents?.[0];
    if (home) {
        const doc = await localizeDoc(home);
        delete doc._id;
        await col('sp_home_contents').updateOne({ cityId: null }, { $set: { ...doc, cityId: null, seedTag: SEED_TAG, updatedAt: now() } }, { upsert: true });
        console.log('sp home content: replaced');
    }

    console.log(`images: ${fetched} stored, ${failed} failed`);
    await mongoose.disconnect();
};

run().catch(async (err) => {
    console.error(err);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
});
