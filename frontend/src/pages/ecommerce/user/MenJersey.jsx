import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import styles from "../../../styles/ecommerce/user/MenJersey.module.css";
import RecentlyViewed from "../../../components/RecentlyViewed";

// Men Jersey Assets
import Jersey1 from '../../../assets/images/ecommerce/men/jersey-velocity-blue.png';
import Jersey2 from '../../../assets/images/ecommerce/men/jersey-strike-black.png';
import Jersey3 from '../../../assets/images/ecommerce/men/jersey-retro-cream.png';

// Spotlight / Recently Viewed Assets
import Socks from "../../../assets/images/ecommerce/socks-white-blue.png";
import Jersey from "../../../assets/images/ecommerce/jersey-black.png";
import TshirtBlue from "../../../assets/images/ecommerce/tshirt-blue.png";

function EcommerceMenJersey() {
    const [jerseyProducts, setJerseyProducts] = useState([]);
    const [recentProducts, setRecentProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState("default");
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

    const sortedProducts = [...jerseyProducts].sort((a, b) => {
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
        // fetch('http://localhost:5000/api/products?category=men-jersey')
        //     .then(res => res.json())
        //     .then(data => {
        //         setJerseyProducts(data.products);
        //         setIsLoading(false);
        //     })
        //     .catch(err => console.error(err));

        const fetchProductsData = async () => {
            try {
                // Simulasi delay loading API
                await new Promise((resolve) => setTimeout(resolve, 300));

                // Set Data Produk Jersey
                setJerseyProducts([
                    {
                        id: 1,
                        name: "Asterism Jersey - Classic Hard",
                        desc: "Medium size with durable hard material.",
                        price: "Rp129.900",
                        image: Jersey1 // shin guard putih
                    },
                    {
                        id: 2,
                        name: "Asterism Jersey - Soft Compact",
                        desc: "Small size with soft and comfortable material.",
                        price: "Rp119.900",
                        image: Jersey2 // knee pad hitam
                    },
                    {
                        id: 3,
                        name: "Asterism Jersey - Longform Hard",
                        desc: "Long size with strong and stable hard material.",
                        price: "Rp139.900",
                        image: Jersey3 // shin guard hitam panjang
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

    // Fungsi untuk melacak produk yang baru saja diklik/dilihat user
    const handleProductClick = (product) => {
        try {
            const existing = localStorage.getItem("recentlyViewed");
            let list = existing ? JSON.parse(existing) : [];

            // Hapus duplikat agar tidak muncul dua kali di list baru
            list = list.filter(item => item.id !== product.id);

            // Masukkan produk baru ke posisi paling depan
            list.unshift(product);

            // Batas maksimal 3 item 
            list = list.slice(0, 3);

            localStorage.setItem("recentlyViewed", JSON.stringify(list));

            // Update state agar data langsung berubah di layar secara real-time
            setRecentProducts(list);
        } catch (error) {
            console.error("Gagal memperbarui recently viewed:", error);
        }
    };

    return (
        <main className={styles.wrapper}>

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

            <div className={styles.container}>
                {/* 2. MAIN PRODUCTS SECTION (Men's Jersey) */}
                <section className={styles.productsSection} aria-labelledby="main-product-title">
                    <header className={styles.productsHeader}>
                        <h1 id="main-product-title">
                            Men’s Jersey
                            <span className={styles.count}>
                                ({isLoading ? "..." : jerseyProducts.length})
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
                {!isLoading && recentProducts.length > 0 && (
                    <RecentlyViewed products={recentProducts} />
                )}
            </div>

        </main>
    );
}

export default EcommerceMenJersey;