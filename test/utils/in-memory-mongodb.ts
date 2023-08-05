import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: MongoMemoryServer;

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongo = await MongoMemoryServer.create({ binary: { version: '6.0.8' } });
      return {
        uri: mongo.getUri(),
        autoCreate: true,
        autoIndex: true,
        dbName: 'testing_db',
        ...options,
      };
    },
  });

export const closeMongoConnection = async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
  if (mongo) {
    await mongo.stop();
  }
};
