const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// get all tags
router.get('/', async (req, res) => {

  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }],
      order: [['id', 'ASC']],
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tags found!' });
      return;
    }
    res.status(200).json({ message: 'Tag data found!', tagData });

  } catch (err) {
    res.status(500).json({ message: 'Error retrieving tag data!', err });
  }

});

// get one tag
router.get('/:id', async (req, res) => {

  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
      order: [['id', 'ASC']],
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tags found!' });
      return;
    }
    res.status(200).json({ message: 'Tag data found!', tagData });

  } catch (err) {
    res.status(500).json({ message: 'Error retrieving tag data!', err });
  }

});

router.post('/', (req, res) => {
  // create a new tag
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
