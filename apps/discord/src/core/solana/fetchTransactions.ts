import {
  ConfirmedSignaturesForAddress2Options,
  Connection,
  ParsedTransactionWithMeta,
  PublicKey,
} from '@solana/web3.js';

export async function fetchTransactions(
  conn: Connection,
  publicKey: string,
  options: OptionsType = {},
): Promise<ParsedTransactionWithMeta[] | null> {
  const signatures = await conn.getConfirmedSignaturesForAddress2(
    new PublicKey(publicKey),
    {
      limit: options?.limit,
      before: options?.before,
      until: options?.until,
    },
    'finalized',
  );

  if (signatures != null) {
    const txs: ParsedTransactionWithMeta[] = [];
    const oldestToLatest = signatures.reverse();

    for (let i = 0; i < oldestToLatest.length; i++) {
      const signature = oldestToLatest[i];
      const tx = await conn.getParsedTransaction(signature.signature);
      if (tx == null) continue;

      // Call onTransaction callback
      options?.onTransaction && (await options.onTransaction(tx));

      txs.push(tx);
    }
    return txs;
  }

  return null;
}

interface OptionsType extends ConfirmedSignaturesForAddress2Options {
  onTransaction?: (tx: ParsedTransactionWithMeta) => Promise<void>;
}
