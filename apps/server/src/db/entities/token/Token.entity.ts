import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Collection } from './Collection.entity';
import { JoinColumn, JoinTable } from 'typeorm/browser';
import { TokenAttribute } from './TokenAttribute.entity';
import { TokenCreator } from './TokenCreator.entity';

@Entity({ name: 'tokens' })
export class Token {
  @Column({ name: 'token_mint', type: 'varchar', unique: true, primary: true })
  tokenMint: number;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'symbol', type: 'varchar' })
  symbol: string;

  @Column({ name: 'seller_fee_basis_points', type: 'integer', nullable: true })
  sellerFeeBasisPoints?: number;

  @Column({ name: 'image_url', type: 'varchar' })
  imageUrl: string;

  @Column({ name: 'category', type: 'varchar' })
  category: string;

  // https://orkhan.gitbook.io/typeorm/docs/many-to-one-one-to-many-relations
  @ManyToOne(() => Collection, (collection) => collection.tokens)
  @JoinColumn()
  collection: Collection;

  // https://orkhan.gitbook.io/typeorm/docs/many-to-one-one-to-many-relations
  @OneToMany(() => TokenAttribute, (attribute) => attribute.token)
  attributes: TokenAttribute[];

  // https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations
  @ManyToMany(() => TokenCreator)
  @JoinTable()
  creators: TokenCreator[];
}
