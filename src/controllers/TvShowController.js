const TvShowRepository = require('../data/TvShowRepository');

class TvShowController {
  constructor() {
    this.tvShowRepository = new TvShowRepository();
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
    const tvShow = this.tvShowRepository.create(params);
    this.tvShowRepository.save();
    return tvShow;
  }

  update(tvShowId, updateData) {
    this.find(tvShowId);
    const tvShow = this.tvShowRepository.update(tvShowId, updateData);
    this.tvShowRepository.save();
    return tvShow;
  }

  delete(id) {
    return this.tvShowRepository.delete(id).save();
  }
}

module.exports = TvShowController;
