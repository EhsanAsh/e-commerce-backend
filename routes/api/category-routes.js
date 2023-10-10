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
    }

    res.status(200).json({message: 'Category data found!', categoryData});
  } catch (err) {
    res.status(500).json({message: 'Error retrieving category data!', err});
  }

});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
});

router.post('/', (req, res) => {
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
