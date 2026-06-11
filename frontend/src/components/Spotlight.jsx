import { useNavigate } from "react-router-dom";

import styles from "../styles/Ecommerce/Spotlight.module.css";

import Dekker from "../assets/images/ecommerce/dekker.png";
import Socks from "../assets/images/ecommerce/socks-white-blue.png";
import Jersey from "../assets/images/ecommerce/jersey-black.png";
import TshirtBlue from "../assets/images/ecommerce/tshirt-blue.png";

export default function Spotlight() {
    const navigate = useNavigate();

    const spotlightItems = [
        {
        id: 1,
        title: "Dekker",
        image: Dekker,
        path: "/products/dekker",
        },
        {
        id: 2,
        title: "Socks",
        image: Socks,
        path: "/products/socks",
        },
        {
        id: 3,
        title: "Jersey",
        image: Jersey,
        path: "/products/jersey",
        },
        {
        id: 4,
        title: "T-Shirt",
        image: TshirtBlue,
        path: "/products/tshirt",
        },
    ];

    return (
        <section className={styles.spotlight}>
            <div className={styles.container}>
                <div className={styles.heading}>
                <h2>SPOTLIGHT</h2>

                <p>
                    Discover selected pieces from Asterism's
                    latest collection.
                </p>
                </div>

                <div className={styles.grid}>
                {spotlightItems.map((item) => (
                    <div
                    key={item.id}
                    className={styles.card}
                    onClick={() => navigate(item.path)}
                    >
                    <div className={styles.imageWrapper}>
                        <img
                        src={item.image}
                        alt={item.title}
                        />
                    </div>

                    <h3>{item.title}</h3>
                    </div>
                ))}
                </div>
            </div>
        </section>
    );
}