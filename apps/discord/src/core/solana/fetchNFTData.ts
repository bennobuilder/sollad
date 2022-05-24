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
): Promise<NFTData | null> {
  try {
    const pda = await Metadata.getPDA(token);
    const metadata = await Metadata.load(web3Conn, pda);
    const response = await axios.get<NFTData>(metadata.data.data.uri);
    return response.data;
  } catch (e) {
    console.error('Fetching NFT data failed', e);
  }
  return null;
}

export type NFTData = {
  name: string;
  symbol: string;
  image: string;
  sellerFeeBasisPoints: number;
  creators: MetadataJsonCreator[];
};
