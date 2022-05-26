import * as web3 from '@solana/web3.js';
import solanaConfig from '../../config/solana.config';

export function newConnection(
  config: web3.ConnectionConfig = {},
): web3.Connection {
  console.log(
    `Created new Connection to Solana '${solanaConfig.network}'`,
    web3.clusterApiUrl(solanaConfig.network),
  );
  return new web3.Connection(web3.clusterApiUrl(solanaConfig.network), config);
}
