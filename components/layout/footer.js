import React from 'react';
import styles from '../../styles/footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <a
          href="https://farmerin.com.ar/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Farmerin División S.A. © {new Date().getFullYear()}
        </a>
        <span className={styles.separator}>|</span>
        <a
          href="https://ultraidi.com.ar/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Ultra I+D
        </a>
      </div>
    </footer>
  );
};

export default Footer;
