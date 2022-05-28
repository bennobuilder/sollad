import { Column, Entity } from 'typeorm';

@Entity({ name: 'watch_collection_listings' })
export class WatchCollectionListings {
  @Column({
    name: 'collection_id',
    type: 'integer',
    unique: true,
    primary: true,
  })
  collectionId: number;

  @Column({ name: 'guild_id', type: 'integer', unique: true, primary: true })
  guildId: number;

  @Column({ name: 'channel_id', type: 'varchar', unique: true })
  channelId: string;

  @Column({ name: 'name', type: 'varchar' })
  name: string;
}
