import Worker from './Worker';
import WorkerThread from './WorkerThread';
import ListingWorker from '../../commands/solana/snipe/ListingWorker';
import { dcClient } from '../../index';

const listingWorkerThread = new WorkerThread([
  new ListingWorker('dronies', dcClient), // TODO REMOVE
]);

export { Worker, WorkerThread, listingWorkerThread };
