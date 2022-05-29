import Worker from './Worker';
import WorkerThread from './WorkerThread';
import ListingWorker from '../../commands/solana/snipe/ListingWorker';
import { dcClient } from '../../index';

const listingWorkerThread = new WorkerThread(
  [
    new ListingWorker('smart_sea_society', dcClient), // TODO REMOVE
  ],
  { interval: 5000 },
);
// trippin_ape_tribe

export { Worker, WorkerThread, listingWorkerThread };
