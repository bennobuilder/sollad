import {
  Column,
  Entity,
  getRepository,
  PrimaryGeneratedColumn,
  Repository,
} from 'typeorm';
import { isConnectedToDB } from '../../setup';

@Entity({ name: 'token_creator' })
export class TokenCreator {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ name: 'address', type: 'varchar' })
  address: string;

  @Column({ name: 'share', type: 'integer' })
  share: number;
}

// To avoid this issue: https://github.com/typeorm/typeorm/issues/5362
export function getTokenCreatorRepository(): Repository<TokenCreator> | null {
  return isConnectedToDB ? getRepository(TokenCreator) : null;
}
