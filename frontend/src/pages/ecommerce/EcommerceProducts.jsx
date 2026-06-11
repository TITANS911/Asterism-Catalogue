import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import styles from "../../styles/ecommerce/EcommerceProducts.module.css";
import CategoryNav from "../../components/CategoryNav";
import {
  API_URL,
  getProductImageUrl,
  mapApiProductToCard,
} from "../../utils/productUtils";

import banner1 from "../../assets/images/banner-company-1.png";
import banner2 from "../../assets/banner_company_2.png";

import PlayerBlue from "../../assets/images/ecommerce/player-blue.png";
import JerseyBlue from "../../assets/images/ecommerce/jersey-blue-img.png";
import SocksGreen from "../../assets/images/ecommerce/socks-green-img.png";

// new arrivals assets

// spotlight assests
import Dekker from "../../assets/images/ecommerce/dekker.png";
import Socks from "../../assets/images/ecommerce/socks-white-blue.png";
import Jersey from "../../assets/images/ecommerce/jersey-black.png";
import TshirtBlue from "../../assets/images/ecommerce/tshirt-blue.png";

const heroSlides = [{ image: banner1 }, { image: banner2 }];
const fallbackFeaturedCards = [
  {
    id: "fallback-jersey",
    categoryId: null,
    eyebrow: "Football Mania Club",
    title: "JERSEY",
    image: JerseyBlue,
  },
  {
    id: "fallback-socks",
    categoryId: null,
    eyebrow: "Football Mania Club",
    title: "SOCKS",
    image: SocksGreen,
  },
];

