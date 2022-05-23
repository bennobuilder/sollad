export default abstract class Worker {
  public readonly key: string;

  constructor(key: string) {
    this.key = key;
  }

  abstract run(): Promise<void>;
}
