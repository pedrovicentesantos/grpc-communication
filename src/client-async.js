/* eslint-disable no-console */
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
  const updateTvShow = await callAsync(tvShowClient, 'create')({ name: 'Santa Clarita Diet', description: 'Zumbis', rating: 9.5 });
  const deleteTvShow = await callAsync(tvShowClient, 'create')({ name: 'Euphoria', description: 'Drama', rating: 9.5 });

  console.log('---------------------------------------------------------------------------------');
  console.log('LISTING TV SHOWS');
  console.log('---------------------------------------------------------------------------------');
  console.log(await callAsync(tvShowClient, 'list')({}));

  console.log('---------------------------------------------------------------------------------');
  console.log('SEARCHING TV SHOW');
  console.log('---------------------------------------------------------------------------------');
  console.log(await callAsync(tvShowClient, 'find')({ id: updateTvShow.id }));

  console.log('---------------------------------------------------------------------------------');
  console.log('UPDATING TV SHOW');
  console.log('---------------------------------------------------------------------------------');
  await callAsync(tvShowClient, 'update')({ id: updateTvShow.id, updateParams: { rating: 1 } });
  console.log(await callAsync(tvShowClient, 'find')({ id: updateTvShow.id }));

  console.log('---------------------------------------------------------------------------------');
  console.log('CREATING CATEGORIES');
  console.log('---------------------------------------------------------------------------------');
  const updateCategory = await callAsync(categoryClient, 'create')({ name: 'Comedy' });
  const deleteCategory = await callAsync(categoryClient, 'create')({ name: 'Drama', favorite: false });

  console.log('---------------------------------------------------------------------------------');
  console.log('LISTING CATEGORIES');
  console.log('---------------------------------------------------------------------------------');
  console.log(await callAsync(categoryClient, 'list')({}));

  console.log('---------------------------------------------------------------------------------');
  console.log('UPDATING CATEGORY');
  console.log('---------------------------------------------------------------------------------');
  await callAsync(categoryClient, 'update')({ id: updateCategory.id, updateParams: { favorite: true } });
  console.log(await callAsync(categoryClient, 'find')({ id: updateCategory.id }));

  console.log('---------------------------------------------------------------------------------');
  console.log('REMOVING TV SHOW AND CATEGORY');
  console.log('---------------------------------------------------------------------------------');
  await callAsync(tvShowClient, 'remove')({ id: deleteTvShow.id });
  await callAsync(categoryClient, 'remove')({ id: deleteCategory.id });
  try {
    await callAsync(tvShowClient, 'find')({ id: deleteTvShow.id });
  } catch (err) {
    console.log(`Error searching for tv show ${deleteTvShow.id}:${deleteTvShow.name}`);
    console.error(err.message);
  }
  try {
    await callAsync(categoryClient, 'find')({ id: deleteCategory.id });
  } catch (err) {
    console.log(`Error searching for category ${deleteCategory.id}:${deleteCategory.name}`);
    console.error(err.message);
  }
})();
