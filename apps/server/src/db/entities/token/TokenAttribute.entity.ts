import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Token } from './Token.entity';

@Entity({ name: 'token_attributes' })
export class TokenAttribute {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  // https://orkhan.gitbook.io/typeorm/docs/many-to-one-one-to-many-relations
  @ManyToOne(() => Token, (token) => token.attributes)
  token: Token;

  @Column({ name: 'trait_type', type: 'varchar' })
  traitType: string;

  @Column({ name: 'value', type: 'varchar' })
  value: string;
}
