import { Column, Entity, getRepository, Repository } from 'typeorm';
import { isConnectedToDB } from '../../setup';

@Entity({ name: 'guilds' })
export class Guild {
  @Column({ name: 'discord_id', type: 'varchar', unique: true, primary: true })
  discordId: string;

  @Column({ name: 'name', type: 'varchar' })
  name: string;
}

// To avoid this issue: https://github.com/typeorm/typeorm/issues/5362
export function getGuildRepository(): Repository<Guild> | null {
  return isConnectedToDB ? getRepository(Guild) : null;
}
