import { Client, Intents } from 'discord.js';
import config from './config';

const dcClient = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

dcClient.on('ready', () => {
  console.log('The bot is ready');
});

dcClient.on('messageCreate', (message) => {
  if (message.content === 'ping') {
    message.reply({
      content: 'pong',
    });
  }
});

dcClient.login(config.discord.token);
