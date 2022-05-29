import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Collection } from './Collection.entity';

@Entity({ name: 'collection_categories' })
export class CollectionCategory {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  // https://orkhan.gitbook.io/typeorm/docs/many-to-one-one-to-many-relations
  @ManyToOne(() => Collection, (collection) => collection.categories)
  collection: Collection;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  description?: string;
}
