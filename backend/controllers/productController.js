const { Product, ProductCategory, ProductVariant } = require('../models');
const { Op, literal } = require('sequelize');
const sequelize = require('../config/database');

const ALLOWED_GENDERS = ['men', 'women', 'kids'];

const normalizeGenderInput = (value) => {
  let parsed = value;

  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed);
    } catch (error) {
      parsed = parsed.split(',').map(item => item.trim());
    }
  }

  if (!Array.isArray(parsed)) {
    parsed = parsed ? [parsed] : [];
  }

  return [...new Set(
    parsed
      .map(item => String(item).toLowerCase().trim())
      .filter(item => ALLOWED_GENDERS.includes(item))
  )];
};

const parseStoredArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  return [];
};

const serializeProduct = (product) => {
  if (!product) {
    return product;
  }

  const plainProduct =
    typeof product.toJSON === 'function' ? product.toJSON() : { ...product };

  return {
    ...plainProduct,
    gender: parseStoredArray(plainProduct.gender),
    images: parseStoredArray(plainProduct.images),
    tags: parseStoredArray(plainProduct.tags)
  };
};

const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, status, gender } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (category) {
      where.category_id = category;
    }
    
    if (status) {
      where.status = status;
    }

    if (gender && ALLOWED_GENDERS.includes(String(gender).toLowerCase())) {
      const escapedGender = sequelize.escape(String(gender).toLowerCase());
      where[Op.and] = [
        literal(`JSON_SEARCH(gender, 'one', ${escapedGender}) IS NOT NULL`)
      ];
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: ['category', 'variants'],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        products: rows.map(serializeProduct),
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

const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: ['category', 'variants']
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: serializeProduct(product)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      short_description,
      category_id,
      gender,
      price,
      discount_price,
      sku,
      stock,
      weight,
      dimensions,
      is_featured,
      status,
      existingImages,
      featuredImageIndex
    } = req.body;

    const normalizedGender = normalizeGenderInput(gender);

    // Proses file upload
    const uploadedFiles = req.files || [];
    const uploadedImagePaths = uploadedFiles.map(
      file => `${process.env.BASE_URL || 'http://localhost:3001'}/uploads/${file.filename}`
    );

    // Gabung dengan existing images (untuk edit nanti)
    let allImages = [];
    if (existingImages) {
      try {
        allImages = JSON.parse(existingImages);
      } catch (e) {
        allImages = [];
      }
    }
    allImages = [...allImages, ...uploadedImagePaths];

    // Tentukan featured image
    let productFeaturedImage = null;
    if (featuredImageIndex !== undefined && featuredImageIndex !== null && allImages[featuredImageIndex]) {
      productFeaturedImage = allImages[featuredImageIndex];
    } else if (allImages.length > 0) {
      productFeaturedImage = allImages[0];
    }

    const product = await Product.create({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description,
      short_description,
      category_id,
      gender: normalizedGender,
      price,
      discount_price,
      sku,
      stock,
      weight,
      dimensions,
      featured_image: productFeaturedImage,
      images: allImages,
      is_featured,
      status
    });

    // Proses variants
    let productVariants = [];
    if (req.body.variants) {
      try {
        productVariants = typeof req.body.variants === 'string' 
          ? JSON.parse(req.body.variants) 
          : req.body.variants;
      } catch (e) {
        productVariants = [];
      }
    }
    
    if (productVariants.length > 0) {
      for (const variant of productVariants) {
        await ProductVariant.create({
          product_id: product.id,
          ...variant
        });
      }
    }

    const productWithVariants = await Product.findByPk(product.id, {
      include: ['variants', 'category']
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: serializeProduct(productWithVariants)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Proses file upload
    const uploadedFiles = req.files || [];
    const uploadedImagePaths = uploadedFiles.map(
      file => `${process.env.BASE_URL || 'http://localhost:3001'}/uploads/${file.filename}`
    );

    // Proses existing images
    let allImages = Array.isArray(product.images) ? [...product.images] : [];
    if (req.body.existingImages) {
      try {
        allImages = typeof req.body.existingImages === 'string' 
          ? JSON.parse(req.body.existingImages) 
          : req.body.existingImages;
      } catch (e) {
        allImages = Array.isArray(product.images) ? [...product.images] : [];
      }
    }

    // Gabung dengan file baru
    allImages = [...allImages, ...uploadedImagePaths];

    // Tentukan featured image
    let productFeaturedImage = product.featured_image;
    if (req.body.featuredImageIndex !== undefined && req.body.featuredImageIndex !== null && allImages[req.body.featuredImageIndex]) {
      productFeaturedImage = allImages[req.body.featuredImageIndex];
    } else if (allImages.length > 0 && !productFeaturedImage) {
      productFeaturedImage = allImages[0];
    }

    // Ambil data dari body (hanya field yang ada di body)
    const updateData = {
      ...req.body,
      featured_image: productFeaturedImage,
      images: allImages
    };

    if (req.body.gender !== undefined) {
      updateData.gender = normalizeGenderInput(req.body.gender);
    }

    // Hapus field yang tidak perlu
    delete updateData.existingImages;
    delete updateData.featuredImageIndex;

    // Proses variants
    let productVariants = [];
    if (updateData.variants) {
      try {
        productVariants = typeof updateData.variants === 'string' 
          ? JSON.parse(updateData.variants) 
          : updateData.variants;
      } catch (e) {
        productVariants = [];
      }
      delete updateData.variants;
    }

    await product.update(updateData);

    // Update variants
    if (productVariants.length > 0) {
      await ProductVariant.destroy({ where: { product_id: product.id } });
      
      for (const variant of productVariants) {
        await ProductVariant.create({
          product_id: product.id,
          ...variant
        });
      }
    }

    const updatedProduct = await Product.findByPk(product.id, {
      include: ['category', 'variants']
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: serializeProduct(updatedProduct)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.destroy();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.findAll({
      include: ['children'],
      order: [['sort_order', 'ASC']]
    });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, slug, description, image, parent_id, sort_order, status } = req.body;

    const category = await ProductCategory.create({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description,
      image,
      parent_id,
      sort_order,
      status
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
  createCategory
};
