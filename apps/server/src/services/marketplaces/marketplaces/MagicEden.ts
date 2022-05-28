import Marketplace from '../Marketplace';
import config from '../../../config';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import solanaConfig from '@sl/discord/dist/config/solana.config';

const appConfig = config.app;

class MagicEden extends Marketplace {
  name = 'Magic Eden';
  programIds = [
    'MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8',
    'M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K',
  ];

  iconUrl = 'https://www.magiceden.io/img/favicon.png';
  private baseUrls = {
    prodBaseUrl: 'https://api-mainnet.magiceden.dev/v2',
    devBaseUrl: 'https://api-devnet.magiceden.dev/v2',
  };
  baseUrl = appConfig.isDev
    ? this.baseUrls.devBaseUrl
    : this.baseUrls.prodBaseUrl;
  itemUrl = 'https://magiceden.io/item-details/%s';

  private authKey?: string = undefined;

  private fetch<T>(
    url: string,
    config: AxiosRequestConfig<T> = {},
  ): Promise<AxiosResponse<T>> {
    let headers = config.headers ?? {};
    if (this.authKey != null) {
      headers = {
        Authorization: `Bearer ${this.authKey}`,
      };
    }

    return axios.get(url, {
      headers,
      ...config,
    });
  }

  public async getCollection(
    symbol: string,
  ): Promise<CollectionResponse | null> {
    const url = `${solanaConfig.magiceden.baseUrl}/collections/${symbol}`;
    const response = await this.fetch<CollectionResponse>(url);
    return response.data ?? null;
  }

  public async getCollectionListings(
    symbol: string,
    offset = 0,
    limit = 10, // max = 20
  ): Promise<CollectionListItem[]> {
    const url = `${solanaConfig.magiceden.baseUrl}/collections/${symbol}/listings?offset=${offset}&limit=${limit}`;
    const response = await this.fetch<CollectionListItem[]>(url);
    return response.data ?? null;
  }
}

const magicEden = new MagicEden();
export default magicEden;

type CollectionResponse = {
  symbol: string;
  categories: string[];
  createdAt: string;
  derivativeDetails: {
    originName: string;
    originLink: string;
  };
  description: string;
  discord: string;
  enabledAttributesFilters: true;
  image: string;
  isDerivative: boolean;
  name: string;
  totalItems: number;
  twitter: string;
  website: string;
  updatedAt: string;
  watchlistCount: number;
  hasAllItems: boolean;
};

// Example Response (https://api-mainnet.magiceden.io/collections/metaworms)
// {
//   symbol: 'metaworms',
//   name: 'Meta Worms',
//   description:
//     'MetaWorms is a collection of randomly generated Worms roaming the Solana blockchain.',
//   image:
//     'https://creator-hub-prod.s3.us-east-2.amazonaws.com/metaworms_pfp_1648564959383.jpeg',
//   twitter: 'https://www.twitter.com/MetaWormNFT',
//   discord: 'https://www.discord.gg/v5U8zRAfrH',
//   website: 'https://metawormnft.com',
//   categories: ['art', null],
//   floorPrice: 25000000,
//   listedCount: 1163,
//   avgPrice24hr: 21558333.333333332,
//   volumeAll: 64503144417,
// }

export type CollectionListItem = {
  pdaAddress: string;
  auctionHouse: string;
  tokenAddress: string;
  tokenMint: string;
  seller: string;
  sellerReferral: string;
  tokenSize: number;
  price: number;
  rarity: { howrare?: { rank: string } };
  extra: {
    img: string;
  };
};

// Example Response (https://api-mainnet.magiceden.io/collections/metaworms/listings?offset=0&limit=2)
// [
//   {
//     pdaAddress: 'AA8W5hD4NDgJM26F48jM2SqMbAh4qhFgkScnQGkd1n8j',
//     auctionHouse: 'E8cU1WiRWjanGxmn96ewBgk9vPTcL6AEZ1t6F6fkgUWe',
//     tokenAddress: 'EfXAhWLG4U8D678dWSb5B7DFfx6JRZbYMCZnamw75JDy',
//     tokenMint: '4EaxZ1UUUKD6s8jLWuKjoReKqzTxqtGbaRa8d8FimTGZ',
//     seller: '5AaYYxJXKNXazyk6gWucei8ycLUXqCnho7Epms6XbHsZ',
//     sellerReferral: 'autMW8SgBkVYeBgqYiTuJZnkvDZMVU2MHJh9Jh7CSQ2',
//     tokenSize: 1,
//     price: 0.05,
//     rarity: {},
//     extra: {
//       img: 'https://arweave.net/AzYASbuQrKrq_vPX8lx9Uu-bbnp3_Mx1afyuh9bBAiY?ext=png',
//     },
//   },
//   {
//     pdaAddress: 'Ac7ZoM4spMSbmRwMQnA3Sq9G9gvQkohm73pibFwhAQNy',
//     auctionHouse: 'E8cU1WiRWjanGxmn96ewBgk9vPTcL6AEZ1t6F6fkgUWe',
//     tokenAddress: '6nBFjNWN47bkm18oARLR4KrSUApG4kGfwsPeiD6CV8ad',
//     tokenMint: '4xgKbrxzDnPpiX1MZuct9FmerVkuHTnxHP9t2Weg5fyp',
//     seller: 'BZZmAApWfGpjEck8xdedKdSLsaZzxmTRkQP8aCaAijsJ',
//     sellerReferral: 'autMW8SgBkVYeBgqYiTuJZnkvDZMVU2MHJh9Jh7CSQ2',
//     tokenSize: 1,
//     price: 0.025,
//     rarity: {
//       howrare: {
//         rank: 4756,
//       },
//     },
//     extra: {
//       img: 'https://arweave.net/KDYplA2fG3ubuhsNUslPgZ5H7NQEK130EAAD_SFkgzM?ext=png',
//     },
//   },
// ]
