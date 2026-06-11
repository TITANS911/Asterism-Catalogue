import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import styles from "../../../styles/ecommerce/user/MenSocks.module.css";
import RecentlyViewed from "../../../components/RecentlyViewed";

// Import Gambar Socks
import Socks1 from "../../../assets/images/ecommerce/socks-white-blue.png";
import Socks2 from "../../../assets/images/ecommerce/men/socks-classic-hard.png";
import Socks3 from "../../../assets/images/ecommerce/new-arrivals1.png";

function EcommerceMenSocks() {
    const [socksProducts, setSocksProducts] = useState([]);
    const [recentProducts, setRecentProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState("default");
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

    // Sorting Logic
    const sortedProducts = [...socksProducts].sort((a, b) => {
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
        return a.id - b.id; // Default
    });

    useEffect(() => {
        const fetchProductsData = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 300));

                setSocksProducts([
                    {
                        id: 1,
                        name: "Asterism Socks - Eclipse White",
                        desc: "Clean and versatile sport socks designed for everyday comfort.",
                        price: "Rp49.900",
                        image: Socks1
                    },
                    {
                        id: 2,
                        name: "Asterism Socks - Solar Yellow",
                        desc: "Bold sport socks with a vibrant look and comfortable fit.",
                        price: "Rp49.900",
                        image: Socks2
                    },
                    {
                        id: 3,
                        name: "Asterism Socks - Horizon Blue",
                        desc: "Modern athletic socks built for comfort and active movement.",
                        price: "Rp49.900",
                        image: Socks3
                    },
                    {
                        id: 4,
                        name: "Asterism Socks - Midnight Black",
                        desc: "Minimalist sport socks with a sleek and timeless design.",
                        price: "Rp49.900",
                        image: Socks1   // Ganti dengan gambar hitam jika sudah ada
                    }
                ]);

                // Recently Viewed dari localStorage
                const storedRecentlyViewed = localStorage.getItem("recentlyViewed");
                if (storedRecentlyViewed) {
                    setRecentProducts(JSON.parse(storedRecentlyViewed));
                } else {
                    setRecentProducts([
                        {
                            id: 101,
                            name: "Asterism Socks - Eclipse White",
                            desc: "Clean and versatile sport socks designed for everyday comfort.",
                            price: "Rp49.900",
                            image: Socks1
                        },
                        {
                            id: 102,
                            name: "Asterism Jersey - Strike Black",
                            desc: "Modern dark-tone jersey with strong athletic vibes.",
                            price: "Rp189.900",
                            image: Socks2   // sementara
                        },
                        {
                            id: 103,
                            name: "Asterism T-Shirt - Eclipse Black",
                            desc: "Minimalist t-shirt with a timeless streetwear style.",
                            price: "Rp99.900",
                            image: Socks3   // sementara
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

            <div className={styles.blackHeaderSpacer}></div>

            {/* CATEGORY BAR MERAH */}
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
                {/* PRODUCTS SECTION */}
                <section className={styles.productsSection} aria-labelledby="main-product-title">
                    <header className={styles.productsHeader}>
                        <h1 id="main-product-title">
                            Men’s Socks
                            <span className={styles.count}>
                                ({isLoading ? "..." : socksProducts.length})
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
                        <div className={styles.loading}>Loading products...</div>
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

                {/* RECENTLY VIEWED */}
                {!isLoading && recentProducts.length > 0 && (
                    <RecentlyViewed products={recentProducts} />
                )}
            </div>

            {/* RECENTLY VIEWED SECTION */}
            {/* <section className={styles.recentlyViewedSection}>
                <h2 className={styles.sectionTitle}>Recently You View</h2>
                <RecentlyViewed products={recentProducts} />
            </section> */}


        </main>
    );
}

export default EcommerceMenSocks;

