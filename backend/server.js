const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
require('dotenv').config();

const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const productCategoryRoutes = require('./routes/productCategoryRoutes');
const productVariantRoutes = require('./routes/productVariantRoutes');
const orderRoutes = require('./routes/orderRoutes');
const midtransRoutes = require('./routes/midtransRoutes');

const app = express();
const execAsync = promisify(exec);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve folder uploads secara static agar bisa diakses dari frontend
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/product-categories', productCategoryRoutes);
app.use('/api/product-variants', productVariantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/midtrans', midtransRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Asterism API is running!'
  });
});

const PORT = process.env.PORT || 3001;

const ensureDatabaseSchema = async () => {
  const [genderColumn] = await sequelize.query(
    "SHOW COLUMNS FROM products LIKE 'gender'"
  );

  const [featuredCategoryColumn] = await sequelize.query(
    "SHOW COLUMNS FROM product_categories LIKE 'is_featured'"
  );

  const [orderPaymentProofColumn] = await sequelize.query(
    "SHOW COLUMNS FROM orders LIKE 'payment_proof'"
  );

  if (!genderColumn.length) {
    await sequelize.query(
      "ALTER TABLE products ADD COLUMN gender JSON NULL AFTER category_id"
    );
    console.log("Database schema updated: added products.gender column");
  }

  if (!featuredCategoryColumn.length) {
    await sequelize.query(
      "ALTER TABLE product_categories ADD COLUMN is_featured TINYINT(1) NOT NULL DEFAULT 0 AFTER image"
    );
    console.log("Database schema updated: added product_categories.is_featured column");
  }

  if (!orderPaymentProofColumn.length) {
    await sequelize.query(
      "ALTER TABLE orders ADD COLUMN payment_proof TEXT NULL AFTER notes"
    );
    console.log("Database schema updated: added orders.payment_proof column");
  }
};

const killProcessOnPort = async (port) => {
  try {
    const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
    const lines = stdout.trim().split('\n');
    const pids = new Set();
    
    lines.forEach(line => {
      const match = line.match(/LISTENING\s+(\d+)/);
      if (match) {
        pids.add(match[1]);
      }
    });

    for (const pid of pids) {
      try {
        await execAsync(`taskkill /F /PID ${pid}`);
        console.log(`Killed process ${pid} on port ${port}`);
      } catch (err) {
        console.log(`Failed to kill process ${pid}:`, err.message);
      }
    }
  } catch (err) {
    // No process found on port, that's okay
  }
};

const startServer = async () => {
  try {
    await killProcessOnPort(PORT);
    
    await sequelize.authenticate();
    console.log('Database connected successfully');

    await ensureDatabaseSchema();

    await sequelize.sync({ force: false });
    console.log('Database synchronized');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
};

startServer();
