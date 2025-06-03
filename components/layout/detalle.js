import React from 'react';
import styles from '../../styles/CargarControlFarmer.module.scss';

const Detalle = ({ info }) => {
  return (
    <div className={styles.alertaItem}>
      {info}
    </div>
  );
};

export default Detalle;
