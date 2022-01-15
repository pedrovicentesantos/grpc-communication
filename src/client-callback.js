const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const tvShowProtoObject = protoLoader.loadSync(path.resolve(__dirname, '../proto/tvShows.proto'));
const TvShowsDefinition = grpc.loadPackageDefinition(tvShowProtoObject);
const tvShowClient = new TvShowsDefinition.TvShowService('localhost:50051', grpc.credentials.createInsecure());

const categoryProtoObject = protoLoader.loadSync(path.resolve(__dirname, '../proto/categories.proto'));
const CategoriesDefinition = grpc.loadPackageDefinition(categoryProtoObject);
const categoryClient = new CategoriesDefinition.CategoryService('localhost:50051', grpc.credentials.createInsecure());

// eslint-disable-next-line consistent-return
function handle(err, data) {
  if (err) return console.error(err.message);
  console.log(data);
}

function skip() {
  return null;
}

console.log('---------------------------------------------------------------------------------');
console.log('CREATING TV SHOWS');
console.log('---------------------------------------------------------------------------------');
tvShowClient.create({ name: 'Santa Clarita Diet', description: 'Zumbis', rating: 9.5 }, skip);
tvShowClient.create({ name: 'Euphoria', description: 'Drama', rating: 9.5 }, skip);
tvShowClient.list({}, handle);

console.log('---------------------------------------------------------------------------------');
console.log('CREATING CATEGORIES');
console.log('---------------------------------------------------------------------------------');
categoryClient.create({ name: 'Comedy' }, skip);
categoryClient.create({ name: 'Drama', favorite: false }, skip);
categoryClient.list({}, handle);
