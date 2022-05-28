import {
  Column,
  Entity,
  getRepository,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Repository,
} from 'typeorm';
import { isConnectedToDB } from '../../setup';
import { Wallet } from '../user/Wallet.entity';
import { JoinColumn } from 'typeorm/browser';
import { CollectionCategory } from './CollectionCategory.entity';

@Entity({ name: 'collections' })
export class Collection {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'family', type: 'varchar', nullable: true })
  family?: string;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  description?: string;

  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl?: string;

  @Column({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt?: Date;

  @Column({ name: 'is_derived', type: 'boolean' })
  isDerived: boolean;

  @Column({ name: 'discord_url', type: 'varchar', nullable: true })
  discordUrl?: string;

  @Column({ name: 'twitter_url', type: 'varchar', nullable: true })
  twitterUrl?: string;

  @Column({ name: 'website_url', type: 'varchar', nullable: true })
  websiteUrl?: string;

  @Column({ name: 'total_items', type: 'integer', nullable: true })
  totalItems?: number;

  @OneToMany(() => CollectionCategory, (category) => category.collectionId)
  categories: CollectionCategory[];
}

// To avoid this issue: https://github.com/typeorm/typeorm/issues/5362
export function getCollectionRepository(): Repository<Collection> | null {
  return isConnectedToDB ? getRepository(Collection) : null;
}
