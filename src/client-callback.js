const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const protoObject = protoLoader.loadSync(path.resolve(__dirname, '../proto/tvShows.proto'));
const TvShowsDefinition = grpc.loadPackageDefinition(protoObject);
const tvShowClient = new TvShowsDefinition.TvShowService('localhost:50051', grpc.credentials.createInsecure());

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
