import { Collection, getEntityRepository } from '../../db';

export async function getCollectionBySymbol(
  symbol: string,
): Promise<Collection> {
  const repository = getEntityRepository(Collection);

  // Check if collection already exits in the database
  const collectionInDB = await repository.findOneBy({ symbol });

  // Try to fetch Collection metadata
  if (collectionInDB == null) {
  }

  return null as any;
}
