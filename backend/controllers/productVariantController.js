const { ProductVariant, Product } = require('../models');
const { Op } = require('sequelize');

const getAllVariants = async (req, res) => {
  try {
    const { page = 1, limit = 10, product_id, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    
    if (product_id) {
      where.product_id = product_id;
    }
    
    if (search) {
      where[Op.or] = [
        { variant_name: { [Op.like]: `%${search}%` } },
        { variant_value: { [Op.like]: `%${search}%` } },
        { sku: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await ProductVariant.findAndCountAll({
      where,
      include: [
        { model: Product, as: 'product' }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        variants: rows,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total_items: count,
          total_pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getVariantById = async (req, res) => {
  try {
    const variant = await ProductVariant.findByPk(req.params.id, {
      include: ['product']
    });

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: 'Variant not found'
      });
    }

    res.json({
      success: true,
      data: variant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createVariant = async (req, res) => {
  try {
    const {
      product_id,
      variant_name,
      variant_value,
      price,
      stock,
      sku,
      image
    } = req.body;

    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const variant = await ProductVariant.create({
      product_id,
      variant_name,
      variant_value,
      price: price || null,
      stock: stock || 0,
      sku: sku || null,
      image: image || null
    });

    const createdVariant = await ProductVariant.findByPk(variant.id, {
      include: ['product']
    });

    res.status(201).json({
      success: true,
      message: 'Variant created successfully',
      data: createdVariant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateVariant = async (req, res) => {
  try {
    const variant = await ProductVariant.findByPk(req.params.id);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: 'Variant not found'
      });
    }

    const {
      product_id,
      variant_name,
      variant_value,
      price,
      stock,
      sku,
      image
    } = req.body;

    // If product_id is provided, check if product exists
    if (product_id !== undefined) {
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
    }

    const updateData = {};
    if (product_id !== undefined) updateData.product_id = product_id;
    if (variant_name !== undefined) updateData.variant_name = variant_name;
    if (variant_value !== undefined) updateData.variant_value = variant_value;
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (sku !== undefined) updateData.sku = sku;
    if (image !== undefined) updateData.image = image;

    await variant.update(updateData);

    const updatedVariant = await ProductVariant.findByPk(variant.id, {
      include: ['product']
    });

    res.json({
      success: true,
      message: 'Variant updated successfully',
      data: updatedVariant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteVariant = async (req, res) => {
  try {
    const variant = await ProductVariant.findByPk(req.params.id);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: 'Variant not found'
      });
    }

    await variant.destroy();

    res.json({
      success: true,
      message: 'Variant deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllVariants,
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant
};
