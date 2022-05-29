import { Collection, CollectionCategory, getEntityRepository } from '../../db';
import { magicEden } from '../marketplaces';

export async function getCollectionBySymbol(
  symbol: string,
): Promise<Collection | null> {
  const collectionRepository = getEntityRepository(Collection);
  const collectionCategoryRepository = getEntityRepository(CollectionCategory);

  // Check if collection already exits in the database
  const collectionInDB = await collectionRepository.findOneBy({ symbol });
  if (collectionInDB != null) {
    return collectionInDB;
  }

  // Fetch Collection metadata and save it in the database
  const meCollectionMetadata = await magicEden.getCollection(symbol);
  if (meCollectionMetadata != null) {
    const categories = [];

    // Save Categories in database
    for (const categoryName of meCollectionMetadata.categories) {
      const category = collectionCategoryRepository.create({
        name: categoryName,
      });
      await collectionCategoryRepository.save(category);
      categories.push(category);
    }

    // Save Collection in database
    const newCollection = collectionRepository.create({
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
      categories: categories,
    });
    return await collectionRepository.save(newCollection);
  }

  return null;
}
