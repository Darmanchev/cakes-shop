export async function register() {
    if (process.env.NODE_ENV !== 'production' ||
        process.env.NEXT_RUNTIME === 'edge' ||
        process.env.NEXT_PHASE === 'phase-production-build'
    ) {
        return;
    }

    const {validateProductionEnvironment} = await import(
        './lib/security/production-env.mjs'
    );
    validateProductionEnvironment();
}
