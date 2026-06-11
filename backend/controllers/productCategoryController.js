const { ProductCategory } = require('../models');
const { Op } = require('sequelize');

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

const normalizeBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return ['true', '1', 'yes', 'on'].includes(normalized);
  }
  return false;
};

const getAllCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await ProductCategory.findAndCountAll({
      where,
      include: [
        { model: ProductCategory, as: 'parent' },
        { model: ProductCategory, as: 'children' }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        categories: rows,
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

const getCategoryById = async (req, res) => {
  try {
    const category = await ProductCategory.findByPk(req.params.id, {
      include: [
        { model: ProductCategory, as: 'parent' },
        { model: ProductCategory, as: 'children' }
      ]
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
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
    const {
      name,
      description,
      parent_id,
      sort_order,
      status,
      is_featured
    } = req.body;

    const categoryImage = req.file
      ? `${process.env.BASE_URL || 'http://localhost:3001'}/uploads/${req.file.filename}`
      : req.body.image || null;

    let slug = generateSlug(name);
    
    // Check if slug exists, add number if it does
    let slugExists = await ProductCategory.findOne({ where: { slug } });
    let counter = 1;
    while (slugExists) {
      slug = `${generateSlug(name)}-${counter}`;
      slugExists = await ProductCategory.findOne({ where: { slug } });
      counter++;
    }

    const category = await ProductCategory.create({
      name,
      slug,
      description,
      image: categoryImage,
      is_featured: normalizeBoolean(is_featured),
      parent_id: parent_id || null,
      sort_order: sort_order || 0,
      status: status || 'active'
    });

    const createdCategory = await ProductCategory.findByPk(category.id, {
      include: ['parent', 'children']
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: createdCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await ProductCategory.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const {
      name,
      description,
      parent_id,
      sort_order,
      status,
      is_featured
    } = req.body;

    let updateData = {};
    
    if (name !== undefined) {
      updateData.name = name;
      
      // Regenerate slug if name changes
      let newSlug = generateSlug(name);
      let slugExists = await ProductCategory.findOne({ 
        where: { 
          slug: newSlug, 
          id: { [Op.ne]: req.params.id } 
        } 
      });
      let counter = 1;
      while (slugExists) {
        newSlug = `${generateSlug(name)}-${counter}`;
        slugExists = await ProductCategory.findOne({ 
          where: { 
            slug: newSlug, 
            id: { [Op.ne]: req.params.id } 
          } 
        });
        counter++;
      }
      updateData.slug = newSlug;
    }
    
    if (description !== undefined) updateData.description = description;
    if (req.file) {
      updateData.image = `${process.env.BASE_URL || 'http://localhost:3001'}/uploads/${req.file.filename}`;
    } else if (req.body.image !== undefined) {
      updateData.image = req.body.image;
    }
    if (parent_id !== undefined) updateData.parent_id = parent_id || null;
    if (sort_order !== undefined) updateData.sort_order = sort_order;
    if (status !== undefined) updateData.status = status;
    if (is_featured !== undefined) updateData.is_featured = normalizeBoolean(is_featured);

    await category.update(updateData);

    const updatedCategory = await ProductCategory.findByPk(category.id, {
      include: ['parent', 'children']
    });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await ProductCategory.findByPk(req.params.id, {
      include: ['children']
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has children
    if (category.children && category.children.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing child categories'
      });
    }

    await category.destroy();

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
