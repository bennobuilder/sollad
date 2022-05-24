import { Worker } from '../../../core/worker';
import { magiceden } from '../../../core';
import {
  Client,
  MessageActionRow,
  MessageEmbed,
  TextChannel,
} from 'discord.js';
import { fetchNFTData } from '../../../core/solana/fetchNFTData';
import { newConnection } from '../../../core/solana/connection';
import { truncate } from '../../../core/utils/truncate';

export default class ListingWorker extends Worker {
  public symbol: string;
  public client: Client;

  constructor(symbol: string, client: Client) {
    super(`listing_${symbol}`);
    this.symbol = symbol;
    this.client = client;
  }

  public async run(): Promise<void> {
    // Fetch listings
    const collectionListings = await magiceden.api.getCollectionListings(
      this.symbol,
      0,
      20,
    );

    console.log('Run Listing Worker', {
      fetchedCount: collectionListings.length,
    });

    // Get channel to send the listings in
    const channel = (await this.client.channels.fetch(
      '978366113375195136', // TODO
    )) as TextChannel;

    for (const listing of collectionListings) {
      const conn = newConnection();
      const nftData = await fetchNFTData(conn, listing.tokenMint);

      const actionRowMessage = new MessageActionRow({
        type: 1,
        components: [
          {
            style: 5,
            label: `View`,
            url: `https://magiceden.io/item-details/${listing.tokenMint}`,
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
        .setAuthor(
          truncate(listing.seller),
          'https://matrica.io/profile.png',
          `https://matrica.io/wallet/${listing.seller}`,
        )
        .setFooter({
          text: `Listed on Magic Eden`,
          iconURL: 'https://www.magiceden.io/img/favicon.png',
        })
        .setTitle(`**Listings of ${nftData?.name} (${this.symbol})**`)
        .setURL(`https://magiceden.io/item-details/${listing.tokenMint}`)
        .addField('Price', listing.price.toString() + ' SOL', false)
        .addField('Mint Address', listing.tokenMint, false) // Get more info about the nft via "/tokens/:token_mint"
        .addField('Auction House Address', listing.auctionHouse, false)
        .setColor('#000000');

      if (nftData != null) {
        embedMessage.setImage(nftData.image);
      }

      console.log('Send');
      await channel.send({
        components: [actionRowMessage as any],
        embeds: [embedMessage],
      });
    }
  }
}
