import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Collection, CollectionListItem } from './magiceden.types';
import solanaConfig from '../../config/solana.config';
import { newConnection } from '../solana/connection';
import { fetchNFTData } from '../solana/fetchNFTData';

export class MagicEdenApi {
  private authKey?: string;

  constructor(authKey?: string) {
    this.authKey = authKey;
  }

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
