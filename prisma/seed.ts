import { PrismaClient, ProductCategory } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import {products} from "@/features/products/product.data";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5435/stas_cakes_shop',
});

const prisma = new PrismaClient({
    adapter,
});

const categoryMap = {
    cakes: ProductCategory.CAKES,
    cinnabons: ProductCategory.CINNABONS,
    combos: ProductCategory.COMBOS,
} as const;

async function main() {
    for (const product of products) {
        await prisma.product.upsert({
            where: { id: product.id },
            update: {
                name: product.name,
                category: categoryMap[product.category],
                price: product.price,
                description: product.description,
                image: product.image,
                weight: product.weight,
                filling: product.filling,
                prepTime: product.prepTime,
            },
            create: {
                id: product.id,
                name: product.name,
                category: categoryMap[product.category],
                price: product.price,
                description: product.description,
                image: product.image,
                weight: product.weight,
                filling: product.filling,
                prepTime: product.prepTime,
            },
        });
    }
}

main()
    .then(async () =>{
    await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });