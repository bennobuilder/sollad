import { ICommand } from 'wokcommands';
import { Constants } from 'discord.js';

// https://docs.wornoffkeys.com/commands/commands
export default {
  // The primary name of the command.
  // If omitted the name of the file will take it's place.
  name: 'sum',

  // The name and description of the category for the command.
  // Used in the built-in help menu. (Required for slash commands)
  category: 'Testing',
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

  slash: true, // Create only slash command
  testOnly: true, // Only register a slash command for the testing guilds

  callback: async ({ interaction }) => {
    const num1 = interaction.options.getNumber('num1')!;
    const num2 = interaction.options.getNumber('num2')!;

    // For async requests (as with a normal reply you can take max 3s)
    // Create loading reply
    // await interaction.deferReply({
    //   ephemeral: true,
    // });
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    // Edit loading reply to the actual reply
    // interaction.editReply({
    //   content: `The num is ${num1 + num2}`,
    // });

    interaction.reply({
      content: `The number is ${num1 + num2}`,
      ephemeral: true,
    });
  },
} as ICommand;
