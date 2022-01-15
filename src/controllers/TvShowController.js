const TvShowRepository = require('../data/TvShowRepository');
const CategoryController = require('./CategoryController');

class TvShowController {
  constructor() {
    this.tvShowRepository = new TvShowRepository();
    this.categoryController = new CategoryController();
  }

  find(id) {
    const tvShow = this.tvShowRepository.findById(id);
    if (!tvShow) throw new Error(`TV Show ${id} not found`);
    return tvShow;
  }

  list() {
    return this.tvShowRepository.listAll();
  }

  create(params) {
    this.assertCategories(params.categories);
    const tvShow = this.tvShowRepository.create(params);
    this.tvShowRepository.save();
    return tvShow;
  }

  update(tvShowId, updateData) {
    this.find(tvShowId);
    if (updateData?.categories) this.assertCategories(updateData.categories);
    const tvShow = this.tvShowRepository.update(tvShowId, updateData);
    this.tvShowRepository.save();
    return tvShow;
  }

  delete(id) {
    return this.tvShowRepository.delete(id).save();
  }

  assertCategories(categoriesList) {
    categoriesList.forEach((category) => {
      this.categoryController.find(category);
    });
  }
}

module.exports = TvShowController;
