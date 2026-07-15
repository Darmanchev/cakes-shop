import { createHmac, timingSafeEqual} from "node:crypto";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

interface AdminSessionPayload  {
    role: 'admin';
    exp: number;
};

const payload: AdminSessionPayload = {
    role: 'admin',
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
};