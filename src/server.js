const grpc = require('grpc');
const path = require('path');
const tvShowHandlers = require('./handlers/TvShowHandler');

const TvShowsDefinition = grpc.load(path.resolve(__dirname, '../proto/tvShows.proto'));

const server = new grpc.Server();

server.addService(TvShowsDefinition.TvShowService.service, tvShowHandlers);

server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
console.log('Listening...');
server.start();
