import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { CollectionResponse } from './magiceden.types';

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
    offset = 0,
    limit = 10,
  ): Promise<CollectionResponse[] | null> {
    const url = `https://api-mainnet.magiceden.dev/v2/launchpad/collections?offset=${offset}&limit=${limit}`;
    const response = await this.fetch<CollectionResponse[]>(url);
    return response.data ?? null;
  }
}
