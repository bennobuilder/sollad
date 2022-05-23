import { Worker } from '../../../core/worker';
import { magiceden } from '../../../core';
import {
  Client,
  MessageActionRow,
  MessageEmbed,
  TextChannel,
} from 'discord.js';

export default class ListingWorker extends Worker {
  public symbol: string;
  public client: Client;

  constructor(symbol: string, client: Client) {
    super(`listing_${symbol}`);
    this.symbol = symbol;
    this.client = client;
  }

  public async run(): Promise<void> {
    console.log('Run');
    const collectionListings = await magiceden.api.getCollectionList(
      this.symbol,
      0,
      20,
    );

    const channel = (await this.client.channels.fetch(
      '978366113375195136', // TODO
    )) as TextChannel;

    for (const listing of collectionListings) {
      const actionRowMessage = new MessageActionRow({
        type: 1,
        components: [
          {
            style: 5,
            label: `View`,
            url: `https://solscan.io/tx/`,
            disabled: false,
            type: 2,
          },
          {
            style: 5,
            label: `Buy`,
            url: `https://solscan.io/token/`,
            disabled: false,
            type: 2,
          },
        ],
      });

      const embedMessage = new MessageEmbed()
        .setFooter({
          text: `https://magiceden.io/item-details/${listing.tokenMint}`,
        })
        .setTitle(`**Listings of ${this.symbol}**`)
        .addField('Mint Address', listing.tokenMint) // Get more info about the nft via "/tokens/:token_mint"
        .addField('Auction House Address', listing.auctionHouse)
        .addField('Seller', listing.seller)
        .addField('Price', listing.price.toString() + ' SOL')
        .setColor('#000000');

      await channel.send({
        components: [actionRowMessage as any],
        embeds: [embedMessage],
      });
    }
  }
}
