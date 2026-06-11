import React, { useState } from "react";
import styles from "../styles/Contact.module.css";

import emailIcon from "../assets/icons/icon-gmail-white.svg";
import phoneIcon from "../assets/icons/icon-call-white.svg";
import instagramIcon from "../assets/icons/icon-ig-white.svg";

export default function Contact() {
  // ==================== DATA KONTAK ====================
  const contactData = {
    email: "asterismsupport@gmail.com",
    phone: "+62 812 3456 7890",
    instagram: "asterism.id",
  };

  // ==================== FORM STATE ====================
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error'

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulasi pengiriman (ganti dengan fetch ke API nanti)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // simulasi delay

      console.log("Form Submitted:", formData);
      setSubmitStatus("success");

      // Reset form setelah berhasil
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.cardContact}>
        <div className={styles.cardTitle}>
          <h1>Contact Us</h1>
        </div>
        <div className={styles.cardText}>
          <p>
            Ada pertanyaan atau komentar? Silakan kirim pesan kepada kami!
          </p>
        </div>
      </div>

      <div className={styles.cardContent}>
        <aside className={styles.contactInfo}>
          <h2>Informasi Kontak</h2>

          <p className={styles.infoDesc}>
            Jika Anda memiliki pertanyaan atau masalah, Anda dapat menghubungi
            kami dengan mengisi formulir kontak, menelepon kami, mengikuti kami
            di media sosial, atau mengirimkan email langsung ke alamat berikut:
          </p>

          <div className={styles.infoItem}>
            <div className={styles.infoHeader}>
              <img src={phoneIcon} alt="phone" className={styles.infoIcon} />
              <p>{contactData.phone}</p>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoHeader}>
              <img src={emailIcon} alt="email" className={styles.infoIcon} />
              <p>{contactData.email}</p>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoHeader}>
              <img
                src={instagramIcon}
                alt="instagram"
                className={styles.infoIcon}
              />
              <p>{contactData.instagram}</p>
            </div>
          </div>
        </aside>

        <div className={styles.contactForm}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Nama</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan email"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Nomor Telepon</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Masukkan nomor telepon"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">Pesan</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                placeholder="Tulis pesan Anda"
                required
              ></textarea>
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Mengirim..." : "Kirim"}
            </button>

            {submitStatus === "success" && (
              <p className={`${styles.statusMessage} ${styles.statusSuccess}`}>
                Pesan Anda berhasil dikirim. Terima kasih.
              </p>
            )}
            {submitStatus === "error" && (
              <p className={`${styles.statusMessage} ${styles.statusError}`}>
                Gagal mengirim pesan. Silakan coba lagi.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
