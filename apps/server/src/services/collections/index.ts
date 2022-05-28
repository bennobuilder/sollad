import { Collection, getEntityRepository } from '../../db';
import { magicEden } from '../marketplaces';

export async function getCollectionBySymbol(
  symbol: string,
): Promise<Collection> {
  const repository = getEntityRepository(Collection);

  // Check if collection already exits in the database
  const collectionInDB = await repository.findOneBy({ symbol });

  // Try to fetch Collection metadata
  if (collectionInDB == null) {
    const meCollectionMetadata = await magicEden.getCollection(symbol);
    if (meCollectionMetadata != null) {
      const newCollection = repository.create({
        name: meCollectionMetadata.name,
        symbol,
        description: meCollectionMetadata.description,
        imageUrl: meCollectionMetadata.image,
        createdAt: new Date(meCollectionMetadata.createdAt),
        isDerived: meCollectionMetadata.isDerivative,
        discordUrl: meCollectionMetadata.discord,
        twitterUrl: meCollectionMetadata.twitter,
        websiteUrl: meCollectionMetadata.website,
        totalItems: meCollectionMetadata.totalItems,
        // categories: meCollectionMetadata.categories.map(), // TODO add later has here the collectionId isn't set
      });
      console.log('Collection', { id: newCollection.id }); // TODO
      return repository.save(newCollection);
    }
  } else {
    return collectionInDB;
  }

  return null as any;
}
