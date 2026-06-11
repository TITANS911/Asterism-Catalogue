# Asterism Backend API

Backend API untuk Asterism Catalogue - Toko Online Modern

## Stack Teknologi
- **Node.js** - Runtime JavaScript
- **Express.js** - Web Framework
- **MySQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication

## Setup Proyek

1. Install dependencies:
```bash
cd backend
npm install
```

2. Konfigurasi database di file `.env`:
```
PORT=3001
DB_HOST=localhost
DB_NAME=asterism_db
DB_USER=root
DB_PASSWORD=
JWT_SECRET=asterism-secret-key-2024
JWT_EXPIRE=7d
```

3. Pastikan database MySQL sudah dibuat:
```sql
CREATE DATABASE asterism_db;
```

4. Jalankan server development:
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3001`

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Mendapatkan user yang sedang login (memerlukan token)

### Products
- `GET /api/products` - Mendapatkan semua produk
- `GET /api/products/categories` - Mendapatkan semua kategori
- `GET /api/products/:id` - Mendapatkan produk by ID
- `POST /api/products` - Membuat produk baru (admin only)
- `PUT /api/products/:id` - Update produk (admin only)
- `DELETE /api/products/:id` - Hapus produk (admin only)

### Orders
- `GET /api/orders/dashboard` - Mendapatkan statistik dashboard (admin only)
- `GET /api/orders` - Mendapatkan semua order (admin only)
- `GET /api/orders/:id` - Mendapatkan order by ID
- `POST /api/orders` - Membuat order baru
- `PUT /api/orders/:id/status` - Update status order (admin only)
