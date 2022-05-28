import { Column, Entity } from 'typeorm';

@Entity({ name: 'guilds' })
export class Guild {
  @Column({ name: 'discord_id', type: 'varchar', unique: true, primary: true })
  discordId: string;

  @Column({ name: 'name', type: 'varchar' })
  name: string;
}
