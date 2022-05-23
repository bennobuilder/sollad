import { ICommand } from 'wokcommands';
import ListingWorker from './ListingWorker';
import { Constants } from 'discord.js';
import { listingWorkerThread } from '../../../core/worker';

// https://docs.wornoffkeys.com/commands/commands
export default {
  name: 'snipe',
  category: 'sol.snipe',
  description: 'Snipes latest listed Items of Collection.',
  options: [
    {
      name: 'symbol',
      description: 'Collection Symbol.',
      required: true,
      type: Constants.ApplicationCommandOptionTypes.STRING,
    },
  ],

  slash: 'both',
  testOnly: false,

  callback: async ({ message, interaction, client }) => {
    const symbol = interaction.options.getString('symbol') || '';

    const listingWorker = new ListingWorker(symbol, client);
    listingWorkerThread.add(listingWorker);

    interaction.reply({
      content: `Watching for listed ${symbol}`,
    });
  },
} as ICommand;
