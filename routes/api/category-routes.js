const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// find all categories
router.get('/', async (req, res) => {

  try {

    const categoryData = await Category.findAll({
      include: [{ model: Product }],
      order: [['id', 'ASC']]
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No categories found!' });
      return;
    }
    res.status(200).json({ message: 'Category data found!', categoryData });

  } catch (err) {
    res.status(500).json({message: 'Error retrieving category data!', err});
  }

});

// find one category by its `id` value
router.get('/:id', async (req, res) => {

  try {

    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
      order: [['id', 'ASC']],
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No categories found!' });
      return;
    }
    res.status(200).json({ message: 'Category data found!', categoryData });

  } catch (err) {
    res.status(500).json({message: 'Error retrieving category data!', err});
  }

});

// create a new category
router.post('/', async (req, res) => {

  try {
    const categoryData = await Category.create({
      category_name: req.body.category_name,
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No categories found!' });
      return;
    }

    res.status(200).json({ message: 'Category data created!', categoryData });

  } catch (err) {
    res.status(500).json({ message: 'Error creating category data!', err });
  }

});

// update a category by its `id` value
router.put('/:id', async (req, res) => {

  try {
    const categoryData = await Category.update(req.body, {
      where: {id: req.params.id},
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No categories found!' });
      return;
    }
    res.status(200).json({ message: 'Category data updated!', categoryData });

  } catch (err) {
    res.status(500).json({ message: 'Error updating category data!', err });
  }

});

// delete a category by its `id` value
router.delete('/:id', async (req, res) => {

  try {
    const categoryData = await Category.destroy({
      where: {id: req.params.id},
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No categories found!' });
      return;
    }
    res.status(200).json({ message: 'Category data deleted!', categoryData });

  } catch (err) {
    res.status(500).json({ message: 'Error deleting category data!', err });
  }

});

module.exports = router;
