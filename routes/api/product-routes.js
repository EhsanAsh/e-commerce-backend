const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {

  try {

    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
      order: [['id', 'ASC']],
    });

    if (!productData) {
      res.status(404).json({ message: 'No products found!' });
      return;
    }
    res.status(200).json({ message: 'Product data found!', productData });

  } catch (err) {
    res.status(500).json({ message: 'Error retrieving product data!', err });
  }

});

// get one product
router.get('/:id', async (req, res) => {

  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
      order: [['id', 'ASC']],
    });

    if (!productData) {
      res.status(404).json({ message: 'No products found!' });
      return;
    }
    res.status(200).json({ message: 'Product data found!', productData });

  } catch (err) {
    res.status(500).json({ message: 'Error retrieving product data!', err });
  }

});

// create new product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
      return res.status(200).json({ message: 'Product and associated tags created successfully!', product, productTagIds });
    }
    return res.status(200).json({ message: 'Product created successfully!', product });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error creating product data!', error: err.message });
  }
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {

        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// delete product by id
router.delete('/:id', async (req, res) => {

  try {
    const productData = await Product.destroy({
      where: { id: req.params.id },
    });

    if (!productData) {
      res.status(404).json({ message: 'No products found!' });
      return;
    }
    res.status(200).json({ message: 'Product data deleted!', productData });

  } catch (err) {
    res.status(500).json({ message: 'Error deleting product data!', err });
  }

});

module.exports = router;
