import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import styles from "../../../styles/ecommerce/user/MenDekker.module.css";
import RecentlyViewed from "../../../components/RecentlyViewed";

// Men Dekker Assets
import Dekker1 from '../../../assets/images/ecommerce/men/dekker-longform.png'; // Asterism Deck - Longform Hard
import Dekker2 from '../../../assets/images/ecommerce/men/dekker-soft-compact.png'; // Asterism Deck - Soft Compact
import Dekker3 from '../../../assets/images/ecommerce/men/socks-classic-hard.png'; // Asterism Deck - Classic Hard (white shin guards)

// Spotlight / Recently Viewed Assets
import Socks from "../../../assets/images/ecommerce/socks-white-blue.png";
import Jersey from "../../../assets/images/ecommerce/jersey-black.png";
import TshirtBlue from "../../../assets/images/ecommerce/tshirt-blue.png";

function EcommerceMenDekker() {
    const [dekkerProducts, setDekkerProducts] = useState([]);
    const [recentProducts, setRecentProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState("default");
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

    // Derived state untuk mengurutkan produk secara dinamis
    const sortedProducts = [...dekkerProducts].sort((a, b) => {
        if (sortBy === "price-asc") {
            const priceA = parseInt(a.price.replace(/[^\d]/g, ""));
            const priceB = parseInt(b.price.replace(/[^\d]/g, ""));
            return priceA - priceB;
        }
        if (sortBy === "price-desc") {
            const priceA = parseInt(a.price.replace(/[^\d]/g, ""));
            const priceB = parseInt(b.price.replace(/[^\d]/g, ""));
            return priceB - priceA;
        }
        return a.id - b.id; // Default berdasarkan id
    });

    useEffect(() => {
        // NOTE: Saat backend sudah siap, ganti simulasi ini dengan fetch/axios ke database Anda.
        // Contoh:
        // fetch('http://localhost:5000/api/products?category=men-dekker')
        //     .then(res => res.json())
        //     .then(data => {
        //         setDekkerProducts(data.products);
        //         setIsLoading(false);
        //     })
        //     .catch(err => console.error(err));

        const fetchProductsData = async () => {
            try {
                // Simulasi delay loading API
                await new Promise((resolve) => setTimeout(resolve, 300));

                // Set Data Produk Dekker
                setDekkerProducts([
                    {
                        id: 1,
                        name: "Asterism Deck - Classic Hard",
                        desc: "Medium size with durable hard material.",
                        price: "Rp129.900",
                        image: Dekker3 // shin guard putih
                    },
                    {
                        id: 2,
                        name: "Asterism Deck - Soft Compact",
                        desc: "Small size with soft and comfortable material.",
                        price: "Rp119.900",
                        image: Dekker2 // knee pad hitam
                    },
                    {
                        id: 3,
                        name: "Asterism Deck - Longform Hard",
                        desc: "Long size with strong and stable hard material.",
                        price: "Rp139.900",
                        image: Dekker1 // shin guard hitam panjang
                    }
                ]);

                // Ambil data "Recently Viewed" dari localStorage
                const storedRecentlyViewed = localStorage.getItem("recentlyViewed");
                if (storedRecentlyViewed) {
                    setRecentProducts(JSON.parse(storedRecentlyViewed));
                } else {
                    // Fallback: Jika user belum pernah melihat produk apa pun, tampilkan default produk sesuai gambar mockup
                    setRecentProducts([
                        {
                            id: 4,
                            name: "Asterism Socks - Eclipse White",
                            desc: "Clean and versatile sport socks designed for everyday comfort.",
                            price: "Rp49.900",
                            image: Socks
                        },
                        {
                            id: 5,
                            name: "Asterism Jersey - Strike Black",
                            desc: "Modern dark-tone jersey with strong athletic vibes.",
                            price: "Rp189.900",
                            image: Jersey
                        },
                        {
                            id: 6,
                            name: "Asterism T-Shirt - Eclipse Black",
                            desc: "Minimalist t-shirt with a timeless streetwear style.",
                            price: "Rp99.900",
                            image: TshirtBlue
                        }
                    ]);
                }
            } catch (error) {
                console.error("Gagal memuat produk:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductsData();
    }, []);

    const handleProductClick = (product) => {
        try {
            const existing = localStorage.getItem("recentlyViewed");
            let list = existing ? JSON.parse(existing) : [];

            list = list.filter(item => item.id !== product.id);

            list.unshift(product);

            list = list.slice(0, 3);

            localStorage.setItem("recentlyViewed", JSON.stringify(list));

            setRecentProducts(list);
        } catch (error) {
            console.error("Gagal memperbarui recently viewed:", error);
        }
    };

    return (
        <main className={styles.wrapper}>

            {/* BLACK HEADER SPACER (Untuk Latar Belakang Navbar Transparan di Atas) */}
            <div className={styles.blackHeaderSpacer}></div>

            {/* 1. --- BANNER MERAH (CATEGORY BAR) --- */}
            <nav className={styles.categoryBar} aria-label="Product Categories">
                <ul className={styles.categoryList}>
                    <li><Link to="/ecommerce" className={styles.categoryLink}>New & Featured</Link></li>
                    <li><Link to="/ecommerce/men" className={`${styles.categoryLink} ${styles.activeCategory}`}>Men</Link></li>
                    <li><Link to="/ecommerce/women" className={styles.categoryLink}>Woman</Link></li>
                    <li><Link to="/ecommerce/kids" className={styles.categoryLink}>Kids</Link></li>
                    <li><Link to="/ecommerce/sale" className={styles.categoryLink}>Sale</Link></li>
                </ul>
            </nav>

            {/* CONTAINER UNTUK MENENTUKAN LEBAR HALAMAN & POSISI TENGAH */}
            <div className={styles.container}>
                {/* 2. MAIN PRODUCTS SECTION (Men's Dekker) */}
                <section className={styles.productsSection} aria-labelledby="main-product-title">
                    <header className={styles.productsHeader}>
                        <h1 id="main-product-title">
                            Men’s Dekker
                            <span className={styles.count}>
                                ({isLoading ? "..." : dekkerProducts.length})
                            </span>
                        </h1>
                        <div className={styles.sortByContainer}>
                            <button
                                className={styles.sortBtn}
                                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                            >
                                Sort By <span className={styles.arrow}>▼</span>
                            </button>
                            {isSortDropdownOpen && (
                                <div className={styles.sortDropdown}>
                                    <button
                                        className={`${styles.sortOption} ${sortBy === "default" ? styles.sortOptionActive : ""}`}
                                        onClick={() => { setSortBy("default"); setIsSortDropdownOpen(false); }}
                                    >
                                        Default
                                    </button>
                                    <button
                                        className={`${styles.sortOption} ${sortBy === "price-asc" ? styles.sortOptionActive : ""}`}
                                        onClick={() => { setSortBy("price-asc"); setIsSortDropdownOpen(false); }}
                                    >
                                        Price: Low to High
                                    </button>
                                    <button
                                        className={`${styles.sortOption} ${sortBy === "price-desc" ? styles.sortOptionActive : ""}`}
                                        onClick={() => { setSortBy("price-desc"); setIsSortDropdownOpen(false); }}
                                    >
                                        Price: High to Low
                                    </button>
                                </div>
                            )}
                        </div>
                    </header>

                    {isLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', fontSize: '1.2rem', color: '#666' }}>
                            Loading products...
                        </div>
                    ) : (
                        <div className={styles.productsGrid}>
                            {sortedProducts.map((product) => (
                                <article
                                    key={product.id}
                                    className={styles.productCard}
                                    onClick={() => handleProductClick(product)}
                                >
                                    <div className={styles.imageWrapper}>
                                        <img src={product.image} alt={product.name} />
                                    </div>
                                    <div className={styles.productInfo}>
                                        <h2>{product.name}</h2>
                                        <p className={styles.description}>{product.desc}</p>
                                        <p className={styles.price}>{product.price}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <hr className={styles.divider} />

                {/* 3. RECENTLY VIEWED SECTION */}
                {/* {!isLoading && recentProducts.length > 0 && (
                    <RecentlyViewed products={recentProducts} />
                )} */}
                {/* <RecentlyViewed products={recentProducts} /> */}
            </div>

        </main>
    );
}

export default EcommerceMenDekker;