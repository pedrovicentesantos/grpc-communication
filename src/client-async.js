const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const protoObject = protoLoader.loadSync(path.resolve(__dirname, '../proto/tvShows.proto'));
const TvShowsDefinition = grpc.loadPackageDefinition(protoObject);
const tvShowClient = new TvShowsDefinition.TvShowService('localhost:50051', grpc.credentials.createInsecure());

function callAsync(method) {
  return (params) => (
    new Promise((resolve, reject) => {
      tvShowClient[method](params, (err, response) => {
        if (err) return reject(err);
        return resolve(response);
      });
    })
  );
}

(async () => {
  console.log('---------------------------------------------------------------------------------');
  console.log('CREATING TV SHOWS');
  console.log('---------------------------------------------------------------------------------');
  await callAsync('create')({ name: 'Santa Clarita Diet', description: 'Zumbis', rating: 9.5 });
  await callAsync('create')({ name: 'Euphoria', description: 'Drama', rating: 9.5 });
  console.log(await callAsync('list')({}));
})();
