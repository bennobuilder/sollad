import {
  Column,
  Entity,
  getRepository,
  ManyToMany,
  OneToMany,
  OneToOne,
  Repository,
} from 'typeorm';
import { isConnectedToDB } from '../../setup';
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

  // https://orkhan.gitbook.io/typeorm/docs/one-to-one-relations
  @OneToOne(() => Collection)
  @JoinColumn()
  collection: Collection;

  @OneToMany(() => TokenAttribute, (attribute) => attribute.tokenMint)
  attributes: TokenAttribute[];

  // https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations
  @ManyToMany(() => TokenCreator)
  @JoinTable()
  creators: TokenCreator[];
}
