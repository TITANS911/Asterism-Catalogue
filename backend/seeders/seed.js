const { sequelize, UserGroup, User, ProductCategory, Product, Order, OrderItem, ProductVariant, InventoryLog, UserProfile, SiteSetting } = require('../models');

const seedData = async () => {
  try {
    console.log('Seeding data...');

    // Disable foreign key checks temporarily
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Delete existing data
    await InventoryLog.destroy({ where: {}, truncate: true });
    await OrderItem.destroy({ where: {}, truncate: true });
    await Order.destroy({ where: {}, truncate: true });
    await ProductVariant.destroy({ where: {}, truncate: true });
    await Product.destroy({ where: {}, truncate: true });
    await ProductCategory.destroy({ where: {}, truncate: true });
    await UserProfile.destroy({ where: {}, truncate: true });
    await User.destroy({ where: {}, truncate: true });
    await UserGroup.destroy({ where: {}, truncate: true });
    await SiteSetting.destroy({ where: {}, truncate: true });

    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    // Seed user groups
    const userGroups = await UserGroup.bulkCreate([
      {
        name: 'Admin',
        description: 'Administrator dengan akses penuh',
        permissions: ['all']
      },
      {
        name: 'Customer',
        description: 'Pelanggan biasa',
        permissions: ['read_products', 'create_orders']
      }
    ]);

    // Seed users
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@asterism.com',
      password: 'password123',
      user_group_id: userGroups[0].id,
      status: 'active'
    });

    await User.create({
      username: 'customer',
      email: 'customer@asterism.com',
      password: 'password123',
      user_group_id: userGroups[1].id,
      status: 'active'
    });

    // Seed categories
    const categories = await ProductCategory.bulkCreate([
      { name: 'Men', slug: 'men', sort_order: 1 },
      { name: 'Women', slug: 'women', sort_order: 2 },
      { name: 'Kids', slug: 'kids', sort_order: 3 },
      { name: 'Accessories', slug: 'accessories', sort_order: 4 }
    ]);

    // Seed products
    await Product.bulkCreate([
      {
        name: 'Jersey Retro Cream',
        slug: 'jersey-retro-cream',
        description: 'Jersey dengan desain retro yang nyaman dan stylish',
        category_id: categories[0].id,
        price: 450000,
        discount_price: 350000,
        stock: 50,
        is_featured: true,
        status: 'active'
      },
      {
        name: 'Dekker Soft Compact',
        slug: 'dekker-soft-compact',
        description: 'Dekker nyaman untuk aktivitas sehari-hari',
        category_id: categories[0].id,
        price: 780000,
        discount_price: 620000,
        stock: 30,
        is_featured: true,
        status: 'active'
      },
      {
        name: 'Socks Classic Hard',
        slug: 'socks-classic-hard',
        description: 'Kaos kaki klasik dengan kualitas premium',
        category_id: categories[3].id,
        price: 120000,
        stock: 100,
        is_featured: false,
        status: 'active'
      },
      {
        name: 'Jersey Velocity Blue',
        slug: 'jersey-velocity-blue',
        description: 'Jersey dengan warna biru yang fresh',
        category_id: categories[0].id,
        price: 520000,
        discount_price: 420000,
        stock: 35,
        is_featured: false,
        status: 'active'
      }
    ]);

    // Seed product variants
    await ProductVariant.bulkCreate([
      {
        product_id: 1,
        variant_name: 'Size',
        variant_value: 'S',
        price: 450000,
        stock: 20,
        sku: 'JRC-S',
        image: null
      },
      {
        product_id: 1,
        variant_name: 'Size',
        variant_value: 'M',
        price: 450000,
        stock: 25,
        sku: 'JRC-M',
        image: null
      },
      {
        product_id: 1,
        variant_name: 'Size',
        variant_value: 'L',
        price: 450000,
        stock: 15,
        sku: 'JRC-L',
        image: null
      },
      {
        product_id: 2,
        variant_name: 'Size',
        variant_value: 'S',
        price: 780000,
        stock: 10,
        sku: 'DSC-S',
        image: null
      },
      {
        product_id: 2,
        variant_name: 'Size',
        variant_value: 'M',
        price: 780000,
        stock: 15,
        sku: 'DSC-M',
        image: null
      },
      {
        product_id: 3,
        variant_name: 'Size',
        variant_value: 'One Size',
        price: 120000,
        stock: 100,
        sku: 'SCK-OS',
        image: null
      }
    ]);

    console.log('Seeding completed!');
    console.log('Admin user:');
    console.log('Email: admin@asterism.com');
    console.log('Password: password123');
    console.log('Customer user:');
    console.log('Email: customer@asterism.com');
    console.log('Password: password123');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await sequelize.close();
  }
};

seedData();
