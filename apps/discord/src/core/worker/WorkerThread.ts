import Worker from './Worker';
import { sleep } from '../utils/sleep';

export default class WorkerThread {
  private readonly config: Required<WorkerHandlerConfig>;

  private workers: Map<string, Worker> = new Map();
  private interval: NodeJS.Timer | null = null;

  constructor(workers: Worker[], config: WorkerHandlerConfig = {}) {
    this.config = {
      delayInMs: () => Math.random() * 2000,
      interval: 1000 * 5, // 30s
      ...config,
    };

    console.log('Workers', this.workers);

    // Add workers to map
    for (const worker of workers) {
      this.workers.set(worker.key, worker);
    }
  }

  /**
   * Starts the WorkerThread.
   */
  public start() {
    // Initial run ("const _" to await it without making the method async)
    const _ = this.runWorkers(this.workers);

    // Start interval
    this.interval = setInterval(
      () => this.runWorkers(this.workers),
      this.config.interval,
    );
  }

  /**
   * Stops the WorkerThread.
   */
  public stop() {
    if (this.interval != null) clearInterval(this.interval);
  }

  /**
   * Checks whether the WorkerThread is up and running.
   */
  public isRunning(): boolean {
    return this.interval != null;
  }

  public add(worker: Worker) {
    this.workers.set(worker.key, worker);
  }

  private async runWorkers(workers: Map<string, Worker>): Promise<void[]> {
    const workersArray =
      Array.from(workers, ([name, value]) => ({
        name,
        value,
      })) || [];
    const promises = workersArray.map(async ({ value: worker }) => {
      const { delayInMs } = this.config;

      // Await delay
      if (typeof delayInMs === 'function') {
        await sleep(delayInMs());
      }

      // Run worker
      try {
        return await worker.run();
      } catch (e) {
        console.warn(e);
      }
    });

    return Promise.all(promises);
  }
}

type WorkerHandlerConfig = {
  /**
   * Delay between the single workers to avoid running them all at once.
   * @default () => Math.random() * 2000
   */
  delayInMs?: () => number;
  /**
   * Interval between running the worker thread. (ms)
   * @default 2000
   */
  interval?: number;
};
