import { generateKeyPairSync } from 'crypto';
import { join } from 'path';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

function generateJwtKeys() {
  // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
  const keys = generateKeyPairSync('rsa', {
    modulusLength: 4096, // bits - standard for RSA keys
    publicKeyEncoding: {
      type: 'pkcs1', // "Public Key Cryptography Standards 1"
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1', // "Public Key Cryptography Standards 1"
      format: 'pem',
    },
  });

  const jwtKeyPath = join(__dirname, '..', 'jwt_keys');

  if (!existsSync(jwtKeyPath)) {
    mkdirSync(jwtKeyPath);
  }

  const publicKeyPath = join(jwtKeyPath, 'public.pem');
  writeFileSync(publicKeyPath, keys.publicKey);

  const privateKeyPath = join(jwtKeyPath, 'private.pem');
  // Create the private key file
  writeFileSync(privateKeyPath, keys.privateKey);
}

generateJwtKeys();
