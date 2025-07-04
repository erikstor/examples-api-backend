const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  global.__MONGO_URI__ = mongod.getUri();
});

afterAll(async () => {
  if (mongod) {
    await mongod.stop();
  }
}); 