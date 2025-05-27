import React from 'react';
import styles from '../../styles/footer.module.scss';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <a
                target="_blank"
                rel="noopener noreferrer"
                href="http://farmerin.com.ar/"
                className={styles.link}
            >
                Farmerin División S.A. - © 2020
            </a>
        </footer>
    );
};

export default Footer;
