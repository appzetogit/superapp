/**
 * Demo zones and service-provider categories for an empty database.
 *
 * A fresh install has no zones, so nothing can be placed on the map: the medical
 * seeder skips every city and the SP seeder finds no categories to fill. This
 * creates Nagpur and Indore (the cities seed-medical-stores.js expects) in every
 * zone model, plus the SP categories sp-seed-services.cjs has a catalogue for.
 *
 * Idempotent: rows are matched by name/slug and only created when missing.
 *
 *   node scripts/seed-demo-zones.js
 *   node scripts/seed-medical-stores.js
 *   node scripts/sp-seed-services.cjs --apply
 */
import 'dotenv/config';
import mongoose from 'mongoose';

const CITIES = [
    { name: 'Nagpur', lat: 21.1458, lng: 79.0882 },
    { name: 'Indore', lat: 22.7196, lng: 75.8577 },
];

// ~12 km square around the centre: big enough that the medical seeder's
// "one shop beyond 5 km" still lands inside the polygon.
const HALF_DEG = 0.11;
const square = ({ lat, lng }) => [
    { latitude: lat + HALF_DEG, longitude: lng - HALF_DEG },
    { latitude: lat + HALF_DEG, longitude: lng + HALF_DEG },
    { latitude: lat - HALF_DEG, longitude: lng + HALF_DEG },
    { latitude: lat - HALF_DEG, longitude: lng - HALF_DEG },
];
const geoPolygon = (pts) => ({
    type: 'Polygon',
    coordinates: [[...pts, pts[0]].map((p) => [p.longitude, p.latitude])],
});

const SP_CATEGORIES = [
    'AC Service and Repair', 'AC & Appliance Repair', 'Cooler', 'LED', 'Kitchen Chimney',
    'Washing Machine Repair', 'Refrigerator Repair', 'Microwave', 'Water Heater Repair',
    'Fan Repair', 'Switch & Socket Installation', 'Tap Repair', 'Drill & Hang',
    'Home Wiring Installation', 'Electrical Installation & Repair', 'Smart Home Setup',
    'Cleaning', 'Massage for Men',
];
const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const run = async () => {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) throw new Error('MONGODB_URI is not set');
    await mongoose.connect(uri);
    console.log(`db: ${mongoose.connection.db.databaseName}`);

    const { FoodZone } = await import('../src/modules/food/admin/models/zone.model.js');
    const { QCZone } = await import('../src/modules/quickCommerce/modules/food/admin/models/zone.model.js');
    const { MedicalZone } = await import('../src/modules/quickCommerce/modules/food/admin/models/medicalZone.model.js');
    const { Zone: TaxiZone } = await import('../src/modules/taxi/driver/models/Zone.js');

    for (const city of CITIES) {
        const coordinates = square(city);
        const base = {
            name: city.name,
            zoneName: city.name,
            serviceLocation: city.name,
            country: 'India',
            unit: 'kilometer',
            boundary_mode: 'polygon',
            coordinates,
            isActive: true,
        };
        for (const [label, Model] of [['food', FoodZone], ['quickCommerce', QCZone], ['medical', MedicalZone]]) {
            const hit = await Model.findOne({ name: city.name });
            if (hit) { console.log(`skip   ${label} zone ${city.name}`); continue; }
            await Model.create(base);
            console.log(`create ${label} zone ${city.name}`);
        }
        if (await TaxiZone.findOne({ name: city.name })) {
            console.log(`skip   taxi zone ${city.name}`);
        } else {
            await TaxiZone.create({
                name: city.name,
                unit: 'km',
                active: true,
                status: 'active',
                boundary_mode: 'polygon',
                geometry: geoPolygon(coordinates),
            });
            console.log(`create taxi zone ${city.name}`);
        }
    }

    const cats = mongoose.connection.db.collection('sp_categories');
    let order = 0;
    for (const title of SP_CATEGORIES) {
        order += 1;
        const slug = slugify(title);
        if (await cats.findOne({ slug })) { console.log(`skip   sp category ${title}`); continue; }
        const now = new Date();
        await cats.insertOne({
            title, slug, status: 'active', showOnHome: true, homeOrder: order,
            hasSaleBadge: false, isConsultancy: false, createdAt: now, updatedAt: now,
        });
        console.log(`create sp category ${title}`);
    }

    await mongoose.disconnect();
};

run().catch(async (err) => {
    console.error(err);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
});
