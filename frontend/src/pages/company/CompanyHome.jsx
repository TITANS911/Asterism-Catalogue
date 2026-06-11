import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from '../../styles/company/CompanyHome.module.css';

import banner1 from '../../assets/images/banner-company-1.png';
import banner2 from '../../assets/banner_company_2.png';
import discoverImg from "../../assets/images/section2-company-img.png";
import matImg from "../../assets/images/material-img.png";
import designImg from "../../assets/images/design-img.png";
import comfortImg from "../../assets/images/comfort-img.png";
import archive1 from "../../assets/images/archive1-img.png";
import archive2 from "../../assets/images/archive2-img.png";

const heroSlides = [
  { image: banner1 },
  { image: banner2 }
];

function CompanyHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

    const sectionRefs = useRef([]);
      const setRef = useCallback((index) => (el) => {
        if (el) sectionRefs.current[index] = el;
      }, []);

      // Scroll Reveal - VERSI PALING STABIL + LEBIH KUAT
      useEffect(() => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry, i) => {
              if (entry.isIntersecting) {
                // Delay antar section biar ada stagger effect
                setTimeout(() => {
                  entry.target.classList.add(styles.visible);
                }, i * 150); // efek muncul bertahap
              }
            });
          },
          { 
            threshold: 0.15,
            rootMargin: "0px 0px -80px 0px" 
          }
        );

        const timeoutId = setTimeout(() => {
          sectionRefs.current.forEach(section => {
            if (section) observer.observe(section);
          });
        }, 120);

        return () => {
          clearTimeout(timeoutId);
          observer.disconnect();
        };
      }, []);

  // Auto Slide Hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Back to Top
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll Reveal Animation - VERSI LEBIH STABIL
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { 
        threshold: 0.12,
        rootMargin: "0px 0px -80px 0px" 
      }
    );

    const timeoutId = setTimeout(() => {
      sectionRefs.current.forEach((section) => {
        if (section) observer.observe(section);
      });
    }, 150);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const faqData = [
    { question: "Apa bahan yang digunakan pada produk Asterism?", 
      answer: "Kami menggunakan bahan premium berkualitas tinggi yang nyaman, breathable, dan tahan lama untuk mendukung performa olahraga Anda." },
    { question: "Apakah bisa melakukan penukaran size?", 
      answer: "Ya, kami menyediakan penukaran size dalam waktu 7 hari setelah barang diterima dengan kondisi masih baru dan belum digunakan." },
    { question: "Apakah produk cocok untuk gym dan aktivitas harian?", 
      answer: "Sangat cocok. Produk Asterism dirancang untuk mendukung berbagai aktivitas, mulai dari gym, lari, hingga pemakaian sehari-hari." },
    { question: "Apakah Asterism melayani pengiriman seluruh Indonesia?", 
      answer: "Ya, kami melayani pengiriman ke seluruh Indonesia melalui partner logistik terpercaya." },
    { question: "Bagaimana cara melakukan pemesanan?", 
      answer: "Anda dapat memesan langsung melalui website ini dengan menambahkan produk ke keranjang dan melanjutkan ke checkout." },
    { question: "Bagaimana jika produk yang diterima rusak atau salah?", 
      answer: "Silakan hubungi customer service kami melalui chat admin dalam waktu 3 hari setelah barang diterima untuk proses pengembalian atau penukaran." }
  ];

  return (
    <div className={styles.container}>
      
      {/* HERO */}
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

      {/* Quote Section */}
      <section className={`${styles.quoteSection} ${styles.reveal}`}>
        <div className={styles.quoteContainer}>
          <div className={styles.quoteImage}>
            <img src={discoverImg} alt="Runner" />
          </div>
          <div className={styles.quoteTextContent}>
            <p className={styles.quoteText}>“Dibangun dari semangat,<br />berkembang melalui kualitas.”</p>
            <p className={styles.quoteDesc}>Asterism menghadirkan sport apparel modern yang menggabungkan performa, kenyamanan, dan style dalam setiap detail.</p>
            <a href="#" className={styles.discoverLink}>DISCOVER MORE →</a>
          </div>
        </div>
      </section>

      {/* Why Asterism */}
      <section id="about" className={`${styles.whySection} ${styles.reveal}`}>
        <h2 className={styles.sectionTitle}>Why Asterism</h2>
        <div className={styles.whyGrid}>
          <div className={styles.whyCard}>
            <img src={matImg} alt="Premium Materials" />
            <h3>Premium Materials</h3>
          </div>
          <div className={styles.whyCard}>
            <img src={designImg} alt="Modern Design" />
            <h3>Modern Design</h3>
          </div>
          <div className={styles.whyCard}>
            <img src={comfortImg} alt="Comfortable Fit" />
            <h3>Comfortable Fit</h3>
          </div>
        </div>
      </section>

      {/* From the Archive */}
      <section className={`${styles.archiveSection} ${styles.reveal}`}>
        <h2 className={styles.sectionTitle}>From the Archive</h2>
        <div className={styles.archiveGrid}>
          <div className={styles.archiveCard}>
            <img src={archive1} alt="Owner" />
            <h3>The Founder: Asterism's Original Innovator</h3>
            <p>Berawal dari ide, kreativitas, dan proses kolaborasi untuk membangun identitas Asterism hingga sekarang.</p>
          </div>
          <div className={styles.archiveCard}>
            <img src={archive2} alt="Behind the Stitch" />
            <h3>Behind the Stitch</h3>
            <p>Setiap detail dikerjakan dengan ketelitian dan dedikasi untuk menghadirkan kualitas dalam setiap produk Asterism.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={`${styles.faqSection} ${styles.reveal}`}>
        <div className={styles.faqHeader}>
          <h2>Pertanyaan Anda, Keahlian Kami.</h2>
          <p>Temukan jawaban untuk pertanyaan yang paling sering ditanyakan tentang produk dan layanan Asterism.</p>
        </div>
        <div className={styles.faqGrid}>
          {faqData.map((faq, index) => (
            <div 
              key={index}
              className={`${styles.faqItem} ${openFAQ === index ? styles.active : ''}`}
              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
            >
              <div className={styles.faqQuestion}>
                {faq.question}
                <span className={styles.faqIcon}>{openFAQ === index ? '−' : '+'}</span>
              </div>
              <div className={styles.faqAnswer}>{faq.answer}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Chat CTA */}
      <section className={`${styles.chatSection} ${styles.reveal}`}>
        <h2>Tidak menemukan apa yang Anda cari?</h2>
        <p>Tim kami siap memberikan jawaban yang sesuai dengan kebutuhan Anda.</p>
        <button onClick={() => window.open("https://wa.me/62812345678888888888", "_blank")} className={styles.chatButton}>
          💬 Chat dengan Admin
        </button>
      </section>
      

      {/* Back to Top */}
      {showBackToTop && (
        <button className={styles.backToTop} onClick={scrollToTop}>↑</button>
      )}
    </div>
  );
}

export default CompanyHome;