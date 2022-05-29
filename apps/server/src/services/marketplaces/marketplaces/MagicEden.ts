import Marketplace from '../Marketplace';
import config from '../../../config';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import solanaConfig from '@sl/discord/dist/config/solana.config';
import { createError } from '../../../middleware/error';

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
    try {
      const url = `${solanaConfig.magiceden.baseUrl}/collections/${symbol}`;
      const response = await this.fetch<CollectionResponse>(url);
      return response.data ?? null;
    } catch (e) {
      throw createError('jeff', 404);
    }
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
  name: string;
  description: string;
  image: string;
  twitter: string;
  discord: string;
  website: string;
  categories: string[];
  floorPrices: number;
  listedCount: number;
  avgPrice24hr: number;
  volumeAll: number;

  // createdAt: string;
  // enabledAttributesFilters: true;
  // totalItems: number;
  // updatedAt: string;
  // watchlistCount: number;
  // hasAllItems: boolean;
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

// Example Response before mint (https://api-mainnet.magiceden.io/launchpads/smart_sea_society)
// {
//   _id: '628d3567e8472800119ea776',
//   name: 'Smart Sea Society',
//   symbol: 'smart_sea_society',
//   image:
//     'https://img-cdn.magiceden.dev/rs:fill:500:500:0:0/plain/https://bafybeicmmomyark7um7wfxhxxjpbg3vl6htx6qudmfq4b2iw5pixcb6uxe.ipfs.nftstorage.link',
//   description:
//     'Smart Sea Society uses AI to build tools that give their holders unprecedented alpha about the NFT market. By holding an NFT you get exclusive access to our current and future tools.',
//   price: 1.9,
//   size: 4444,
//   prelaunch: {
//     whitelist: true,
//   },
//   launchDate: '2022-05-29T17:00:00.000Z',
//   featured: false,
//   published: true,
//   crossmintId: '',
//   finished: false,
//   mint: {},
//   createdAt: '2022-05-24T19:43:34.359Z',
//   discordLink: 'https://discord.gg/SmartSeaSociety',
//   websiteLink: 'https://www.smartseasociety.com/',
//   twitterLink: 'https://twitter.com/SmartSeaSociety',
//   disableAutolist: false,
//   externalLink: '',
//   externalLinkCTA: '',
//   placeholderStages: [],
//   presaleAmountOffset: 0,
//   badges: ['doxxed', 'escrow_1d'],
//   richDescription:
//     "The Smart Sea Society was founded with the idea of creating a society with well educated holders that have access to the right tools and information.\n\nAs many of you might know, navigating through the NFT space can be a difficult task. The founders of Smart Sea Society experienced this first hand when they started trading their first NFT’s. Knowing which factors to focus on and which ones you shouldn’t is hard for anyone in the NFT space, experienced or not.\n\nThe founders started looking for predictive factors that could help them make educated trades. They discovered that social media sentiment had strong predictive capabilities when it comes to the floor price of Solana NFT’s. The Smart Sea Society initiative originated here. With the goal of making educated NFT trading accessible for everyone, the following tools were created:\n\n1. Popular collection trends: Get unprecedented alpha by comparing the Twitter and ME data of hundreds of NFT projects.\n2. Twitter Signals: Get alerted when the Twitter volume of a project significantly increases/decreases\n3. Magic Eden Signals: Receive signals about supply shocks, floor price goals, specific listings and activity changes.\n4. Whale Profile Insights: Follow the biggest players in the space, check their relevancy and see what they are talking about.\n5. AI FP Predictor: Get access to FP predictions based on 1+ million data points from Magic Eden and Twitter combined.\n6. Magic Eden Snipes: Automatically snipe NFT's set by your own price, rank or trait goals.\n",
//   richPeople:
//     "## Chupito\n\nAs a born entrepreneur Chupito has had his own businesses since he was 18. While he started out in E-commerce, he soon moved to the software business. It was the innovation and the great sense of community that eventually draw Chupito to the NFT space. Now, he's here to stay.\n\n\n\n## Beenzie\n\nBeenzie started his entrepreneurial journey with Chupito. Together they realized they made a solid team, which enabled them to persevere in their first few businesses, and now with Smart Sea Society. Beenzie specializes in marketing, specifically in the marketing of start ups.\n\n\n\n## Byron\n\nAs an experienced full-stack developer Byron loves to build platforms and apps from the ground up. He did so for the businesses of Chupito and Beenzie a few times, now he partnered up with them to build the Smart Sea Society platform.\n\n\n\n## Alexandro\n\nSolving complicated problems using AI, that's what Alexandro loves to do. After finishing up his bachelor of econometrics in the Netherlands, he soon wanted to start his own business. After helping numerous clients with AI related issues, he can now express his abilities in the Smart Sea Society platform.\n\n\n\n## Kaspersky\n\nEven though Kaspersky is still studying, he has already managed to develop a great skillset when it comes to 3D art. His creativity is well broadcasted in the Smart Sea Society pfp collection.\n\n\n\n## Alves\n\nLike most of the others, Alves also quickly started his own business after his studies. With his ideas he helps building the Smart Sea Society narrative in a unique and creative way.  \n\n\n\n## Serpintos\n\nLast but not least we've got Serpintos. As a developer he helps Byron by specifically picking up the front-end related tasks. He is largely responsible for the smooth and clean UX and UI on the platform and website. ",
//   richRoadmap:
//     '## Completed Roadmap Steps\n\n\n\n1. Twitter, Discord and Website launch\n2. Building the base platform, ensuring a high-end UX and UI\n3. Establishing a strong marketing campaign to attract exposure to the project\n4. Composition of a high quality NFT art collection\n5. Release roadmap with features and plan for the future\n6. Launching portal access\n7. Beta access to the Smart Sea Society portal (whitelist members only) including the Popular 8. Collection Trends dashboard\n9. Magic Eden and Twitter signals\n\n\n## Upcoming Roadmap Steps\n\n\n\n1. NFT collection launch\n2. Exclusive access to the platform for holders\n3. Listing on secondary marketplaces\n4. Whale profile dashboard release\n5. AI floor price predictor release\n6. Magic Eden sniper bot release\n7. Establishment of the holders DAO\n8. Votes in the DAO on what extra features will be built by the team\n\n\n## Future Roadmap Steps\n\n\n\n1. Growing the team to ensure a successful expansion of the platform\n2. Building features voted in by the DAO\n3. Expansion of the platform to other blockchains, with the primary focus on Ethereum\n4. IOS and Android app launch',
//   updatedAt: '2022-05-29T05:06:22.150Z',
//   whitepaperLink: '',
// }

