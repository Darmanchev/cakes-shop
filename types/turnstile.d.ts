export {};

declare global {
    interface Window {
        turnstile?: {
            reset: () => void;
        };
    }
}
