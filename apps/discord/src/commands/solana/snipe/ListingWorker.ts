import { listingWorkerThread, Worker } from '../../../core/worker';
import { magiceden } from '../../../core';
import {
  ButtonInteraction,
  Client,
  MessageActionRow,
  MessageEmbed,
  TextChannel,
} from 'discord.js';
import { truncate } from '../../../core/utils/truncate';
import * as crypto from 'crypto';
import { CollectionListItem } from '../../../core/magiceden/magiceden.types';
import { buyNFT } from '../../../core/solana/buyNFT';

export default class ListingWorker extends Worker {
  private readonly symbol: string;
  private readonly client: Client;
  private channels = ['978366113375195136'];

  static BUY_BTN_ID = 'buy_listing';

  // Track messages to interact on btn clicks
  private messageLimit = 50;
  private messages: {
    [key: string]: { listing: CollectionListItem };
  } = {};
  private messageIds: string[] = [];

  // Track listings sent in channel to avoid sending the same listing twice
  // as currently the logic is based on pulling
  private listingLimit = 50;
  private notifiedListings: string[] = [];

  constructor(symbol: string, client: Client) {
    super(`listing_${symbol}`);
    this.symbol = symbol;
    this.client = client;
  }

  public async run(): Promise<void> {
    this.isRunning = true;

    // Fetch listings
    const collectionListings = await magiceden.api.getCollectionListings(
      this.symbol,
      0,
      20,
    );

    for (const channelId of this.channels) {
      // Get channel to send the listings in
      const channel = (await this.client.channels.fetch(
        channelId,
      )) as TextChannel;

      // Start listening on channel events
      this.listenOnChannelComponentEvents(channel);

      for (const listing of collectionListings) {
        const listingHash = crypto
          .createHash('md5')
          .update(
            JSON.stringify({
              channelId,
              nft: `${listing.tokenMint}_${listing.price}`,
            }),
          )
          .digest('hex');

        // Check whether listing was already notified in the channel
        if (this.notifiedListings.includes(listingHash)) continue;

        // Build interaction buttons
        const actionRowMessage = new MessageActionRow({
          type: 1,
          components: [
            {
              custom_id: ListingWorker.BUY_BTN_ID,
              style: 'SECONDARY',
              label: `Buy`,
              disabled: false,
              type: 2,
            },
            {
              style: 'LINK',
              label: `View`,
              url: `https://magiceden.io/item-details/${listing.tokenMint}`,
              disabled: false,
              type: 2,
            },
          ],
        });

        // Build message
        const embedMessage = new MessageEmbed({
          color: '#000000',
          author: {
            name: truncate(listing.seller),
            iconURL: 'https://matrica.io/profile.png',
            url: `https://matrica.io/wallet/${listing.seller}`,
          },
          footer: {
            text: `Listed on Magic Eden`,
            iconURL: 'https://www.magiceden.io/img/favicon.png',
          },
          title: `**Listings of ${listing.nftData?.name} (${this.symbol})**`,
          url: `https://magiceden.io/item-details/${listing.tokenMint}`,
          fields: [
            {
              name: 'Price',
              value: listing.price.toString() + ' SOL',
              inline: false,
            },
            {
              name: 'Mint Address',
              value: listing.tokenMint || 'unknown',
              inline: false,
            },
            {
              name: 'Auction House Address',
              value: listing.auctionHouse || 'unknown',
              inline: false,
            },
          ],
        });

        // Set nft image
        if (listing.nftData != null) {
          embedMessage.setImage(listing.nftData.image);
        }

        // Send and track listing and listing message
        const message = await channel.send({
          components: [actionRowMessage as any],
          embeds: [embedMessage],
        });
        this.trackMessage(message.id, listing);
        this.trackListingInChannel(listingHash);
      }
    }

    this.isRunning = false;
  }

  private trackMessage(messageId: string, listing: CollectionListItem) {
    // Add newly tracked message
    this.messages[messageId] = { listing };
    this.messageIds.push(messageId);

    // Remove the oldest message, so the messages won't stack up endless
    if (this.messageIds.length > this.messageLimit) {
      const toRemoveMessageId = this.messageIds.pop();
      delete this.messages[toRemoveMessageId!];
    }
  }

  private untrackMessage(messageId: string) {
    const messageIdIndex = this.messageIds.indexOf(messageId);
    if (messageIdIndex > -1) this.messageIds.splice(messageIdIndex, 1);
    delete this.messages[messageId];
  }

  private trackListingInChannel(listingHash: string) {
    this.notifiedListings.push(listingHash);

    if (this.notifiedListings.length > this.listingLimit) {
      this.notifiedListings.pop();
    }
  }

  private listenOnChannelComponentEvents(channel: TextChannel) {
    // Listen to button presses in the channel
    const collector = channel.createMessageComponentCollector({
      // Listen until the next run event hits (to avoid multiple collector listener)
      time: listingWorkerThread.config.interval,
    });

    collector.on('collect', async (btnInt: ButtonInteraction) => {
      console.log('COLLECT ', btnInt.customId); // TODO REMOVE
      if (btnInt.customId === ListingWorker.BUY_BTN_ID) {
        const messageId = btnInt.message.id;
        const data = this.messages[messageId];

        if (data != null) {
          this.untrackMessage(messageId);

          await buyNFT({
            auctionHouseAddress: data.listing.auctionHouse,
            tokenMint: data.listing.tokenMint,
            tokenATA: data.listing.tokenAddress,
            price: data.listing.price,
            seller: data.listing.seller,
          });

          btnInt.reply({
            content: `${btnInt.user} just bought ${data.listing.nftData?.name}`,
          });
        }
      }
    });
  }
}
