import { Column, Entity, getRepository, OneToOne, Repository } from 'typeorm';
import { isConnectedToDB } from '../../setup';
import { Wallet } from './Wallet.entity';
import { JoinColumn } from 'typeorm/browser';

@Entity({ name: 'users' })
export class User {
  @Column({ name: 'discord_id', type: 'varchar', unique: true, primary: true })
  discordId: string;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'discriminator', type: 'varchar' })
  discriminator: string;

  @Column({ name: 'avatar', type: 'varchar', nullable: true })
  avatar?: string;

  // https://orkhan.gitbook.io/typeorm/docs/one-to-one-relations
  @OneToOne(() => Wallet)
  @JoinColumn()
  wallet: Wallet;
}

// To avoid this issue: https://github.com/typeorm/typeorm/issues/5362
export function getUserRepository(): Repository<User> | null {
  return isConnectedToDB ? getRepository(User) : null;
}
