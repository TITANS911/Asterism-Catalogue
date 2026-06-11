const express = require('express');
const {
  getAllVariants,
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant
} = require('../controllers/productVariantController');
const { authAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', authAdmin, getAllVariants);
router.get('/:id', authAdmin, getVariantById);
router.post('/', authAdmin, createVariant);
router.put('/:id', authAdmin, updateVariant);
router.delete('/:id', authAdmin, deleteVariant);

module.exports = router;
