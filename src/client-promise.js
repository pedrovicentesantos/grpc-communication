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
  console.log('CREATING CATEGORIES');
  console.log('---------------------------------------------------------------------------------');
  const updateCategory = await promisify(categoryClient, 'create', { name: 'Comedy' });
  const deleteCategory = await promisify(categoryClient, 'create', { name: 'Drama', favorite: false });

  promisify(categoryClient, 'list', {}).then((categories) => {
    console.log('---------------------------------------------------------------------------------');
    console.log('LISTING CATEGORIES');
    console.log('---------------------------------------------------------------------------------');
    console.log(categories);
  });

  await promisify(categoryClient, 'update', { id: updateCategory.id, updateParams: { favorite: true } });
  promisify(categoryClient, 'find', { id: updateCategory.id }).then((searchedCategory) => {
    console.log('---------------------------------------------------------------------------------');
    console.log('UPDATING CATEGORY');
    console.log('---------------------------------------------------------------------------------');
    console.log(searchedCategory);
  });

  console.log('---------------------------------------------------------------------------------');
  console.log('CREATING TV SHOWS');
  console.log('---------------------------------------------------------------------------------');
  const updateTvShow = await promisify(
    tvShowClient,
    'create',
    {
      name: 'Santa Clarita Diet',
      description: 'Zumbis',
      rating: 9.5,
      categories: [updateCategory.id],
    },
  );
  const deleteTvShow = await promisify(
    tvShowClient,
    'create',
    {
      name: 'Euphoria',
      description: 'Drama',
      rating: 9.5,
      categories: [deleteCategory.id],
    },
  );
  try {
    await promisify(
      tvShowClient,
      'create',
      {
        name: 'Test',
        description: 'Description',
        rating: 9.5,
        categories: ['not-existing-category'],
      },
    );
  } catch (err) {
    console.error('Error creating tv show: Category does not exist');
  }

  promisify(tvShowClient, 'list', {}).then((tvShows) => {
    console.log('---------------------------------------------------------------------------------');
    console.log('LISTING TV SHOWS');
    console.log('---------------------------------------------------------------------------------');
    console.log(tvShows);
  });

  promisify(tvShowClient, 'find', { id: updateTvShow.id }).then((searchedTvShow) => {
    console.log('---------------------------------------------------------------------------------');
    console.log('SEARCHING TV SHOW');
    console.log('---------------------------------------------------------------------------------');
    console.log(searchedTvShow);
  });

  await promisify(tvShowClient, 'update', { id: updateTvShow.id, updateParams: { rating: 1 } });
  promisify(tvShowClient, 'find', { id: updateTvShow.id }).then((searchedTvShow) => {
    console.log('---------------------------------------------------------------------------------');
    console.log('UPDATING TV SHOW');
    console.log('---------------------------------------------------------------------------------');
    console.log(searchedTvShow);
  });

  console.log('---------------------------------------------------------------------------------');
  console.log('REMOVING TV SHOW AND CATEGORY');
  console.log('---------------------------------------------------------------------------------');
  await promisify(tvShowClient, 'remove', { id: deleteTvShow.id });
  await promisify(categoryClient, 'remove', { id: deleteCategory.id });
  try {
    await promisify(tvShowClient, 'find', { id: deleteTvShow.id });
  } catch (err) {
    console.log(`Error searching for tv show ${deleteTvShow.id}:${deleteTvShow.name}`);
    console.error(err.message);
  }
  try {
    await promisify(categoryClient, 'find', { id: deleteCategory.id });
  } catch (err) {
    console.log(`Error searching for category ${deleteCategory.id}:${deleteCategory.name}`);
    console.error(err.message);
  }
})();
