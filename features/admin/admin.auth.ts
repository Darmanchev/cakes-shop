import { createHmac, timingSafeEqual} from "node:crypto";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

interface AdminSessionPaylod()