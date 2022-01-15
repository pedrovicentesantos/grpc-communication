const Controller = require('../controllers/CategoryController');

const categoryController = new Controller();

function list(_, callback) {
  return callback(null, categoryController.list());
}

function find({ request }, callback) {
  try {
    const category = categoryController.find(request.id);
    return callback(null, category);
  } catch (err) {
    return callback(err, null);
  }
}

function update({ request }, callback) {
  const { id } = request;
  const updateParams = request.categoryUpdateParams;

  try {
    const category = categoryController.update(id, updateParams);
    return callback(null, category);
  } catch (err) {
    return callback(err, null);
  }
}

function remove({ request }, callback) {
  const { id } = request;
  return callback(null, categoryController.delete(id));
}

function create({ request }, callback) {
  return callback(null, categoryController.create(request));
}

module.exports = {
  find,
  list,
  create,
  remove,
  update,
};
