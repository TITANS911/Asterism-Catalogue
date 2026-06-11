import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import styles from "../../../styles/ecommerce/user/WomenProducts.module.css";
import Spotlight from "../../../components/Spotlight.jsx";

import banner1 from '../../../assets/images/banner-company-1.png';
import banner2 from '../../../assets/banner_company_2.png';


import Soft from "../../../assets/images/ecommerce/women/img-everyday.png";
import Everyday from "../../../assets/images/ecommerce/women/img-move.png";
import Move from "../../../assets/images/ecommerce/women/img-soft.png";

import Bluemist from "../../../assets/images/ecommerce/socks/socks-bluemist.png";
import Mosseline from "../../../assets/images/ecommerce/socks/socks-mosseline.png";
import Rougewave from "../../../assets/images/ecommerce/socks/socks-rougewave.png";


const heroSlides = [
    { image: banner1 },
    { image: banner2 }
];

function EcommerceWomenProducts() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Array untuk 3 Foto Besar Campaign Women   (Sesuai Desain Baru)
    const womenCampaigns = [
        { id: 1, title: "Asterism Football Presents", image: Soft },
        { id: 2, title: "Run Essential", image: Everyday },
        { id: 3, title: "Easy Comfort", image: Move }
    ];

    // Array Produk New Arrivals (Sesuai Desain Baru)
    const newArrivalsProducts = [
        {
            id: 1, name: "Asterism Socks - Bluemist Green", desc: "Clean and versatile sport socks designed for everyday comfort.",
            price: "Rp49.900", image: Bluemist
        },
        {
            id: 2, name: "Asterism Socks - Mosseline Blue", desc: "Bold sport socks with a vibrant look and comfortable fit.",
            price: "Rp49.900", image: Mosseline
        },
        {
            id: 3, name: "Asterism Socks - Rougewave Red", desc: "Minimalist sport socks built for comfort and active movement.",
            price: "Rp49.900", image: Rougewave
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
                    {/* <li><a href="#men" className={`${styles.categoryLink} ${styles.activeCategory}`}>Men</a></li> */}
                    <Link to="/ecommerce/men" className={styles.categoryLink}>Man</Link>
                    <Link to="/ecommerce/women" className={`${styles.categoryLink} ${styles.activeCategory}`}>Women</Link>
                    <Link to="/ecommerce/kids" className={styles.categoryLink}>Kids</Link>
                    <li><Link to="/ecommerce/sale" className={styles.categoryLink}>Sale</Link></li>
                </ul>
            </nav>

            {/* 3. SECTION WOMEN  */}
            <section className={styles.womenSection}>
                <header className={styles.womenHeader}>
                    <h1>Women</h1>
                    <nav className={styles.subCategoryNav} aria-label="Women Sub Categories">
                        <Link to="/ecommerce/women/dekker" className={styles.subCategoryLink}>Dekker</Link>
                        <Link to="/ecommerce/women/socks" className={styles.subCategoryLink}>Socks</Link>
                        <Link to="/ecommerce/women/jersey" className={styles.subCategoryLink}>Jersey</Link>
                        <Link to="/ecommerce/women/t-shirt" className={styles.subCategoryLink}>T-Shirt</Link>
                    </nav>
                </header>

                <div className={styles.campaignGrid}>
                    {womenCampaigns.map((camp) => (
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

export default EcommerceWomenProducts;
