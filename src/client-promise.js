const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const protoObject = protoLoader.loadSync(path.resolve(__dirname, '../proto/tvShows.proto'));
const TvShowsDefinition = grpc.loadPackageDefinition(protoObject);
const tvShowClient = new TvShowsDefinition.TvShowService('localhost:50051', grpc.credentials.createInsecure());

function promisify(client, method, parameters) {
  return new Promise((resolve, reject) => {
    client[method](parameters, (err, response) => {
      if (err) reject(err);
      resolve(response);
    });
  });
}

(async () => {
  console.log('---------------------------------------------------------------------------------');
  console.log('CREATING TV SHOWS');
  console.log('---------------------------------------------------------------------------------');
  promisify(
    tvShowClient,
    'create',
    {
      name: 'Santa Clarita Diet',
      description: 'Zumbis',
      rating: 9.5,
    },
  );
  promisify(
    tvShowClient,
    'create',
    {
      name: 'Euphoria',
      description: 'Drama',
      rating: 9.5,
    },
  );
  promisify(tvShowClient, 'list', {}).then(console.log);
})();