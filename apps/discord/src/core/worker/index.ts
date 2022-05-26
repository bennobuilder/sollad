import Worker from './Worker';
import WorkerThread from './WorkerThread';
import ListingWorker from '../../commands/solana/snipe/ListingWorker';
import { dcClient } from '../../index';

const listingWorkerThread = new WorkerThread(
  [
    new ListingWorker('sea_shanties', dcClient), // TODO REMOVE
  ],
  { interval: 5000 },
);
// trippin_ape_tribe

export { Worker, WorkerThread, listingWorkerThread };
