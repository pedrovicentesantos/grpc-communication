const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const tvShowHandlers = require('./handlers/TvShowHandler');
const categoryHandlers = require('./handlers/CategoryHandler');

const tvShowsProtoObject = protoLoader.loadSync(path.resolve(__dirname, '../proto/tvShows.proto'));
const TvShowsDefinition = grpc.loadPackageDefinition(tvShowsProtoObject);

const categoriesProtoObject = protoLoader.loadSync(path.resolve(__dirname, '../proto/categories.proto'));
const CategoriesDefinition = grpc.loadPackageDefinition(categoriesProtoObject);

const server = new grpc.Server();

server.addService(TvShowsDefinition.TvShowService.service, tvShowHandlers);
server.addService(CategoriesDefinition.CategoryService.service, categoryHandlers);

server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
console.log('Listening...');
server.start();
