const express = require('express');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/productCategoryController');
const { authAdmin } = require('../middleware/auth');
const upload = require('../config/multer');

const router = express.Router();

router.get('/', authAdmin, getAllCategories);
router.get('/:id', authAdmin, getCategoryById);
router.post('/', authAdmin, upload.single('image'), createCategory);
router.put('/:id', authAdmin, upload.single('image'), updateCategory);
router.delete('/:id', authAdmin, deleteCategory);

module.exports = router;
