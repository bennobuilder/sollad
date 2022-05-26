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

// TODO Stats https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/metaworms?edge_cache=true
// {
//   "results": {
//   "symbol": "metaworms",
//       "enabledAttributesFilters": true,
//       "availableAttributes": [
//     {
//       "count": 167,
//       "floor": 17400000,
//       "attribute": {
//         "trait_type": "Background",
//         "value": "Light Orange"
//       }
//     },
//   // ..
//   ],
//       "floorPrice": 17400000,
//       "listedCount": 1231,
//       "listedTotalValue": 62835311034000,
//       "avgPrice24hr": 24712475,
//       "volume24hr": 197699800,
//       "volumeAll": 62843894417
// }
// }

// TODO Collection Info https://api-mainnet.magiceden.io/collections/metaworms?edge_cache=true
// {
//   "symbol": "metaworms",
//     "categories": [
//   "art",
//   null
// ],
//     "createdAt": "2022-04-22T22:14:50.820Z",
//     "derivativeDetails": {
//   "originName": "",
//       "originLink": ""
// },
//   "description": "MetaWorms is a collection of randomly generated Worms roaming the Solana blockchain.",
//     "discord": "https://www.discord.gg/v5U8zRAfrH",
//     "enabledAttributesFilters": true,
//     "image": "https://creator-hub-prod.s3.us-east-2.amazonaws.com/metaworms_pfp_1648564959383.jpeg",
//     "isDerivative": false,
//     "name": "Meta Worms",
//     "totalItems": 6666,
//     "twitter": "https://www.twitter.com/MetaWormNFT",
//     "website": "https://metawormnft.com",
//     "updatedAt": "2022-05-26T05:22:06.166Z",
//     "watchlistCount": 88,
//     "hasAllItems": true
// }
