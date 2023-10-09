// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Define the relationship between Category and Product
// A Category can be associated with multiple Products
Category.hasMany(Product, {
  foreignKey: 'category_id', // Using 'category_id' as the foreign key
  onDelete: 'CASCADE' //Deleting a Category will also delete its associated Products
});

Product.belongsTo(Category, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE'
});

Product.belongsToMany(Tag, {
  through: ProductTag,
  foreignKey: 'product_id',
  onDelete: 'SET NULL'
});

Tag.belongsToMany(Product, {
  through: ProductTag,
  foreignKey: 'tag_id',
  onDelete: 'SET NULL'
});

module.exports = {Product, Category, Tag, ProductTag};
