import web3 from '@solana/web3.js';
import config from '../../../config';
import * as anchor from '@project-serum/anchor';
import axios from 'axios';

export async function buy() {
  // Connect to cluster (devnet)
  const conn = new web3.Connection(web3.clusterApiUrl(config.sol.network));

  // Create User wallet keypair (dev wallet)
  const userWalletKeypair = web3.Keypair.generate();
  const wallet = new anchor.Wallet(userWalletKeypair);
  const provider = new anchor.AnchorProvider(
    conn,
    wallet,
    anchor.AnchorProvider.defaultOptions(),
  );

  // Airdrop one SOL to dev wallet
  await conn.requestAirdrop(userWalletKeypair.publicKey, web3.LAMPORTS_PER_SOL);

  // Get buy instruction
  const response = await axios.get(
    `${config.sol.magiceden.baseUrl}/instructions/buy`,
    {
      params: {
        buyer: wallet.publicKey.toBase58(),
        auctionHouseAddress: 'E8cU1WiRWjanGxmn96ewBgk9vPTcL6AEZ1t6F6fkgUWe',
        tokenMint: 'AnfUJkHhQncsdBcrKHk8EhUa3ss3W4ahz3VdA2LC276m',
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
