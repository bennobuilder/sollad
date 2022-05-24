import * as web3 from '@solana/web3.js';
import config from '../../config';
import * as anchor from '@project-serum/anchor';
import axios from 'axios';
import { newConnection } from './connection';
import solanaConfig from '../../config/solana.config';

export async function buyNFT(auctionHouseAddress: string, tokenMint: string) {
  // Connect to cluster
  const conn = newConnection();

  // Create User wallet keypair (dev wallet)
  // const userWalletKeypair = await conn.requestAirdrop(userWalletKeypair.publicKey, web3.LAMPORTS_PER_SOL);

  // Import User wallet via private key
  const userWalletKeypair = web3.Keypair.fromSecretKey(
    new TextEncoder().encode(solanaConfig.wallet.secretKey),
  );

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
    `${config.sol.magiceden.baseUrl}/instructions/buy_now`,
    {
      params: {
        buyer: wallet.publicKey.toBase58(),
        auctionHouseAddress,
        tokenMint,
        price: 0.2,
      },
    },
  );

  const tx = response.data.tx;
  const signature = provider.sendAndConfirm(
    anchor.web3.Transaction.populate(
      anchor.web3.Message.from(Buffer.from(tx.data)),
    ),
  );

  console.log(signature);
}
