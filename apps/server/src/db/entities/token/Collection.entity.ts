import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CollectionCategory } from './CollectionCategory.entity';
import { Token } from './Token.entity';

@Entity({ name: 'collections' })
export class Collection {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'family', type: 'varchar', nullable: true })
  family?: string;

  @Column({ name: 'symbol', type: 'varchar' })
  symbol: string;

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

  // https://orkhan.gitbook.io/typeorm/docs/many-to-one-one-to-many-relations
  @OneToMany(() => CollectionCategory, (category) => category.collection)
  categories: CollectionCategory[];

  // https://orkhan.gitbook.io/typeorm/docs/many-to-one-one-to-many-relations
  @OneToMany(() => Token, (token) => token.collection)
  tokens: Token[];
}
