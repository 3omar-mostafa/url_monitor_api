import { readFileSync } from 'fs';

export default () => {
  let jwtPrivateKey: Buffer;
  let jwtPublicKey: Buffer;

  try {
    jwtPrivateKey = readFileSync(process.env.JWT_PRIVATE_KEY_PATH);
    jwtPublicKey = readFileSync(process.env.JWT_PUBLIC_KEY_PATH);
  } catch (e) {
    console.log('Could not read JWT Public/Private key pair');
    console.log(e.message);
    jwtPrivateKey = undefined;
    jwtPublicKey = undefined;
  }

  return {
    port: parseInt(process.env.PORT) || 3000,
    JWT_PRIVATE_KEY: jwtPrivateKey,
    JWT_PUBLIC_KEY: jwtPublicKey,
  };
};
