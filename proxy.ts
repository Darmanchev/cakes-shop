import {NextRequest, NextResponse} from 'next/server';

export function proxy(request: NextRequest) {
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
    const isDevelopment = process.env.NODE_ENV === 'development';
    const contentSecurityPolicy = [
        "default-src 'self'",
        `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com${isDevelopment ? " 'unsafe-eval'" : ''}`,
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https://images.unsplash.com",
        "font-src 'self' data:",
        "connect-src 'self' https://challenges.cloudflare.com",
        "frame-src https://challenges.cloudflare.com",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "object-src 'none'",
        ...(isDevelopment ? [] : ['upgrade-insecure-requests']),
    ].join('; ');
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', nonce);
    requestHeaders.set('Content-Security-Policy', contentSecurityPolicy);

    const response = NextResponse.next({request: {headers: requestHeaders}});
    response.headers.set('Content-Security-Policy', contentSecurityPolicy);

    return response;
}

export const config = {
    matcher: [
        {
            source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
            missing: [
                {type: 'header', key: 'next-router-prefetch'},
                {type: 'header', key: 'purpose', value: 'prefetch'},
            ],
        },
    ],
};
