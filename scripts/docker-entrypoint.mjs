import {validateProductionEnvironment} from '../lib/security/production-env.mjs';

validateProductionEnvironment();

await import('../server.js');
