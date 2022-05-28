export default abstract class Marketplace {
  abstract readonly name: string;
  abstract readonly programIds: string[];

  abstract readonly iconUrl: string;
  abstract readonly baseUrl: string;
  abstract readonly itemUrl: string;
}
