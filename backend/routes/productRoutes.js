const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
  createCategory
} = require('../controllers/productController');
const { authAdmin } = require('../middleware/auth');
const upload = require('../config/multer');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/categories', getAllCategories);
router.get('/:id', getProductById);

// Gunakan multer untuk upload file (featured_image dan images)
router.post('/', authAdmin, upload.array('images', 10), createProduct);
router.post('/categories', authAdmin, createCategory);
router.put('/:id', authAdmin, upload.array('images', 10), updateProduct);
router.delete('/:id', authAdmin, deleteProduct);

module.exports = router;
