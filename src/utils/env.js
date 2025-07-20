import dotenv from 'dotenv';

dotenv.config();

export const env = (key, defaultValue) => {
  const value = process.env[key];
  if (value) {
    return value;
  }
  if (defaultValue) {
    return defaultValue;
  }
  if (key === 'JWT_SECRET') {
    return 'default-secret-key';
  }
  throw new Error(`Missing environment variable: ${key}`);
};
