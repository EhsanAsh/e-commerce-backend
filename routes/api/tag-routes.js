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

// create new tag
router.post('/', async (req, res) => {

  try {

    const tagData = await Tag.create(req.body);

    if (req.body.productIds.length) {
      const productTagIdArr = req.body.productIds.map((product_id) => {
        return {
          tag_id: tagData.id,
          product_id,
        };
      });
      const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
      res.status(200).json({ message: 'Tag created!', tagData, productTagIds });
    } else {
      res.status(200).json({ message: 'Tag created!', tagData });
    }

  } catch (err) {
    res.status(500).json({ message: 'Error creating tag!', err });
  }

});

// update a tag's name by its `id` value
router.put('/:id', async (req, res) => {

  try {

    const tagData = await Tag.update(req.body, {
      where: {id: req.params.id},
    });

    // find all associated products from ProductTag
    if (req.body.productIds && req.body.productIds.length) {

      const productTags = await ProductTag.findAll({ where: { tag_id: req.params.id } });
      const productTagIds = productTags.map(({ product_id }) => product_id);

      // create filtered list of new product_ids
      const newProductTags = req.body.productIds
        .filter((product_id) => !productTagIds.includes(product_id))
        .map((product_id) => {
          return {
            tag_id: req.params.id,
            product_id,
          };
        });

      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ product_id }) => !req.body.productIds.includes(product_id))
        .map(({ id }) => id);

      // run both actions
      await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);

    }
    return res.status(200).json({ message: 'Tag updated!', tagData });

  } catch (err) {
    res.status(500).json({ message: 'Error updating tag!', err });
  }

});

// delete one tag by its `id` value
router.delete('/:id', async (req, res) => {

  try {

    const tagData = await Tag.destroy({
      where: {id: req.params.id},
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tags found!' });
      return;
    }
    res.status(200).json({ message: 'Tag deleted!', tagData });

  } catch (err) {
    res.status(500).json({ message: 'Error deleting tag!', err });
  }

});

module.exports = router;
