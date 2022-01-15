const CategoryRepository = require('../data/CategoryRepository');

class CategoryController {
  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  find(id) {
    const category = this.categoryRepository.findById(id);
    if (!category) throw new Error(`Category ${id} not found`);
    return category;
  }

  list() {
    return this.categoryRepository.listAll();
  }

  create(params) {
    const category = this.categoryRepository.create(params);
    this.categoryRepository.save();
    return category;
  }

  update(categoryId, updateData) {
    this.find(categoryId);
    const category = this.categoryRepository.update(categoryId, updateData);
    this.categoryRepository.save();
    return category;
  }

  delete(id) {
    return this.categoryRepository.delete(id).save();
  }
}

module.exports = CategoryController;
