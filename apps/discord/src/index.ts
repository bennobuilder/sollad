import { Client, Intents } from 'discord.js';
import WOKCommands from 'wokcommands';
import path from 'path';
import config from './config';
import * as fs from 'fs';
import { DcClientHandler } from './core/discord';

const eventsDir = path.join(__dirname, 'events');
const commandsDir = path.join(__dirname, 'commands');

// Create Discord Client
const dcClient = new Client({
  intents: [
    // https://discord.com/developers/docs/topics/gateway#list-of-intents
    // What accesses the bot needs
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

// TODO build custom command/event handler that isn't overloaded with MongoDB and stuff
// new DcClientHandler(dcClient, {});

// Register Events
fs.readdir(eventsDir, (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    const event = require(`${eventsDir}/${file}`).default;
    const eventName = file.split('.')[0];
    if (typeof event.callback === 'function')
      dcClient.on(eventName, event.callback.bind(null, dcClient));
  });
});

// Register Command Manager
dcClient.on('ready', () => {
  new WOKCommands(dcClient, {
    // The name of the local folder for your command files
    commandsDir,
    // Allow importing of .ts files if you are using ts-node
    typeScript: true,
    // What guilds your slash commands will be created in
    testServers: [config.discord.test.guildId],
  });
});

dcClient.login(config.discord.token);
