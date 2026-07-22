const JSON_CONTENT_TYPE = /^application\/(?:[a-z0-9.+-]+\+)?json(?:\s*;|$)/i;

export class RequestBodyError extends Error {
    constructor(
        message: string,
        readonly status: 400 | 413 | 415,
    ) {
        super(message);
        this.name = 'RequestBodyError';
    }
}

export async function readJsonBody(request: Request, maxBytes: number): Promise<unknown> {
    const contentType = request.headers.get('content-type') ?? '';

    if (!JSON_CONTENT_TYPE.test(contentType)) {
        throw new RequestBodyError('Content-Type must be application/json', 415);
    }

    const contentLength = Number(request.headers.get('content-length'));

    if (Number.isFinite(contentLength) && contentLength > maxBytes) {
        throw new RequestBodyError('Request body is too large', 413);
    }

    if (!request.body) {
        throw new RequestBodyError('Invalid JSON body', 400);
    }

    const reader = request.body.getReader();
    const decoder = new TextDecoder('utf-8', {fatal: true});
    let body = '';
    let bytesRead = 0;

    try {
        while (true) {
            const {done, value} = await reader.read();

            if (done) {
                break;
            }

            bytesRead += value.byteLength;

            if (bytesRead > maxBytes) {
                await reader.cancel();
                throw new RequestBodyError('Request body is too large', 413);
            }

            body += decoder.decode(value, {stream: true});
        }

        body += decoder.decode();
        return JSON.parse(body) as unknown;
    } catch (error) {
        if (error instanceof RequestBodyError) {
            throw error;
        }

        throw new RequestBodyError('Invalid JSON body', 400);
    }
}
