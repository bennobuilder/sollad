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

// To avoid this issue: https://github.com/typeorm/typeorm/issues/5362
export function getCollectionCategoryRepository(): Repository<CollectionCategory> | null {
  return isConnectedToDB ? getRepository(CollectionCategory) : null;
}
