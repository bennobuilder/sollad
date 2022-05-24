import Worker from './Worker';
import WorkerThread from './WorkerThread';
import ListingWorker from '../../commands/solana/snipe/ListingWorker';
import { dcClient } from '../../index';

const listingWorkerThread = new WorkerThread(
  [
    new ListingWorker('metaworms', dcClient), // TODO REMOVE
  ],
  { interval: 5000 },
);

export { Worker, WorkerThread, listingWorkerThread };
