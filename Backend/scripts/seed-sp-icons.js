/**
 * Icon-style images for Service Provider categories and brands.
 *
 * Categories render as small home-screen tiles, where a photo reads as noise; a
 * single clean 3D icon reads at a glance. Icons are Microsoft Fluent Emoji (MIT),
 * downloaded once into UPLOAD_STORAGE_ROOT/seed/icons/ and served from our own host.
 *
 * Sets `homeIconUrl` on sp_categories and `iconUrl` on their sp_brands. Leaves
 * `imageUrl` (the wide photo) alone. Safe to re-run.
 *
 *   node scripts/seed-sp-icons.js
 */
import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import mongoose from 'mongoose';

const STORAGE_ROOT = process.env.UPLOAD_STORAGE_ROOT || path.resolve('uploads');
const BASE_URL = (process.env.UPLOAD_BASE_URL || '/uploads').replace(/\/+$/, '');
const DIR = path.join(STORAGE_ROOT, 'seed', 'icons');
const CDN = 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets';

// Fluent Emoji folder names. Skin-toned emoji live under /Default/.
const ICONS = {
    'AC Service and Repair': 'Snowflake',
    'AC & Appliance Repair': 'Wrench',
    AC: 'Snowflake',
    Cooler: 'Wind face',
    LED: 'Television',
    'Kitchen Chimney': 'Cooking',
    'Washing Machine': 'Bubbles',
    'Washing Machine Repair': 'Bubbles',
    Fridge: 'Ice',
    'Refrigerator Repair': 'Ice',
    Microwave: 'Pot of food',
    'Water Heater Repair': 'Shower',
    'Fan Repair': 'Cyclone',
    'Switch & Socket Installation': 'Electric plug',
    'Tap Repair': 'Droplet',
    'Drill & Hang': 'Hammer and wrench',
    'Home Wiring Installation': 'High voltage',
    'Panel Upgrade & Repair': 'Battery',
    'Electrical Installation & Repair': 'Light bulb',
    Electricity: 'High voltage',
    'Appliance Repair & Service': 'Toolbox',
    'Home Repair & Installation': 'House',
    'Smart Home Setup': 'Mobile phone',
    Cleaning: 'Broom',
    'Massage for Men': { folder: 'Person getting massage', toned: true },
};
const FALLBACK = 'Toolbox';

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const sourceUrl = (spec) => {
    const { folder, toned } = typeof spec === 'string' ? { folder: spec, toned: false } : spec;
    const file = folder.toLowerCase().replace(/ /g, '_');
    const rel = toned ? `${folder}/Default/3D/${file}_3d_default.png` : `${folder}/3D/${file}_3d.png`;
    return `${CDN}/${rel.split('/').map(encodeURIComponent).join('/')}`;
};

const fetchIcon = async (spec) => {
    const name = typeof spec === 'string' ? spec : spec.folder;
    const file = `${slug(name)}.png`;
    const dest = path.join(DIR, file);
    try {
        await fs.access(dest);
    } catch {
        const res = await fetch(sourceUrl(spec), { signal: AbortSignal.timeout(30000) });
        if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
        await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
    }
    return `${BASE_URL}/seed/icons/${file}`;
};

const run = async () => {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) throw new Error('MONGODB_URI is not set');
    await mongoose.connect(uri);
    await fs.mkdir(DIR, { recursive: true });
    const db = mongoose.connection.db;

    const cats = await db.collection('sp_categories').find({ status: { $ne: 'deleted' } }).toArray();
    let ok = 0;
    for (const c of cats) {
        let url;
        try {
            url = await fetchIcon(ICONS[c.title] || FALLBACK);
        } catch (err) {
            console.log(`  ! ${c.title}: ${err.message} -- using fallback`);
            url = await fetchIcon(FALLBACK);
        }
        await db.collection('sp_categories').updateOne({ _id: c._id }, { $set: { homeIconUrl: url, updatedAt: new Date() } });
        await db.collection('sp_brands').updateMany({ categoryIds: c._id }, { $set: { iconUrl: url, updatedAt: new Date() } });
        console.log(`  ${c.title.padEnd(34)} ${url.split('/').pop()}`);
        ok++;
    }
    console.log(`icons set on ${ok} categories and their brands`);
    await mongoose.disconnect();
};

run().catch(async (err) => {
    console.error(err);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
});
