import { Client } from 'discord.js';
import Command from './Command';
import { getFilePaths } from './utlis/getFilePaths';

export default class DcClientHandler {
  private client: Client;

  private commandsDir = 'commands';
  private eventsDir = 'events';

  private suffix = ['.ts', '.js'];
  private prefix = '!';

  private commands: { [key: string]: Command } = {};

  // TODO
  constructor(client: Client) {
    this.client = client;

    const commandFilePath = getFilePaths(this.commandsDir, this.suffix);

    for (const path of commandFilePath) {
      const commandFile = require(path);
      if (commandFile.default instanceof Command) {
        // Get Suffix
        const split = path.replace(/\\/g, '/').split('/');
        const commandName = split[split.length - 1].split('.')[0];
        this.commands[commandName.toLowerCase()] = commandFile.default;
      }
    }

    client.on('messageCreate', (message) => {
      if (message.author.bot || !message.content.startsWith(this.prefix)) {
        return;
      }

      const args = message.content.slice(this.prefix.length).split(/ +/);
      const commandName = args.shift()!.toLowerCase();
      const command = this.commands[commandName];

      if (command == null) {
        return;
      }

      try {
        // command.callback(message, ...args)
      } catch (e) {
        console.error(e);
      }
    });
  }
}