// Example Response after Mint (https://api-mainnet.magiceden.io/launchpads/pixel_panthers)
// {
//   _id: '625ffcec40813800100652d2',
//   name: 'Pixel Panthers | Co-Own a Bank in the Metaverse',
//   symbol: 'pixel_panthers',
//   image:
//     'https://dl.airtable.com/.attachmentThumbnails/c099b30004614be0d27d2f163dc3ad2d/f56a3e21',
//   description:
//     '**This collection’s mint was impacted by a degraded Solana network, making completing transactions difficult.  If your mint failed, please try again.**\n\nPixel Panthers co-own a Bank in the Metaverse, vote on the direction of the Pixels.so | Borrow Against Your NFTs! platform, and will directly benefit from the growth of the platform.',
//   price: 1.5,
//   size: 3500,
//   prelaunch: {
//     whitelist: true,
//   },
//   launchDate: '2022-04-28T19:00:00.000Z',
//   featured: false,
//   published: true,
//   finished: true,
//   mint: {
//     candyMachineId: 'ApsUCVDJdwvC4pJoEAyjomnozeoCUb2d5j4vAYQGLkKy',
//   },
//   createdAt: '2022-04-20T12:30:36.037Z',
//   discordLink: 'https://discord.gg/XXdWxNzAeu',
//   websiteLink: 'https://www.pixels.so',
//   twitterLink: 'https://www.twitter.com/pixels_so',
//   disableAutolist: false,
//   externalLink: '',
//   externalLinkCTA: '',
//   placeholderStages: [],
//   badges: ['doxxed', 'escrow_1d'],
//   richDescription:
//     'Pixels.so aims to bridge the gap between DeFi and NFTs to unlock the full potential of digital art, real estate & metaverse assets.\n\nPixels.so | Borrow Against Your NFTs! is a platform that allows users to deposit their NFTs and borrow against them. In addition to supporting Solana projects, the platform will also allow ERC-721 projects (like CryptoPunks) and Metaverse-based virtual property to be used as eligible collateral. Pixels.so believes this blended approach between DeFi and NFTs will help unlock the full potential of NFTs and the Metaverse. \n\nHolders of Pixel Panthers | Co-Own a Bank in the Metaverse will directly benefit from the growth and success of Pixels.so!\n\nUsers may choose to borrow under two models: \n1. Peer-to-Peer NFT Borrowing Model. Request to borrow against one of your Solana or non-Solana NFTs.\n2. Instant Borrowing Model. Instantly receive 25% of the value of your Solana or non-Solana NFTs.\n\nPixels.so | Borrow Against Your NFTs! will continue building out a full stack of innovative products with the core aim of fueling the integration of DeFi into the Metaverse. Pixels.so changes everything and we want you to be a part of it!',
//   richPeople:
//     "# Meet the Team\nPixels.so | Borrow Against Your NFTs! is in development with some of the brightest Solana-developers, with backgrounds spanning from building full-scale cryptocurrency exchanges to providing blockchain solutions to the largest countries in the world. Our team's breadth of expertise includes FinTech, Blockchain, Insurance, Traditional Finance and Technology Consulting.\n\n\n\nWith additional funding the team plans to further build out our talented team in order to help re-define the way people use NFTs, and continue to fuel the integration of DeFi into the Metaverse. \n\n\n\nNick K., CEO & Founder\n\nMike L., CMO & Head of Staff\n\nBobby T., Head of Info & Research",
//   richRoadmap:
//     "# Phase 1: Staking of Pixel Panthers | Co-Own a Bank in the Metaverse!\n* • Launching a staking platform to allow holders to begin earning $PIXL, our governance-utility token.\n* • 25% of the supply of $PIXL is allocated for project emissions.\n\n# \n\n# Phase 2: Launch of Pixels.so | Borrow Against Your NFTs!\n* • Launching of the Peer-to-Peer NFT borrowing model. This will enable anyone to request to borrow against any of their NFTs.\n* • Launching of the Instant Borrowing model. This will enable anyone to instantly borrow up to 25% of their NFT, Digital Land, or Metaverse Asset. Holders will vote on which projects will be eligible for the Instant Borrowing Model. Only well-established projects, with a proven track-record, will be eligible.\n\n# \n\n# Phase 3: Cross-Chain Support\n* • Pixels.so | Borrow Against Your NFTs! will allow non-Solana assets such as ERC-721 projects, and non-Solana digital land to be eligible collateral under our Peer-to-Peer NFT Borrowing model and our Instant Borrowing model. \n\n# \n\n# Phase 4: Bank of the Metaverse\n* • Pixels.so | Borrow Against Your NFTs! will boast a full suite of advanced products centered around our core mission of building out the Bank of the Metaverse. The platform's future products will focus on fueling the integration of DeFi into the Metaverse. There are many innovative offerings to build out and we are more than excited to bring these to market in never-before-seen ways!\n\n[Roadmap](https://www.pixels.so)",
//   updatedAt: '2022-04-30T10:04:45.950Z',
//   whitepaperLink:
//     'https://www.pixels.so/wp-content/uploads/2022/04/Pixels.so-Whitepaper-3-30-2022.pdf',
//   presaleAmountOffset: null,
//   state: {
//     candyMachine: 'ApsUCVDJdwvC4pJoEAyjomnozeoCUb2d5j4vAYQGLkKy',
//     itemsAvailable: 3500,
//     itemsRedeemed: 3500,
//     itemsRedeemedNormal: 3500,
//     itemsRedeemedRaffle: 0,
//     itemsRemaining: 0,
//     raffleTicketsPurchased: 0,
//     stages: [
//       {
//         price: 1.5,
//         startTime: '2022-04-28T17:00:00.000Z',
//         walletLimit: 3,
//         endTime: '2022-04-28T18:59:00.000Z',
//         type: 'NormalSale',
//       },
//       {
//         price: 1.5,
//         startTime: '2022-04-28T19:00:00.000Z',
//         walletLimit: 10,
//         endTime: '2022-05-01T22:00:00.000Z',
//         type: 'NormalSale',
//       },
//     ],
//     goLiveDate: '2022-04-28T17:00:00.000Z',
//   },
// }
