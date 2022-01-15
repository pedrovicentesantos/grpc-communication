const fs = require('fs');
const path = require('path');
const Oid = require('bson-objectid');

class CategoryRepository {
  static dbLocation = path.resolve(__dirname, './db');

  static collectionPath = path.resolve(CategoryRepository.dbLocation, 'categories.json');

  static #collection = [];

  constructor() {
    if (!fs.existsSync(CategoryRepository.dbLocation)) {
      fs.mkdirSync(CategoryRepository.dbLocation, { recursive: true });
    }
    if (!fs.existsSync(CategoryRepository.collectionPath)) {
      fs.writeFileSync(CategoryRepository.collectionPath, '[]');
    }
    CategoryRepository.#collection = require(CategoryRepository.collectionPath);
  }

  findById(id) {
    return CategoryRepository.#collection.find((category) => category.id === id);
  }

  search(key, value) {
    return CategoryRepository.#collection.find((category) => category[key] === value);
  }

  listAll() {
    return {
      categories: CategoryRepository.#collection,
    };
  }

  create(category) {
    const newCategory = { id: new Oid().toHexString(), ...category };
    CategoryRepository.#collection.push(newCategory);
    return newCategory;
  }

  delete(categoryId) {
    CategoryRepository.#collection = CategoryRepository.#collection.filter(
      (category) => !(new Oid(category.id)).equals(categoryId),
    );
    return this;
  }

  update(categoryId, updateData) {
    const category = this.findById(categoryId);
    const filteredData = Object.entries(updateData).reduce((acc, [key, value]) => {
      if (value) acc[key] = value;
      return acc;
    }, {});

    const updatedCategory = this.delete(categoryId).create({ ...category, ...filteredData });
    return updatedCategory;
  }

  serialize(entity) {
    return JSON.stringify(entity);
  }

  save() {
    fs.writeFileSync(
      CategoryRepository.collectionPath,
      this.serialize(CategoryRepository.#collection),
    );
    return this;
  }
}

module.exports = CategoryRepository;
