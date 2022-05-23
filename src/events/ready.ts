import { Client } from 'discord.js';

export default {
  callback: (client: Client) => {
    console.log('Discord Bot is ready');
    client.user?.setActivity('Jeff', { type: 'WATCHING' });
  },
};
