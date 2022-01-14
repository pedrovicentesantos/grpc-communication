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
  promisify(tvShowClient, 'list', {}).then(console.log);
})();
