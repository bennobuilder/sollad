import bs58 from 'bs58';
import * as web3 from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';

export function getUserWallet(secretKey?: string) {
  let userWalletKeypair: web3.Keypair;

  // Import existing User wallet via private key
  if (secretKey != null) {
    const uint8ArraySecret = Uint8Array.from(bs58.decode(secretKey));
    userWalletKeypair = web3.Keypair.fromSecretKey(uint8ArraySecret);
  }
  // Create new User wallet keypair
  else {
    userWalletKeypair = web3.Keypair.generate();
  }

  return new anchor.Wallet(userWalletKeypair);
}
