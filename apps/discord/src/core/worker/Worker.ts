export default abstract class Worker {
  public readonly key: string;
  public isRunning = false;

  constructor(key: string) {
    this.key = key;
  }

  abstract run(): Promise<void>;
}
