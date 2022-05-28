import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'token_attributes' })
export class TokenAttribute {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ name: 'token_mint', type: 'integer' })
  tokenMint: number;

  @Column({ name: 'trait_type', type: 'varchar' })
  traitType: string;

  @Column({ name: 'value', type: 'varchar' })
  value: string;
}
