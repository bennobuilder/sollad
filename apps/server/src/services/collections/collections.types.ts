type MagicEdenCollectionResponse = {
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

// Example Response (https://api-mainnet.magiceden.io/collections/metaworms?edge_cache=true)
// {
//     "symbol": "metaworms",
//     "categories": [
//         "art",
//         null
//     ],
//     "createdAt": "2022-04-22T22:14:50.820Z",
//     "derivativeDetails": {
//         "originName": "",
//         "originLink": ""
//     },
//     "description": "MetaWorms is a collection of randomly generated Worms roaming the Solana blockchain.",
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
