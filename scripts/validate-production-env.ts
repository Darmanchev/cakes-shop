import {validateProductionEnvironment} from '../lib/security/production-env.mjs';

(process.env as Record<string, string | undefined>).NODE_ENV = 'production';
validateProductionEnvironment();

console.log('Production environment validation passed.');
