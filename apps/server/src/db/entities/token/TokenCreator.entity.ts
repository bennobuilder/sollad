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
