import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'token_creator' })
export class TokenCreator {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ name: 'address', type: 'varchar' })
  address: string;

  @Column({ name: 'share', type: 'integer' })
  share: number;
}
