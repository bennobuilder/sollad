import { Worker } from '../../../core/worker';
import { magiceden } from '../../../core';
import {
  ButtonInteraction,
  CacheType,
  Client,
  InteractionCollector,
  MessageActionRow,
  MessageComponentInteraction,
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

  // Track collectors to renew them if their 'lifeTime' ends
  private collectors: {
    [key: string]: {
      collector: InteractionCollector<MessageComponentInteraction<CacheType>>;
      ends: number; // Timestamp when the collector won't listen anymore
    };
  } = {};

  constructor(symbol: string, client: Client) {
    super(`listing_${symbol}`);
    this.symbol = symbol;
    this.client = client;
  }

  public async run(): Promise<void> {
    try {
      this.isRunning = true;

      // Fetch listings
      let collectionListings = await magiceden.api.getCollectionListings(
        this.symbol,
        0,
        20,
      );

      // Reverse as the first item is the latest listed but should be printed at last
      collectionListings = collectionListings.reverse();

      for (const channelId of this.channels) {
        // Get channel to send the listings in
        const channel = (await this.client.channels.fetch(
          channelId,
        )) as TextChannel;

        // Start listening on channel events
        this.listenOnButtonInteractions(channel);

        for (const listing of collectionListings) {
          const tier = listing.extra.nftData?.attributes.find(
            (trait) => trait.traitType === 'Tier',
          );
          console.log('Listing', {
            tier: tier?.value,
            price: listing.price,
            buy: listing.price <= 10,
          });

          // Only list nfts with sniper trait
          if (tier?.value !== 'Platform Access + Snipe Tool') {
            continue;
          }

          // Buy instantly if its in the wished priceRange
          if (listing.price <= 10) {
            await buyNFT({
              auctionHouseAddress: listing.auctionHouse,
              tokenMint: listing.tokenMint,
              tokenATA: listing.tokenAddress,
              price: listing.price,
              seller: listing.seller,
              sellerReferral: listing.sellerReferral,
            });

            channel.send({
              content: `BennoDev#9351 just bought ${listing.extra.nftData?.name} for ${listing.price}`,
            });
          }

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
            title: `${listing.extra.nftData?.name}`,
            url: `https://magiceden.io/item-details/${listing.tokenMint}`,
            description: listing.extra.nftData?.description || '',
            fields: [
              {
                name: 'Collection',
                value: listing.extra.nftData?.collection.name || '',
                inline: true,
              },
              {
                name: 'Symbol',
                value: listing.extra.nftData?.symbol || '',
                inline: true,
              },
              { name: '\u200B', value: '\u200B' },
              {
                name: 'Price',
                value: listing.price.toString() + ' SOL',
                inline: true,
              },
              {
                name: 'Mint Address',
                value: `[${truncate(
                  listing.tokenMint,
                )}](${`https://solscan.io/token/${listing.tokenMint}`})`,
                inline: true,
              },
              {
                name: 'Rarity',
                value: `[${
                  listing.rarity.howrare?.rank || 'unknown'
                }](${`https://howrare.is/${listing.tokenMint}`})`,
                inline: true,
              },
            ],
            timestamp: Date.now(), // TODO update to real listing date based on transaction made (see tokenMint)
          });

          // Set nft image
          if (listing.extra.nftData != null) {
            embedMessage.setImage(listing.extra.nftData.image);
          }

          // Send and track listing and listing message
          console.log(`Send Message: ${listing.extra.nftData?.name}`, {
            attributes: listing.extra.nftData?.attributes,
          }); // TODO REMOVE
          const message = await channel.send({
            components: [actionRowMessage as any],
            embeds: [embedMessage],
          });
          await channel.send('@everyone');
          this.trackMessage(message.id, listing);
          this.trackListingInChannel(listingHash);
        }
      }

      this.isRunning = false;
    } catch (e) {
      console.error(e);
    }
  }

  private trackMessage(messageId: string, listing: CollectionListItem) {
    // Add newly tracked message
    this.messages[messageId] = { listing };
    this.messageIds.push(messageId);

    // Remove the oldest message, so the messages won't stack up endless
    if (this.messageIds.length > this.messageLimit) {
      const toRemoveMessageId = this.messageIds.shift();
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
      this.notifiedListings.shift();
    }
  }

  private listenOnButtonInteractions(channel: TextChannel) {
    const trackedCollector = this.collectors[channel.id];

    // Create new collector and listen to button events if the old collector got destroyed
    if (trackedCollector == null || Date.now() > trackedCollector.ends) {
      const timeToLife = 1000 * 60 * 5;
      const collector = channel.createMessageComponentCollector({
        time: timeToLife, // 5min
      });

      collector.on('collect', (btnInt: ButtonInteraction) =>
        this.onButtonInteraction(btnInt),
      );

      this.collectors[channel.id] = {
        collector,
        ends: Date.now() + timeToLife,
      };
    }
  }

  private async onButtonInteraction(btnInt: ButtonInteraction): Promise<void> {
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
          sellerReferral: data.listing.sellerReferral,
        });

        btnInt.reply({
          content: `${btnInt.user} just bought ${data.listing.extra.nftData?.name}`,
        });
      }
    }
  }
}
