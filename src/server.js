const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const tvShowHandlers = require('./handlers/TvShowHandler');

const protoObject = protoLoader.loadSync(path.resolve(__dirname, '../proto/tvShows.proto'));
const TvShowsDefinition = grpc.loadPackageDefinition(protoObject);

const server = new grpc.Server();

server.addService(TvShowsDefinition.TvShowService.service, tvShowHandlers);

server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
console.log('Listening...');
server.start();
