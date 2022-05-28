import { Column, Entity, getRepository, Repository } from 'typeorm';
import { isConnectedToDB } from '../../setup';

@Entity({ name: 'wallets' })
export class Wallet {
  @Column({ name: 'public_key', type: 'varchar', unique: true, primary: true })
  publicKey: string;

  // TODO encrypt (e.g. https://github.com/generalpiston/typeorm-encrypted#readme)
  // based on userId, serverSecret, userSecret (he has to dm the bot) [Note: not 100% save but its just a fun project lol]
  @Column({ name: 'private_key', type: 'varchar', unique: true })
  privateKey: string;
}
