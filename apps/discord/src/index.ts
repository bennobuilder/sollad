import {
  ApplicationCommandManager,
  Client,
  Constants,
  GuildApplicationCommandManager,
  Intents,
} from 'discord.js';
import config from './config';

const dcClient = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

dcClient.on('ready', () => {
  console.log('The bot is ready');

  const guild = dcClient.guilds.cache.get(config.discord.test.guildId);
  let commands:
    | ApplicationCommandManager
    | GuildApplicationCommandManager
    | null;

  if (guild != null) {
    commands = guild.commands;
  } else {
    commands = dcClient.application?.commands || null;
  }

  commands?.create({
    name: 'ping',
    description: 'Replies with pong.',
  });

  commands?.create({
    name: 'add',
    description: 'Adds two numbers.',
    options: [
      {
        name: 'num1',
        description: 'The first number.',
        required: true,
        type: Constants.ApplicationCommandOptionTypes.NUMBER,
      },
      {
        name: 'num2',
        description: 'The second number.',
        required: true,
        type: Constants.ApplicationCommandOptionTypes.NUMBER,
      },
    ],
  });
});

// Listen on messages
// dcClient.on('messageCreate', (message) => {
//   if (message.content === 'ping') {
//     message.reply({
//       content: 'pong',
//     });
//   }
// });

dcClient.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'ping') {
    interaction.reply({
      content: 'pong',
      ephemeral: true, // Only the user that ran the command can see the reply
    });
    return;
  }

  if (commandName === 'add') {
    const num1 = options.getNumber('num1')!;
    const num2 = options.getNumber('num2')!;

    // For async requests
    // await interaction.deferReply({
    //   ephemeral: true,
    // });
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    // interaction.editReply({
    //   content: `The num is ${num1 + num2}`,
    // });

    interaction.reply({
      content: `The num is ${num1 + num2}`,
      ephemeral: true,
    });
  }
});

dcClient.login(config.discord.token);
