import { ICommand } from 'wokcommands';
import { Constants, MessageEmbed } from 'discord.js';
import { magiceden } from '../../../core';
import { Pagination, PaginationType } from '@discordx/pagination';

export default {
  name: 'getCollectionListings',

  category: 'solana',
  description: 'Get details of a Collection on Magic Eden marketplace.',
  options: [
    {
      name: 'symbol',
      description: 'Collection Symbol.',
      required: true,
      type: Constants.ApplicationCommandOptionTypes.STRING,
    },
    {
      name: 'limit',
      description: 'Limit.',
      required: false,
      type: Constants.ApplicationCommandOptionTypes.NUMBER,
    },
    {
      name: 'offset',
      description: 'Offset.',
      required: false,
      type: Constants.ApplicationCommandOptionTypes.NUMBER,
    },
  ],

  slash: true,
  testOnly: false,

  callback: async ({ message, interaction }) => {
    const limit = interaction.options.getNumber('limit') || 20;
    const offset = interaction.options.getNumber('offset') || 0;
    const symbol = interaction.options.getString('symbol') || '';

    // Show loading indicator
    await interaction.deferReply();

    // Fetch Collections
    const collectionListings = await magiceden.api.getCollectionListings(
      symbol,
      offset,
      limit,
    );
    if (collectionListings == null) return;

    try {
      // Build pages for pagination
      const pages = collectionListings.map((col, i) => {
        return new MessageEmbed()
          .setFooter({
            text: `Listing ${i + 1} of ${
              offset == 0
                ? collectionListings.length
                : `${offset - 1}-${offset + collectionListings.length}`
            }`,
          })
          .setTitle(`**Listings of ${symbol}**`)
          .addField('Mint Address', col.tokenMint)
          .addField('Seller', col.seller)
          .addField('Price', col.price.toString() + ' SOL')
          .setColor('#000000');
      });

      // Create pagination
      const pagination = new Pagination(interaction, pages, {
        type: limit > 10 ? PaginationType.SelectMenu : PaginationType.Button,
        showStartEnd: true,
        time: 5 * 60 * 1000,
      });
      await pagination.send();
    } catch (error) {
      console.log(error);
    }
  },
} as ICommand;
