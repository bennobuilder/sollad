import * as anchor from '@project-serum/anchor';
import axios from 'axios';
import { newConnection } from './connection';
import solanaConfig from '../../config/solana.config';
import { getUserWallet } from './getUserWallet';

export async function buyNFT(config: {
  auctionHouseAddress: string;
  tokenMint: string;
  tokenATA: string;
  seller: string;
  sellerReferral: string;
  price: number;
}) {
  const {
    auctionHouseAddress,
    tokenMint,
    tokenATA,
    seller,
    price,
    sellerReferral,
  } = config;

  // Connect to cluster and import wallet to work with
  const conn = newConnection();
  const wallet = getUserWallet(solanaConfig.wallet.secretKey);

  // Airdrop one SOL to wallet (dev network only!!)
  // await conn.requestAirdrop(wallet.publicKey, web3.LAMPORTS_PER_SOL);

  // Create network and wallet context for easy transactions
  const provider = new anchor.AnchorProvider(
    conn, // Cluster connection where the program is deployed
    wallet, // Wallet used to pay for and sign all transactions
    anchor.AnchorProvider.defaultOptions(),
  );

  // Get buy instruction from MagicEden
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
        sellerReferral, // TransactionError (0x7d3 = 2003) if not provided
        sellerExpiry: -1,
      },
      headers: {
        // Authorization: `Bearer ${'eyJsYXN0QWN0aXZlIjoxNjUzNDAwNzk3NDI2LCJzZXNzaW9uSWQiOiJyd053dDhBYWxrZHZoY3VuT3F0N3YifQ==.609c31f22c3c75d3a212d99c230b01fc25f16c8b3ce493e61c16232148ccdd6e'}`,

        // Replicate headers of client in browser, until I get a proper authoriziation token
        ['cache-control']: 'no-cache',
        origin: 'https://magiceden.io',
        pragma: 'no-cache',
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
    console.log('Transaction', { tx, wallet: provider.wallet });

    // For testing otherwise it gets expensive lol
    const signature = await provider.simulate(
      anchor.web3.Transaction.populate(anchor.web3.Message.from(tx.data)),
    );

    // Sends the MagicEden transaction, paid for and signed by the provider's wallet
    // const signature = await provider.sendAndConfirm(
    //   anchor.web3.Transaction.populate(
    //     anchor.web3.Message.from(Buffer.from(tx.data)),
    //   ),
    // );

    console.log('Signature: ', signature);
  }
}
