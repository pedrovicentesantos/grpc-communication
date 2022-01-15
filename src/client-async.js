const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const tvShowProtoObject = protoLoader.loadSync(path.resolve(__dirname, '../proto/tvShows.proto'));
const TvShowsDefinition = grpc.loadPackageDefinition(tvShowProtoObject);
const tvShowClient = new TvShowsDefinition.TvShowService('localhost:50051', grpc.credentials.createInsecure());

const categoryProtoObject = protoLoader.loadSync(path.resolve(__dirname, '../proto/categories.proto'));
const CategoriesDefinition = grpc.loadPackageDefinition(categoryProtoObject);
const categoryClient = new CategoriesDefinition.CategoryService('localhost:50051', grpc.credentials.createInsecure());

function callAsync(client, method) {
  return (params) => (
    new Promise((resolve, reject) => {
      client[method](params, (err, response) => {
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
  await callAsync(tvShowClient, 'create')({ name: 'Santa Clarita Diet', description: 'Zumbis', rating: 9.5 });
  await callAsync(tvShowClient, 'create')({ name: 'Euphoria', description: 'Drama', rating: 9.5 });
  console.log(await callAsync(tvShowClient, 'list')({}));

  console.log('---------------------------------------------------------------------------------');
  console.log('CREATING CATEGORIES');
  console.log('---------------------------------------------------------------------------------');
  await callAsync(categoryClient, 'create')({ name: 'Comedy' });
  await callAsync(categoryClient, 'create')({ name: 'Drama', favorite: false });
  console.log(await callAsync(categoryClient, 'list')({}));
})();
