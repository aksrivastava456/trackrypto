import styles from "./Footer.module.css";

const Footer = () => (
  <footer className={styles.footer}>
    <div className="container text-center py-3">
      <span className={styles.text}>
        © {new Date().getFullYear()} Trackrypto. All rights reserved.
      </span>
    </div>
  </footer>
);

export default Footer;
