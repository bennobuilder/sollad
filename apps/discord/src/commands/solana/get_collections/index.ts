import { ICommand } from 'wokcommands';
import { Constants, MessageEmbed } from 'discord.js';
import { magiceden } from '../../../core';
import { Pagination, PaginationType } from '@discordx/pagination';

export default {
  name: 'get_collections',

  category: 'solana',
  description: 'Get details of Magic Eden Launchpad Collections.',
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
    const limit = interaction.options.getNumber('limit') || 20;
    const offset = interaction.options.getNumber('offset') || 0;

    await interaction.deferReply();

    const cols = await magiceden.api.getCollections(offset, limit);
    if (cols == null) return;

    try {
      const pages = cols.map((col, i) => {
        return new MessageEmbed()
          .setFooter({
            text: `Collection ${i + 1} of ${
              offset == 0
                ? cols.length
                : `${offset - 1}-${offset + cols.length}`
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
