import { Client } from 'discord.js';
import { listingWorkerThread } from '../core/worker';

export default {
  callback: (client: Client) => {
    // Set Activity
    client.user?.setActivity('Jeff', { type: 'WATCHING' });

    // Start workers
    listingWorkerThread.start();
  },
};
