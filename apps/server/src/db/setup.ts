import { Connection, createConnection, getConnection } from 'typeorm';
import config from '../config';

const orm = config.orm;

export const { connectDB, isConnectedToDB } = (() => {
  let isConnectedToDB = false;

  async function connectDB() {
    let connection: Connection | undefined;

    try {
      connection = getConnection();
    } catch (err) {
      // do nothing
    }

    try {
      if (connection != null) {
        if (!connection.isConnected) {
          await connection.connect();
        }
      } else {
        await createConnection({
          type: orm.type as any,
          host: orm.host,
          port: orm.port,
          username: orm.username,
          password: orm.password,
          database: orm.database,
          synchronize: orm.synchronize,
          entities: orm.entities,
          migrations: orm.migrations,
        });
      }
      isConnectedToDB = true;

      console.log(`Successfully connected to the database: '${orm.database}'.`);
    } catch (err) {
      console.error(
        `Error while connection to the database: '${orm.database}'!`,
      );
      throw err;
    }
  }

  return { connectDB, isConnectedToDB: () => isConnectedToDB };
})();
