import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import Layout
import CompanyLayout from "./layouts/CompanyLayout.jsx";
import EcommerceLayout from "./layouts/EcommerceLayout.jsx";

// header, footer, atau komponen yang selalu muncul di semua halaman
import NavbarCompany from "./components/NavbarCompany";
import Footer from "./components/Footer";
import HeroBanner from "./components/HeroBanner";
import Spotlight from "./components/Spotlight.jsx";
import Contact from "./components/Contact.jsx";

// Import Protected Route
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Import Halaman-halaman anak - Company
import CompanyHome from "./pages/company/CompanyHome";
import About from "./pages/company/CompanyAbout.jsx";


// Import Halaman-halaman anak - Ecommerce Men
// import EcommerceMenUser from "./pages/ecommerce/user/MenProducts.jsx";
import EcommerceMenProducts from "./pages/ecommerce/user/MenProducts.jsx";
import EcommerceMenDekker from "./pages/ecommerce/user/MenDekker.jsx";
import EcommerceMenSocks from "./pages/ecommerce/user/MenSocks.jsx";
import EcommerceMenJersey from "./pages/ecommerce/user/MenJersey.jsx";

// Women
import EcommerceWomenProducts from "./pages/ecommerce/user/WomenProducts.jsx";

// Bag
import Bag from "./pages/ecommerce/user/Bag.jsx";
import Favorite from "./pages/ecommerce/user/Favorite.jsx";
import Checkout from "./pages/ecommerce/user/Checkout.jsx";
import Orders from "./pages/ecommerce/user/Orders.jsx";

// Kids
import EcommerceKidsProducts from "./pages/ecommerce/user/KidsProducts.jsx";

// Sale
import SaleProducts from "./pages/ecommerce/user/SaleProducts.jsx";
import DetailSaleProduct from "./pages/ecommerce/user/DetailSaleProduct.jsx";

// import CompanyProducts from './pages/company/CompanyProducts.jsx';
import EcommerceProducts from "./pages/ecommerce/EcommerceProducts.jsx";

// Admin Pages
import DashboardAdmin from "./pages/ecommerce/admin/DashboardAdmin.jsx";
import ProductManagement from "./pages/ecommerce/admin/ProductManagement.jsx";
import OrderMangement from "./pages/ecommerce/admin/OrderMangement.jsx";
import AddProduct from "./pages/ecommerce/admin/CURD Product/AddProduct.jsx";
import EditProduct from "./pages/ecommerce/admin/CURD Product/EditProduct.jsx";
import CategoryManagement from "./pages/ecommerce/admin/CategoryManagement.jsx";
import AddCategoryProduct from "./pages/ecommerce/admin/CRUD Category/CRUD Category Product/AddCategoryProduct.jsx";
import EditCategoryProduct from "./pages/ecommerce/admin/CRUD Category/CRUD Category Product/EditCategoryProduct.jsx";
import AddCategoryVariant from "./pages/ecommerce/admin/CRUD Category/CRUD Category Variant/AddCategoryVariant.jsx";
import EditCategoryVariant from "./pages/ecommerce/admin/CRUD Category/CRUD Category Variant/EditCategoryVariant.jsx";
import DetailOrderManagement from "./pages/ecommerce/admin/Detail Order/DetailOrderManagement.jsx";
import PaymentVerification from "./pages/ecommerce/admin/PaymentVerification.jsx";

