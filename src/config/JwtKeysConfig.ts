import { readFileSync } from 'fs';

export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  JWT_PRIVATE_KEY: readFileSync(process.env.JWT_PRIVATE_KEY_PATH),
  JWT_PUBLIC_KEY: readFileSync(process.env.JWT_PUBLIC_KEY_PATH),
});
