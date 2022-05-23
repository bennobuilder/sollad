import { Cluster } from '@solana/web3.js';

const isDev = process.env.DEV === 'true';
const meUrls = {
  prodBaseUrl: 'https://api-mainnet.magiceden.dev/v2',
  devBaseUrl: 'https://api-devnet.magiceden.dev/v2',
};

export default {
  isDev,
  network: isDev ? 'devnet' : 'mainnet-beta',
  magiceden: {
    urls: meUrls,
    baseUrl: isDev ? meUrls.devBaseUrl : meUrls.prodBaseUrl,
    bearerToken: process.env.ME_BEARER_TOKEN,
  },
} as SolConfigType;

type SolConfigType = {
  isDev: boolean;
  network: Cluster;
  magiceden: {
    urls: {
      prodBaseUrl: string;
      devBaseUrl: string;
    };
    baseUrl: string;
    bearerToken: string;
  };
};
