import dotenv from 'dotenv';

// Calling before loading the configurations to load the environment variables first
const ENVIRONMENT = process.env.NODE_ENV || 'local'; // https://stackoverflow.com/questions/11104028/why-is-process-env-node-env-undefined
dotenv.config({ path: `.env.${ENVIRONMENT}` });

// Configuration Objects
import discordConfig from './discord.config';
import solanaConfig from './solana.config';

export const config = {
  discord: discordConfig,
  sol: solanaConfig,
};

console.log(`Loaded Environment Variables from '.env.${ENVIRONMENT}'`, config);

export default config;
