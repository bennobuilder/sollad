import { NFTData } from '../solana/fetchNFTData';

export type Collection = {
  symbol: string;
  name: string;
  description: string;
  featured: boolean;
  image: string;
  price: number;
  size: number;
  launchDatetime?: string;
  edition?: string;
};

export type CollectionListItem = {
  pdaAddress: string;
  auctionHouse: string;
  tokenAddress: string;
  tokenMint: string;
  seller: string;
  tokenSize: number;
  price: number;
  nftData: NFTData | null;
};