// Auth Pages
import Login from "./pages/ecommerce/Login.jsx";
import Register from "./pages/ecommerce/Register.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Utama - Root */}
        <Route path="/" element={<CompanyLayout />}>
          <Route index element={<CompanyHome />} />
        </Route>

        {/* Rute Utama*/}
        <Route path="/company" element={<CompanyLayout />}>
          {/* Halaman utama ketika akses /company */}
          <Route index element={<CompanyHome />} />

          {/* Halaman tentang kami ketika akses /company/about */}
          <Route path="about" element={<About />} />

          {/* Halaman kontak ketika akses /company/contact */}
          <Route path="contact" element={<Contact />} />

          {/* Halaman layanan ketika akses /ecommerce/products*/}
          <Route path="products" element={<EcommerceProducts />} />
        </Route>

        <Route path="/ecommerce" element={<EcommerceLayout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <EcommerceProducts />
              </ProtectedRoute>
            }
          />

          {/* Grup Kategori Men */}
          <Route path="men">
            {/* Mengakses /ecommerce/men */}
            <Route
              index
              element={
                <ProtectedRoute>
                  <EcommerceMenProducts />
                </ProtectedRoute>
              }
            />

            {/* Mengakses /ecommerce/men/dekker */}
            <Route
              path="dekker"
              element={
                <ProtectedRoute>
                  <EcommerceMenDekker />
                </ProtectedRoute>
              }
            />

            <Route
              path="socks"
              element={
                <ProtectedRoute>
                  <EcommerceMenSocks />
                </ProtectedRoute>
              }
            />

            <Route
              path="jersey"
              element={
                <ProtectedRoute>
                  <EcommerceMenJersey />
                </ProtectedRoute>
              }
            />

            {/* Nanti kalau nambah kategori tinggal tulis gini, lebih gampang dibaca: */}
          </Route>

          <Route path="women">
            {/* Mengakses /ecommerce/women */}
            <Route
              index
              element={
                <ProtectedRoute>
                  <EcommerceWomenProducts />
                </ProtectedRoute>
              }
            />

            {/* <Route path="dekker" element={<EcommerceWomenDekker />} /> */}

            {/* Mengakses /ecommerce/women */}
            {/* <Route path="socks" element={<EcommerceWomenSocks />} /> */}
          </Route>

          <Route path="kids">
            {/* Mengakses /ecommerce/kids */}
            <Route
              index
              element={
                <ProtectedRoute>
                  <EcommerceKidsProducts />
                </ProtectedRoute>
              }
            />

            {/* <Route path="dekker" element={<EcommerceWomenDekker />} /> */}

            {/* <Route path="socks" element={<EcommerceWomenSocks />} /> */}
          </Route>

          <Route path="sale">
            <Route
              index
              element={
                <ProtectedRoute>
                  <SaleProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path=":id"
              element={
                <ProtectedRoute>
                  <DetailSaleProduct />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            path="bag"
            element={
              <ProtectedRoute>
                <Bag />
              </ProtectedRoute>
            }
          />

          <Route
            path="favorites"
            element={
              <ProtectedRoute>
                <Favorite />
              </ProtectedRoute>
            }
          />

          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Auth Routes */}
        <Route path="/ecommerce/login" element={<Login />} />
        <Route path="/ecommerce/register" element={<Register />} />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <ProductManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/add"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/edit/:id"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <OrderMangement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders/:id"
          element={
            <ProtectedRoute>
              <DetailOrderManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payment-verification"
          element={
            <ProtectedRoute>
              <PaymentVerification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute>
              <CategoryManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories/add"
          element={
            <ProtectedRoute>
              <AddCategoryProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories/edit/:id"
          element={
            <ProtectedRoute>
              <EditCategoryProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories/variants/add"
          element={
            <ProtectedRoute>
              <AddCategoryVariant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories/variants/edit/:id"
          element={
            <ProtectedRoute>
              <EditCategoryVariant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ecommerce/admin/dashboard"
          element={
            <ProtectedRoute>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ecommerce/admin/products"
          element={
            <ProtectedRoute>
              <ProductManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ecommerce/admin/products/add"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ecommerce/admin/products/edit/:id"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ecommerce/admin/orders"
          element={
            <ProtectedRoute>
              <OrderMangement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ecommerce/admin/orders/:id"
          element={
            <ProtectedRoute>
              <DetailOrderManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ecommerce/admin/payment-verification"
          element={
            <ProtectedRoute>
              <PaymentVerification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ecommerce/admin/categories"
          element={
            <ProtectedRoute>
              <CategoryManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ecommerce/admin/categories/add"
          element={
            <ProtectedRoute>
              <AddCategoryProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ecommerce/admin/categories/edit/:id"
          element={
            <ProtectedRoute>
              <EditCategoryProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ecommerce/admin/categories/variants/add"
          element={
            <ProtectedRoute>
              <AddCategoryVariant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ecommerce/admin/categories/variants/edit/:id"
          element={
            <ProtectedRoute>
              <EditCategoryVariant />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
