import React from "react";

import Mainimg from "../../assets/images/main_img_about.png";
import Aboutimg from "../../assets/images/about_img.png";
import Visiimg from "../../assets/images/vision_img.png";
import Missionimg from "../../assets/images/mission_img.png";

import style from "../../styles/company/CompanyAbout.module.css";

export default function About() {
  return (
    <main className={style.aboutPage}>

      {/* HERO IMAGE */}
      <section className={style.heroSection}>
        <figure className={style.heroImage}>
          <img src={Mainimg} alt="Main Banner" />
        </figure>
      </section>

      {/* ABOUT */}
      <section className={style.aboutSection}>
        <article className={style.aboutContent}>
          <h1>ABOUT ASTERISM CORPORATION</h1>
          <p>
            Dirancang sejak 2023 dan mulai berkembang pada 2025,
            Asterism lahir dari ketertarikan terhadap dunia olahraga
            dan fashion modern. Dengan fokus pada jersey, sport socks,
            dan t-shirt, kami menghadirkan produk yang dirancang untuk
            mendukung aktivitas dan gaya hidup aktif.

            Lorem Ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
            occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </p>
        </article>

        <figure className={style.aboutImage}>
          <img src={Aboutimg} alt="About Asterism" />
        </figure>

      </section>

      {/* VISION */}
      <section className={style.visionSection}>

        <article className={style.visionContent}>
          <h2>VISION ASTERISM</h2>

          <p>
            Menjadi brand sport apparel modern yang menghadirkan kualitas,
            kenyamanan, dan style untuk mendukung gaya hidup aktif.
          </p>
        </article>

        <figure className={style.visionImage}>
          <img src={Visiimg} alt="Vision Asterism" />
        </figure>

      </section>

      {/* MISSION */}
      <section className={style.missionSection}>

        <figure className={style.missionImage}>
          <img src={Missionimg} alt="Mission Asterism" />
        </figure>

        <article className={style.missionContent}>
          <h2>MISSION ASTERISM</h2>

          <ol>
            <li>
              Menghadirkan produk sport apparel berkualitas
              dengan desain modern.
            </li>

            <li>
              Mengutamakan kenyamanan dan performa
              dalam setiap produk.
            </li>

            <li>
              Memberikan pengalaman terbaik bagi pelanggan
              melalui kualitas dan pelayanan.
            </li>

            <li>
              Terus berkembang dan berinovasi mengikuti tren
              olahraga dan lifestyle.
            </li>
          </ol>
        </article>

      </section>

    </main>
  );
}