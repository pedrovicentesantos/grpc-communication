const Controller = require('../controllers/TvShowController');

const tvShowController = new Controller();

function list(_, callback) {
  return callback(null, tvShowController.list());
}

function find({ request }, callback) {
  try {
    const tvShow = tvShowController.find(request.id);
    return callback(null, tvShow);
  } catch (err) {
    return callback(err, null);
  }
}

function update({ request }, callback) {
  const { id } = request;
  const updateParams = request.tvShowUpdateParams;

  try {
    const tvShow = tvShowController.update(id, updateParams);
    return callback(null, tvShow);
  } catch (err) {
    return callback(err, null);
  }
}

function remove({ request }, callback) {
  const { id } = request;
  return callback(null, tvShowController.delete(id));
}

function create({ request }, callback) {
  return callback(null, tvShowController.create(request));
}

module.exports = {
  find,
  list,
  create,
  remove,
  update,
};
