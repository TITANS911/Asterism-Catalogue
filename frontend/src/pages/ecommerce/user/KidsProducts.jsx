import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import styles from "../../../styles/ecommerce/user/KidsProducts.module.css";
import Spotlight from "../../../components/Spotlight.jsx";

import banner1 from '../../../assets/images/banner-company-1.png';
import banner2 from '../../../assets/banner_company_2.png';

// Men Assets
import Small from '../../../assets/images/ecommerce/kids/img-small-size.png';
import Little from '../../../assets/images/ecommerce/kids/img-little-motion.png';
import Play from '../../../assets/images/ecommerce/kids/img-play.png';

// new arrivals assets
import NewArrivals1 from "../../../assets/images/ecommerce/new-arrivals1.png";
import NewArrivals2 from "../../../assets/images/ecommerce/new-arrivals2.png";
import NewArrivals3 from "../../../assets/images/ecommerce/new-arrivals3.png";

// spotlight assests
import Dekker from "../../../assets/images/ecommerce/dekker.png";
import Socks from "../../../assets/images/ecommerce/socks-white-blue.png";
import Jersey from "../../../assets/images/ecommerce/jersey-black.png";
import TshirtBlue from "../../../assets/images/ecommerce/tshirt-blue.png";


const heroSlides = [
    { image: banner1 },
    { image: banner2 }
];

function EcommerceKidsProducts() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Array untuk 3 Foto Besar Campaign Men (Sesuai Desain Baru)
    const kidsCampaigns = [
        { id: 1, title: "Asterism Football Presents", image: Small },
        { id: 2, title: "Run Essential", image: Little },
        { id: 3, title: "Easy Comfort", image: Play }
    ];

    // Array Produk New Arrivals (Sesuai Desain Baru)
    const newArrivalsProducts = [
        {
            id: 1, name: "Asterism Socks - Eclipse White",
            desc: "Clean and versatile sport socks designed for everyday comfort.",
            price: "Rp49.900", image: NewArrivals1
        },
        {
            id: 2, name: "Asterism Socks - Solar Yellow",
            desc: "Bold sport socks with a vibrant look and comfortable fit.",
            price: "Rp49.900", image: NewArrivals2
        },
        {
            id: 3, name: "Asterism Socks - Horizon Blue",
            desc: "Minimalist sport socks built for comfort and active movement.",
            price: "Rp49.900", image: NewArrivals3
        }
    ];

    // Auto slide logic (TIDAK DIUBAH)
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

    return (
        <main className={styles.wrapper}>

            {/* Hero Slider */}
            <section id="home" className={styles.hero}>
                {heroSlides.map((slide, index) => (
                    <div
                        key={index}
                        className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
                        style={{ backgroundImage: `url(${slide.image})` }}
                    >
                        <div className={styles.overlay}></div>
                        <div className={styles.heroContent}>
                            <div className={styles.heroButtons}>
                                <button className={styles.btnOutline}>Shop Now</button>
                                <button className={styles.btnRed}>Explore Collection</button>
                            </div>
                        </div>
                    </div>
                ))}

                <button className={styles.prevBtn} onClick={prevSlide}></button>
                <button className={styles.nextBtn} onClick={nextSlide}></button>

                <div className={styles.dots}>
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>
            </section>


            {/* 2. BANNER MERAH / CATEGORY BAR */}
            <nav className={styles.categoryBar} aria-label="Product Categories">
                <ul className={styles.categoryList}>
                    <li><a href="#new" className={styles.categoryLink}>New & Featured</a></li>
                    <Link to="/ecommerce/men" className={styles.categoryLink}>Man</Link>
                    <Link to="/ecommerce/women" className={styles.categoryLink}>Women</Link>
                    <Link to="/ecommerce/kids" className={`${styles.categoryLink} ${styles.activeCategory}`}>Kids</Link>
                    <li><Link to="/ecommerce/sale" className={styles.categoryLink}>Sale</Link></li>

                </ul>
            </nav>

            {/* 3. SECTION KIDS  */}
            <section className={styles.kidsSection}>
                <header className={styles.kidsHeader}>
                    <h1>Kids</h1>
                    <nav className={styles.subCategoryNav} aria-label="Kids Sub Categories">
                        <Link to="/ecommerce/kids/dekker" className={styles.subCategoryLink}>Dekker</Link>
                        <Link to="/ecommerce/kids/socks" className={styles.subCategoryLink}>Socks</Link>
                        <Link to="/ecommerce/kids/jersey" className={styles.subCategoryLink}>Jersey</Link>
                        <Link to="/ecommerce/kids/t-shirt" className={styles.subCategoryLink}>T-Shirt</Link>
                    </nav>
                </header>

                <div className={styles.campaignGrid}>
                    {kidsCampaigns.map((camp) => (
                        <article key={camp.id} className={styles.campaignCard}>
                            <div className={styles.campaignImageWrapper}>
                                <img src={camp.image} alt={camp.title} />
                            </div>
                            <h2>{camp.title}</h2>
                            <button className={styles.shopBtn}>Shop</button>
                        </article>
                    ))}
                </div>
            </section>

            {/* 4. NEW ARRIVALS SECTION */}
            <section className={styles.newArrivalsSection}>
                <header className={styles.sectionHeader}>
                    <h1>New Arrivals</h1>
                </header>

                <div className={styles.productsGrid}>
                    {newArrivalsProducts.map((product) => (
                        <article key={product.id} className={styles.productCard}>
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
            </section>

            {/* 5. SPOTLIGHT SECTION */}
            <Spotlight />

        </main>
    );
}

export default EcommerceKidsProducts;