import {randomBytes, scryptSync} from 'node:crypto';

async function readPassword() {
    if (!process.stdin.isTTY) {
        let input = '';

        for await (const chunk of process.stdin) {
            input += chunk;
        }

        return input.trimEnd();
    }

    process.stdout.write('Admin password: ');
    process.stdin.setRawMode(true);
    process.stdin.resume();

    return new Promise((resolve, reject) => {
        let password = '';

        process.stdin.on('data', (chunk) => {
            const input = chunk.toString('utf8');

            if (input === '\u0003') {
                process.stdin.setRawMode(false);
                reject(new Error('Cancelled'));
                return;
            }

            if (input === '\r' || input === '\n') {
                process.stdin.setRawMode(false);
                process.stdin.pause();
                process.stdout.write('\n');
                resolve(password);
                return;
            }

            if (input === '\u007f') {
                password = password.slice(0, -1);
                return;
            }

            password += input;
        });
    });
}

const password = await readPassword();

if (password.length < 12) {
    console.error('The admin password must contain at least 12 characters.');
    process.exitCode = 1;
} else {
    const salt = randomBytes(16);
    const hash = scryptSync(password, salt, 64);

    console.log(`scrypt$${salt.toString('base64url')}$${hash.toString('base64url')}`);
}
