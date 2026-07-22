import {PrismaClient} from '@prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {decryptOrderPii, encryptOrderPii, isEncryptedPii} from '../lib/security/pii';

const databaseUrl = process.env.DATABASE_URL
    ?? 'postgresql://postgres:postgres@localhost:5435/stas_cakes_shop';
const prisma = new PrismaClient({
    adapter: new PrismaPg({connectionString: databaseUrl}),
});

const BATCH_SIZE = 100;

async function main() {
    if (!process.env.PII_ENCRYPTION_KEY?.trim()) {
        throw new Error('PII_ENCRYPTION_KEY is required for the data migration');
    }

    let cursor: string | undefined;
    let migrated = 0;

    for (;;) {
        const orders = await prisma.order.findMany({
            orderBy: {id: 'asc'},
            take: BATCH_SIZE,
            ...(cursor ? {cursor: {id: cursor}, skip: 1} : {}),
        });

        if (orders.length === 0) {
            break;
        }

        for (const order of orders) {
            if (isEncryptedPii(order.name)) {
                // Fail loudly if the configured key does not match existing data.
                decryptOrderPii(order);
                continue;
            }

            const encrypted = encryptOrderPii(order);

            await prisma.order.update({
                where: {id: order.id},
                data: {
                    name: encrypted.name,
                    phone: encrypted.phone,
                    email: encrypted.email,
                    deliveryAddress: encrypted.deliveryAddress,
                    comment: encrypted.comment,
                },
            });
            migrated += 1;
        }

        cursor = orders.at(-1)?.id;
    }

    console.log(`Encrypted PII in ${migrated} order(s).`);
}

main()
    .finally(() => prisma.$disconnect());