function EcommerceProducts() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredCategories, setFeaturedCategories] = useState(
    fallbackFeaturedCards,
  );
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true);
  const [currentArrival, setCurrentArrival] = useState(0);
  const [arrivalMaxIndex, setArrivalMaxIndex] = useState(0);
  const arrivalSliderRef = useRef(null);
  const isCompanyPreview = location.pathname === "/company/products";
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );

  const canSlideArrival = !isFeaturedLoading && arrivalMaxIndex > 0;

  const goToPrevArrival = () => {
    const slider = arrivalSliderRef.current;
    if (!slider) return;

    const firstSlide = slider.querySelector(`.${styles.arrivalSlide}`);
    if (!firstSlide) return;

    const gap = parseFloat(window.getComputedStyle(slider).gap || "0");
    const stepWidth = firstSlide.getBoundingClientRect().width + gap;
    slider.scrollBy({ left: -stepWidth, behavior: "smooth" });
  };

  const goToNextArrival = () => {
    const slider = arrivalSliderRef.current;
    if (!slider) return;

    const firstSlide = slider.querySelector(`.${styles.arrivalSlide}`);
    if (!firstSlide) return;

    const gap = parseFloat(window.getComputedStyle(slider).gap || "0");
    const stepWidth = firstSlide.getBoundingClientRect().width + gap;
    slider.scrollBy({ left: stepWidth, behavior: "smooth" });
  };

  const requireLoginBeforeAccess = () => {
    if (isCompanyPreview && !isLoggedIn) {
      navigate("/ecommerce/login");
      return true;
    }

    return false;
  };

  const handleFeaturedCategoryShopNow = (category) => {
    if (requireLoginBeforeAccess()) {
      return;
    }

    const targetUrl = category.categoryId
      ? `/ecommerce/sale?category=${category.categoryId}`
      : "/ecommerce/sale";

    navigate(targetUrl);
  };

  const handleNewArrivalClick = (product) => {
    if (requireLoginBeforeAccess()) {
      return;
    }

    navigate(`/ecommerce/sale/${product.id}`, { state: { product } });
  };

  useEffect(() => {
    const updateArrivalMetrics = () => {
      const slider = arrivalSliderRef.current;
      if (!slider) return;

      const firstSlide = slider.querySelector(`.${styles.arrivalSlide}`);
      if (!firstSlide) {
        setCurrentArrival(0);
        setArrivalMaxIndex(0);
        return;
      }

      const gap = parseFloat(window.getComputedStyle(slider).gap || "0");
      const stepWidth = firstSlide.getBoundingClientRect().width + gap;
      const maxScroll = Math.max(0, slider.scrollWidth - slider.clientWidth);
      const maxIndex = stepWidth > 0 ? Math.round(maxScroll / stepWidth) : 0;

      setArrivalMaxIndex(maxIndex);
      setCurrentArrival((prev) => Math.min(prev, maxIndex));
    };

    updateArrivalMetrics();
    window.addEventListener("resize", updateArrivalMetrics);

    return () => window.removeEventListener("resize", updateArrivalMetrics);
  }, [featuredProducts, styles.arrivalSlide]);

  useEffect(() => {
    const slider = arrivalSliderRef.current;
    if (!slider) return undefined;

    const handleScroll = () => {
      const firstSlide = slider.querySelector(`.${styles.arrivalSlide}`);
      if (!firstSlide) return;

      const gap = parseFloat(window.getComputedStyle(slider).gap || "0");
      const stepWidth = firstSlide.getBoundingClientRect().width + gap;
      if (stepWidth <= 0) return;

      const nextIndex = Math.round(slider.scrollLeft / stepWidth);
      setCurrentArrival(Math.min(nextIndex, arrivalMaxIndex));
    };

    slider.addEventListener("scroll", handleScroll, { passive: true });
    return () => slider.removeEventListener("scroll", handleScroll);
  }, [arrivalMaxIndex, styles.arrivalSlide]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setIsFeaturedLoading(true);
        const response = await fetch(
          `${API_URL}/products?status=active&limit=10000&_ts=${Date.now()}`,
          { cache: "no-store" },
        );
        const result = await response.json();

        if (result.success && result.data?.products) {
          const featured = result.data.products
            .filter(
              (p) =>
                p.is_featured === true ||
                p.is_featured === 1 ||
                p.is_featured === "1" ||
                p.is_featured === "true",
            )
            .map(mapApiProductToCard);
          setFeaturedProducts(featured);
        } else {
          setFeaturedProducts([]);
        }
      } catch (error) {
        console.error("Gagal memuat featured products:", error);
        setFeaturedProducts([]);
      } finally {
        setIsFeaturedLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  useEffect(() => {
    const fetchFeaturedCategories = async () => {
      try {
        const response = await fetch(
          `${API_URL}/products/categories?_ts=${Date.now()}`,
          { cache: "no-store" },
        );
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const latestFeaturedCategories = result.data
            .filter(
              (category) =>
                !category.parent_id &&
                category.status === "active" &&
                (category.is_featured === true ||
                  category.is_featured === 1 ||
                  category.is_featured === "1" ||
                  category.is_featured === "true"),
            )
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
            )
            .slice(0, 2)
            .map((category, index) => ({
              id: `category-${category.id}`,
              categoryId: category.id,
              eyebrow: "Featured Category",
              title: String(category.name || "").toUpperCase(),
              image:
                getProductImageUrl(category) ||
                fallbackFeaturedCards[index]?.image,
            }));

          const mergedCards = [
            ...latestFeaturedCategories,
            ...fallbackFeaturedCards.slice(latestFeaturedCategories.length),
          ].slice(0, 2);

          setFeaturedCategories(mergedCards);
        }
      } catch (error) {
        console.error("Gagal memuat featured categories:", error);
      }
    };

    fetchFeaturedCategories();
  }, []);

  return (
    <div className={styles.wrapper}>
      {/* Hero Slider */}
      <section id="home" className={styles.hero}>
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`${styles.slide} ${index === currentSlide ? styles.active : ""}`}
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

        <div className={styles.dots}>
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ""}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* ==================== 2. GABUNGAN: SUMMER SALE BANNER & RED BAR NAVIGATION ==================== */}
      <div className={styles.saleSectionWrapper}>
        <div className={styles.saleBannerContainer}>
          {/* Foto Pemain Menempel di Kiri */}
          <div className={styles.playerWrapper}>
            <img src={PlayerBlue} alt="Player" className={styles.playerImage} />
          </div>

          {/* Area Jajaran Genjang */}
          <div className={styles.mainSlantedBanner}>
            {/* Jajaran Genjang Putih */}
            <div className={styles.whiteBlock}>
              <p className={styles.clearanceText}>SUMMER CLEARANCE</p>
              <h2 className={styles.saleText}>SALE!</h2>
            </div>

            {/* Jajaran Genjang Hitam */}
            <div className={styles.blackBlock}>
              {/* Jajaran Genjang Merah (Tombol) */}
              <Link
                to={
                  isCompanyPreview && !isLoggedIn
                    ? "/ecommerce/login"
                    : "/ecommerce/sale"
                }
                className={styles.orderNowBtn}
              >
                ORDER NOW!
              </Link>
            </div>
          </div>
        </div>

        {/* ==================== 3. MAIN NAVIGATION ==================== */}
        {/* Menu Navigasi Merah tepat di bawah Jajaran Genjang */}
        <CategoryNav activeCategory="new" />
      </div>

      {/* ==================== FEATURED ==================== */}
      <section className={styles.featured}>
        <h2>Featured</h2>

        <div className={styles.featuredGrid}>
          {featuredCategories.map((category) => (
            <div key={category.id} className={styles.featuredCard}>
              <img src={category.image} alt={category.title} />
              <div className={styles.featuredOverlay}></div>
              <div className={styles.featuredContent}>
                <p>{category.eyebrow}</p>
                <h3>{category.title}</h3>
                <button
                  className={styles.shopBtn}
                  type="button"
                  onClick={() => handleFeaturedCategoryShopNow(category)}
                >
                  SHOP NOW
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== NEW ARRIVALS SLIDER ==================== */}
      <section className={styles.newArrivals}>
        <div className={styles.arrivalHeader}>
          <h2>New Arrivals</h2>
        </div>

        <div className={styles.arrivalSliderContainer}>
          <div className={styles.arrivalSliderWrapper}>
            <div ref={arrivalSliderRef} className={styles.arrivalSlider}>
              {isFeaturedLoading ? (
                <div className={styles.arrivalSlide}>
                  <div className={styles.arrivalCard}>
                    <span>Loading...</span>
                  </div>
                </div>
              ) : featuredProducts.length === 0 ? (
                <div className={styles.arrivalSlide}>
                  <div className={styles.arrivalCard}>
                    <span>No featured products</span>
                  </div>
                </div>
              ) : (
                featuredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={styles.arrivalSlide}
                    onClick={() => handleNewArrivalClick(product)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleNewArrivalClick(product);
                      }
                    }}
                  >
                    <div className={styles.arrivalCard}>
                      {product.image ? (
                        <img src={product.image} alt={product.name} />
                      ) : (
                        <span>No Image</span>
                      )}
                    </div>
                    <h4>{product.name}</h4>
                    <p>{product.desc}</p>
                    <p className={styles.price}>{product.price}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {canSlideArrival && (
          <div className={styles.arrivalControls}>
            <button
              type="button"
              aria-label="Previous slide"
              className={`${styles.arrivalControlBtn} ${styles.arrivalBottomBtn}`}
              onClick={goToPrevArrival}
            >
              &#8249;
            </button>

            <div className={styles.arrivalProgressWrap}>
              <div className={styles.arrivalProgressTrack}>
                <div
                  className={styles.arrivalProgressFill}
                  style={{
                    width: `${100 / (arrivalMaxIndex + 1)}%`,
                    transform: `translateX(${currentArrival * 100}%)`,
                  }}
                />
              </div>

              <div className={styles.arrivalIndicators}>
                {Array.from({ length: arrivalMaxIndex + 1 }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Go to slide ${index + 1}`}
                    className={`${styles.arrivalIndicator} ${
                      index === currentArrival
                        ? styles.arrivalIndicatorActive
                        : ""
                    }`}
                    onClick={() => {
                      const slider = arrivalSliderRef.current;
                      const firstSlide = slider?.querySelector(
                        `.${styles.arrivalSlide}`,
                      );
                      if (!slider || !firstSlide) return;

                      const gap = parseFloat(
                        window.getComputedStyle(slider).gap || "0",
                      );
                      const stepWidth =
                        firstSlide.getBoundingClientRect().width + gap;

                      slider.scrollTo({
                        left: index * stepWidth,
                        behavior: "smooth",
                      });
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              aria-label="Next slide"
              className={`${styles.arrivalControlBtn} ${styles.arrivalBottomBtn}`}
              onClick={goToNextArrival}
            >
              &#8250;
            </button>
          </div>
        )}
      </section>

      {/* ==================== SPOTLIGHT ==================== */}
      <section className={styles.spotlight}>
        <div className={styles.spotlightContainer}>
          <h2>SPOTLIGHT</h2>
          <p>Discover selected pieces from Asterism's latest collection.</p>

          <div className={styles.spotlightGrid}>
            <div className={styles.spotlightItem}>
              <div>
                <img src={Dekker} alt="Dekker" />
              </div>
              <p>Dekker</p>
            </div>
            <div className={styles.spotlightItem}>
              <div>
                <img src={Socks} alt="Socks" />
              </div>
              <p>Socks</p>
            </div>
            <div className={styles.spotlightItem}>
              <div>
                <img src={Jersey} alt="Jersey" />
              </div>
              <p>Jersey</p>
            </div>
            <div className={styles.spotlightItem}>
              <div>
                <img src={TshirtBlue} alt="T-Shirt" />
              </div>
              <p>T-Shirt</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EcommerceProducts;
