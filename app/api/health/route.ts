import {NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const NO_STORE_HEADERS = {
    'Cache-Control': 'no-store',
};

export async function GET() {
    try {
        await prisma.$queryRaw`SELECT 1`;

        return NextResponse.json(
            {status: 'ok'},
            {headers: NO_STORE_HEADERS},
        );
    } catch (error) {
        console.error('Health check failed', error);

        return NextResponse.json(
            {status: 'unavailable'},
            {
                status: 503,
                headers: NO_STORE_HEADERS,
            },
        );
    }
}
