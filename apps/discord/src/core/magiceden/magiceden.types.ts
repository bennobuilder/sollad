import { NFTDataType } from '../solana/fetchNFTData';

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
  sellerReferral: string;
  tokenSize: number;
  price: number;
  rarity: { howrare?: { rank: string } };
  extra: {
    img: string;
    nftData: NFTDataType | null;
  };
};

// Example
// {
// listing: {
//     pdaAddress: '9gXCbfNFS1ufFKtv6xJ4vXmqt8QmMT8kn3v69rkrtbsk',
//     auctionHouse: 'E8cU1WiRWjanGxmn96ewBgk9vPTcL6AEZ1t6F6fkgUWe',
//     tokenAddress: 'BfjQzbpWk7P5MVgsu5pXMSv84zKp2xm7ZG4tTXncKXeF',
//     tokenMint: 'AxJEmmnARf3QLbQVzWePmhP2oqdvQsgsDmXUjGJgDL73',
//     seller: 'GBfBgzG8p3TV7MrmubSHw87oUet6L1Ypiyz6aZ1djorD',
//     sellerReferral: 'autMW8SgBkVYeBgqYiTuJZnkvDZMVU2MHJh9Jh7CSQ2',
//     tokenSize: 1,
//     price: 0.03,
//     rarity: { howrare: [Object] },
//     extra: {
//       img: 'https://arweave.net/CGtnyg0Y0UbFfIGNTXFxbjddMybnRspLB-lc_LbmHns?ext=png'
//    },
// }
