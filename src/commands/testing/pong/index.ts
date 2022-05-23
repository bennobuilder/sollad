import { ICommand } from 'wokcommands';

// https://docs.wornoffkeys.com/commands/commands
export default {
  // The primary name of the command.
  // If omitted the name of the file will take it's place.
  name: 'ping',

  // The name and description of the category for the command.
  // Used in the built-in help menu. (Required for slash commands)
  category: 'Testing',
  description: 'Replies with pong.', // Required for slash commands

  slash: 'both', // Create both a slash and legacy command
  testOnly: true, // Only register a slash command for the testing guilds

  callback: async ({ message, interaction }) => {
    const reply = 'Pong!';

    // Message is provided for a legacy command (!ping, ?ping)
    if (message != null) {
      await message.reply({
        content: reply,
      });
      return;
    }

    // Interaction is provided for slash commands (/ping)
    await interaction.reply({
      content: reply,
    });
  },
} as ICommand;
