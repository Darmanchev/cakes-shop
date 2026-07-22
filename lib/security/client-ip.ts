import {isIP} from 'node:net';

const HTTP_HEADER_NAME = /^[!#$%&'*+\-.^_`|~0-9a-z]+$/;
const IPV4_MAPPED_IPV6 = /^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/;

function normalizeIpv6(ip: string) {
    const hostname = new URL(`http://[${ip}]/`).hostname.slice(1, -1);
    const mappedIpv4 = IPV4_MAPPED_IPV6.exec(hostname);

    if (!mappedIpv4) {
        return hostname;
    }

    const high = Number.parseInt(mappedIpv4[1], 16);
    const low = Number.parseInt(mappedIpv4[2], 16);

    return [high >> 8, high & 0xff, low >> 8, low & 0xff].join('.');
}

export function normalizeClientIp(value: string | null) {
    if (!value) {
        return null;
    }

    const candidate = value.trim();

    // A trusted edge must overwrite this header with one address. Accepting a
    // comma-separated chain would make the client-controlled part ambiguous.
    if (candidate.length === 0 || candidate.length > 64 || candidate.includes(',')) {
        return null;
    }

    const version = isIP(candidate);

    if (version === 4) {
        return candidate;
    }

    if (version === 6) {
        return normalizeIpv6(candidate);
    }

    return null;
}

export function getTrustedProxyHeaderName() {
    const headerName = process.env.TRUSTED_PROXY_IP_HEADER?.trim().toLowerCase();

    if (!headerName || !HTTP_HEADER_NAME.test(headerName)) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('TRUSTED_PROXY_IP_HEADER must name a trusted proxy header');
        }

        return null;
    }

    return headerName;
}

export function getClientIp(headers: Headers) {
    const headerName = getTrustedProxyHeaderName();

    if (!headerName) {
        return process.env.NODE_ENV === 'production' ? null : '127.0.0.1';
    }

    return normalizeClientIp(headers.get(headerName));
}

export function getClientIdentifier(headers: Headers) {
    const ip = getClientIp(headers);

    return ip ? `ip:${ip}` : null;
}
