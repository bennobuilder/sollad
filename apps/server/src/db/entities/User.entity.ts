import {
  Column,
  Entity,
  getRepository,
  PrimaryGeneratedColumn,
  Repository,
} from 'typeorm';
import { isConnectedToDB } from '../setup';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'discord_id', unique: true })
  discordId: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'discriminator' })
  discriminator: string;

  @Column({ name: 'avatar', nullable: true })
  avatar?: string;
}

// To avoid this issue: https://github.com/typeorm/typeorm/issues/5362
export function getUserRepository(): Repository<User> | null {
  return isConnectedToDB ? getRepository(User) : null;
}
