import Marketplace from '../Marketplace';
import config from '../../../config';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  Collection,
  CollectionListItem,
} from '@sl/discord/dist/core/magiceden/magiceden.types';
import solanaConfig from '@sl/discord/dist/config/solana.config';
import { newConnection } from '@sl/discord/dist/core/solana/connection';
import { fetchNFTData } from '@sl/discord/dist/core/solana/fetchNFTData';

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

  public async getCollections(
    launchpad = true,
    offset = 0,
    limit = 10,
  ): Promise<Collection[] | null> {
    const url = `${solanaConfig.magiceden.baseUrl}/${
      launchpad ? 'launchpad/' : ''
    }collections?offset=${offset}&limit=${limit}`;
    const response = await this.fetch<Collection[]>(url);
    return response.data ?? null;
  }

  public async getCollectionListings(
    symbol: string,
    offset = 0,
    limit = 10,
  ): Promise<CollectionListItem[]> {
    const url = `${solanaConfig.magiceden.baseUrl}/collections/${symbol}/listings?offset=${offset}&limit=${limit}`;
    const response = await this.fetch<CollectionListItem[]>(url);
    const data = response.data ?? null;
    if (data == null) return data;

    // Fetch more detailed extra NFT Data
    const conn = newConnection();
    for (const item of data) {
      item.extra.nftData = await fetchNFTData(conn, item.tokenMint);
    }

    return data;
  }
}

const magicEden = new MagicEden();
export default magicEden;
