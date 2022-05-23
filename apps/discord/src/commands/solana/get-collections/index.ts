import { ICommand } from 'wokcommands';
import { Constants, MessageEmbed } from 'discord.js';
import { magiceden } from '../../../core';
import { Pagination, PaginationType } from '@discordx/pagination';

export default {
  name: 'getCollections',

  category: 'solana',
  description: 'Get details of Magic Eden Collections.',
  options: [
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
    const limit = interaction.options.getNumber('limit') || 50;
    const offset = interaction.options.getNumber('offset') || 0;

    // Show loading indicator
    await interaction.deferReply();

    // Fetch Collections
    const collections = await magiceden.api.getCollections(true, offset, limit);
    if (collections == null) return;

    try {
      // Build pages for pagination
      const pages = collections.map((col, i) => {
        return new MessageEmbed()
          .setFooter({
            text: `Collection ${i + 1} of ${
              offset == 0
                ? collections.length
                : `${offset - 1}-${offset + collections.length}`
            }`,
          })
          .setTitle('**Collections**')
          .addField('Name', col.name)
          .addField('Symbol', col.symbol)
          .addField('Description', col.description.substring(0, 1000))
          .addField('Price', col.price.toString() + ' SOL')
          .addField('Total Supply', col.size.toString())
          .addField('Launch Date', col.launchDatetime || '-')
          .setImage(col.image);
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
