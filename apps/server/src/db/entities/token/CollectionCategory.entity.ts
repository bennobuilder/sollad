import {
  Column,
  Entity,
  getRepository,
  PrimaryGeneratedColumn,
  Repository,
} from 'typeorm';
import { isConnectedToDB } from '../../setup';

@Entity({ name: 'collection_categories' })
export class CollectionCategory {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ name: 'collection_id', type: 'integer' })
  collectionId: number;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  description?: string;
}
