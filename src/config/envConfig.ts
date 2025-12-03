import dotenv from 'dotenv';
import { cleanEnv, host, port, str, testOnly } from 'envalid';

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
  HOST: host({ devDefault: testOnly('localhost') }),
  PORT: port(),
  CORS_ORIGIN: str(),
  JWT_SECRET: str(),
  MAILJET_API_KEY: str(),
  MAILJET_SECRET_KEY: str(),
  GROQ_API_KEY: str(),
  OPENROUTER_API_KEY: str(),
  TOGETHER_API_KEY: str(),
  AUTH_USERNAME: str(),
  AUTH_PASSWORD: str(),
});