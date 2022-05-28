import { EntityTarget } from 'typeorm/common/EntityTarget';
import { getConnection, Repository } from 'typeorm';
import { isConnectedToDB } from './setup';
import { Collection } from './entities/token';

export * from './setup';

// Entities
export * from './entities/discord';
export * from './entities/token';
export * from './entities/user';

// To avoid this issue: https://github.com/typeorm/typeorm/issues/5362
const { getEntityRepository } = (() => {
  const repositories = new Map<EntityTarget<any>, Repository<any>>();

  function getEntityRepository<Entity>(
    entityClass: EntityTarget<Entity>,
  ): Repository<Entity> {
    if (isConnectedToDB) {
      let repository = repositories.get(entityClass);
      if (repository == null) {
        repository = getConnection().getRepository(entityClass);
        repositories.set(entityClass, repository);
      }
      return repository;
    }

    throw new Error(
      `Can't retrieve Repository before connecting to the Database!`,
    );
  }

  return { getEntityRepository };
})();

export { getEntityRepository };
