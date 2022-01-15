const fs = require('fs');
const path = require('path');
const Oid = require('bson-objectid');

class TvShowRepository {
  static dbLocation = path.resolve(__dirname, './db');

  static collectionPath = path.resolve(TvShowRepository.dbLocation, 'tvShows.json');

  static #collection = [];

  constructor() {
    if (!fs.existsSync(TvShowRepository.dbLocation)) {
      fs.mkdirSync(TvShowRepository.dbLocation, { recursive: true });
    }
    if (!fs.existsSync(TvShowRepository.collectionPath)) {
      fs.writeFileSync(TvShowRepository.collectionPath, '[]');
    }
    TvShowRepository.#collection = require(TvShowRepository.collectionPath);
  }

  findById(id) {
    return TvShowRepository.#collection.find((tvShow) => tvShow.id === id);
  }

  search(key, value) {
    return TvShowRepository.#collection.find((tvShow) => tvShow[key] === value);
  }

  listAll() {
    return {
      tvShows: TvShowRepository.#collection,
    };
  }

  create(tvShow) {
    const newTvShow = { id: new Oid().toHexString(), ...tvShow };
    TvShowRepository.#collection.push(newTvShow);
    return newTvShow;
  }

  delete(tvShowId) {
    TvShowRepository.#collection = TvShowRepository.#collection.filter(
      (tvShow) => !(new Oid(tvShow.id)).equals(tvShowId),
    );
    return this;
  }

  update(tvShowId, updateData) {
    const tvShow = this.findById(tvShowId);
    const filteredData = Object.entries(updateData).reduce((acc, [key, value]) => {
      if (
        (Array.isArray(value) && value.length > 0)
        || (value && !Array.isArray(value))) acc[key] = value;
      return acc;
    }, {});

    const updatedTvShow = this.delete(tvShowId).create({ ...tvShow, ...filteredData });
    return updatedTvShow;
  }

  serialize(entity) {
    return JSON.stringify(entity);
  }

  save() {
    fs.writeFileSync(TvShowRepository.collectionPath, this.serialize(TvShowRepository.#collection));
    return this;
  }
}

module.exports = TvShowRepository;
