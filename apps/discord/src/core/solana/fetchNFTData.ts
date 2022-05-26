import * as web3 from '@solana/web3.js';
import axios from 'axios';
import { programs, MetadataJsonCreator } from '@metaplex/js';

// https://docs.metaplex.com/sdk/js/getting-started#your-first-request
const {
  metadata: { Metadata },
} = programs;

export async function fetchNFTData(
  web3Conn: web3.Connection,
  token: string,
): Promise<NFTDataType | null> {
  try {
    // Fetch data
    const pda = await Metadata.getPDA(token);
    const metadata = await Metadata.load(web3Conn, pda);
    const response = await axios.get(metadata.data.data.uri);
    const data = response.data;

    // Format 'seller_fee_basis_points'
    if (data['seller_fee_basis_points'] != null) {
      data.sellerFeeBasisPoints = data['seller_fee_basis_points'];
    }

    // Format attributes
    if (Array.isArray(data['attributes'])) {
      data['attributes'] = data['attributes'].map((attribute) => ({
        traitType: attribute['trait_type'],
        value: attribute['value'],
      }));
    }

    return response.data;
  } catch (e) {
    console.error('Fetching NFT data failed', e);
  }
  return null;
}

export type NFTDataType = {
  name: string;
  symbol: string;
  description: string;
  sellerFeeBasisPoints: number;
  image: string;
  attributes: AttributeType[];
  collection: CollectionType;
  properties: PropertiesType;
  creators: MetadataJsonCreator[];
};

type AttributeType = {
  traitType: string;
  value: string;
};

type CollectionType = { name: string; family: string };

type PropertiesType = {
  category: string;
  files: { uri: string; type: string }[];
  creators: { address: string; share: number }[];
};

// Example Object
// {
//   name: 'MetaWorm #60',
//   symbol: 'MW',
//   description: 'MetaWorms is a collection of randomly generated worms roaming the Solana blockchain.',
//   seller_fee_basis_points: 800,
//   image: 'https://arweave.net/7MGiVgxQhcwJfPv2GG-HLvIlUnkQKWFVqYPgnZ1tKYM?ext=png',
//   attributes: attributes: [
//     { traitType: 'Background', value: 'Pink' },
//     { traitType: 'Body', value: 'Red' },
//     { traitType: 'Clothes', value: 'Bandana' },
//     { traitType: 'Mouth', value: 'Weird' },
//     { traitType: 'Eye', value: 'Hypnosis' },
//     { traitType: 'Hat', value: 'Candles' }
//   ],
//   collection: { name: 'MetaWorm', family: 'MetaWorm' },
//   properties: { files: [ { uri: '4224.png', type: 'image/png' } ], category: 'image', creators: [{
//       address: '6ZGW36zKDwBBcjoym4djxx6ks6CD21JS24M52DxeaGts',
//       share: 100
//     }]
//   }
// }
