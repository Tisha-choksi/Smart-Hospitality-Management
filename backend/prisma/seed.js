const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    const admin = await prisma.user.upsert({
        where: { email: 'admin@hotel.com' },
        update: {},
        create: {
            email: 'admin@hotel.com',
            password: await bcrypt.hash('Admin@123', 10),
            name: 'Admin User',
            role: 'ADMIN',
        },
    });

    const staff = await prisma.user.upsert({
        where: { email: 'staff@hotel.com' },
        update: {},
        create: {
            email: 'staff@hotel.com',
            password: await bcrypt.hash('Staff@123', 10),
            name: 'Staff Member',
            role: 'STAFF',
        },
    });

    const guest = await prisma.user.upsert({
        where: { email: 'guest@hotel.com' },
        update: {},
        create: {
            email: 'guest@hotel.com',
            password: await bcrypt.hash('Guest@123', 10),
            name: 'Guest User',
            role: 'GUEST',
        },
    });

    const room1 = await prisma.room.upsert({
        where: { roomNumber: '101' },
        update: {},
        create: {
            roomNumber: '101',
            type: 'DOUBLE',
            price: 150,
            capacity: 2,
            amenities: ['WiFi', 'TV', 'AC'],
        },
    });

    const room2 = await prisma.room.upsert({
        where: { roomNumber: '102' },
        update: {},
        create: {
            roomNumber: '102',
            type: 'SUITE',
            price: 250,
            capacity: 4,
            amenities: ['WiFi', 'TV', 'AC', 'Jacuzzi'],
        },
    });

    console.log('✓ Database seeded successfully');
    console.log('Test Credentials:');
    console.log('  Admin: admin@hotel.com / Admin@123');
    console.log('  Staff: staff@hotel.com / Staff@123');
    console.log('  Guest: guest@hotel.com / Guest@123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });