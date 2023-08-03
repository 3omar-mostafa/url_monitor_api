import { generateKeyPairSync } from 'crypto';
import * as path from 'path';
import * as fs from 'fs';
import { config } from 'dotenv';

export function generateJwtKeys() {
  config({ path: path.resolve(__dirname, '..', '.env') });
  const { JWT_PRIVATE_KEY_PATH, JWT_PUBLIC_KEY_PATH } = process.env;

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

  if (doesKeysExist()) {
    console.log('Public & Private keys already exist. Skipping generation');
    return;
  }

  saveKey(keys.privateKey, JWT_PRIVATE_KEY_PATH);
  saveKey(keys.publicKey, JWT_PUBLIC_KEY_PATH);
  console.log('Public & Private keys were successfully generated');
}

function doesKeysExist(): boolean {
  const privateKeyPath = process.env.JWT_PRIVATE_KEY_PATH;
  const publicKeyPath = process.env.JWT_PUBLIC_KEY_PATH;

  return fs.existsSync(privateKeyPath) && fs.existsSync(publicKeyPath);
}

function saveKey(key: string, keyPath: string) {
  const keyDirectory = path.dirname(keyPath);

  if (!fs.existsSync(keyDirectory)) {
    fs.mkdirSync(keyDirectory, { recursive: true });
  }

  fs.writeFileSync(keyPath, key);
}

generateJwtKeys();
