const grpc = require('grpc');
const path = require('path');

const TvShowsDefinition = grpc.load(path.resolve(__dirname, '../proto/tvShows.proto'));
const tvShowClient = new TvShowsDefinition.TvShowService('localhost:50051', grpc.credentials.createInsecure());

function promisify(method) {
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
  const SantaClaritaDiet = await promisify('create')({ name: 'Santa Clarita Diet', description: 'Zumbis', rating: 9.5 });
  const Euphoria = await promisify('create')({ name: 'Euphoria', description: 'Drama', rating: 9.5 });
  console.log(await promisify('list')({}));
})();
