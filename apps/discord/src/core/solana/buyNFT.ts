import * as web3 from '@solana/web3.js';
import config from '../../config';
import * as anchor from '@project-serum/anchor';
import axios from 'axios';
import { newConnection } from './connection';
import solanaConfig from '../../config/solana.config';
import { toUTF8Array } from '../utils/toUTF8Array';
import bs58 from 'bs58';

export async function buyNFT(config: {
  auctionHouseAddress: string;
  tokenMint: string;
  tokenATA: string;
  seller: string;
  price: number;
}) {
  const { auctionHouseAddress, tokenMint, tokenATA, seller, price } = config;

  // Connect to cluster
  const conn = newConnection();

  // Create User wallet keypair (dev wallet)
  // const userWalletKeypair = web3.Keypair.generate();

  if (solanaConfig.wallet.secretKey == null) return;

  // Import User wallet via private key
  const uint8ArraySecret = Uint8Array.from(
    bs58.decode(solanaConfig.wallet.secretKey),
  );
  const userWalletKeypair = web3.Keypair.fromSecretKey(uint8ArraySecret);

  const wallet = new anchor.Wallet(userWalletKeypair);
  const provider = new anchor.AnchorProvider(
    conn,
    wallet,
    anchor.AnchorProvider.defaultOptions(),
  );

  // Airdrop one SOL to dev wallet
  // await conn.requestAirdrop(userWalletKeypair.publicKey, web3.LAMPORTS_PER_SOL);

  // Get buy instruction
  const response = await axios.get(
    `${solanaConfig.magiceden.baseUrl}/instructions/buy_now`,
    {
      params: {
        buyer: wallet.publicKey.toBase58(),
        seller,
        auctionHouseAddress,
        tokenMint,
        tokenATA,
        price,
        // sellerReferral: 'todo',
        // sellerExpiry: -1,
      },
      headers: {
        // Authorization: `Bearer ${'eyJsYXN0QWN0aXZlIjoxNjUzNDAwNzk3NDI2LCJzZXNzaW9uSWQiOiJyd053dDhBYWxrZHZoY3VuT3F0N3YifQ==.609c31f22c3c75d3a212d99c230b01fc25f16c8b3ce493e61c16232148ccdd6e'}`,

        // Replicate headers of client in browser, until I get a proper authoriziation token
        origin: 'https://magiceden.io',
        referer: 'https://magiceden.io/',
        ['sec-fetch-dest']: 'empty',
        ['sec-fetch-mode']: 'cors',
        ['sec-fetch-site']: 'same-site',
        ['sec-gpc']: 1,
        ['user-agent']:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36',
      },
    },
  );

  const tx = response.data.tx;
  if (tx != null) {
    console.log('TX', { tx });
    const signature = provider.sendAndConfirm(
      anchor.web3.Transaction.populate(
        anchor.web3.Message.from(Buffer.from(tx.data)),
      ),
    );

    console.log(signature);
  }
}
