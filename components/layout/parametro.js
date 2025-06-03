import React, { useContext } from 'react';
import { FirebaseContext } from '../../firebase2';
import Link from 'next/link';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
   RiArrowDownLine,
   RiArrowUpLine,
   RiDeleteBin2Line,
   RiSubtractLine,
   RiEdit2Line,
} from 'react-icons/ri';

import styles from '../../styles/Parametro.module.scss';

const Parametro = ({ parametro, parametros, guardarParametros }) => {
   const { id, orden, condicion, min, max, um, racion } = parametro;
   const { firebase } = useContext(FirebaseContext);

   const handleDown = () => {
      const actualizados = parametros.map(p => {
         if (p.id === id) {
            p.orden += 1;
            firebase.db.collection('parametro').doc(p.id).update(p);
         } else if (p.orden === orden + 1) {
            p.orden -= 1;
            firebase.db.collection('parametro').doc(p.id).update(p);
         }
         return p;
      }).sort((a, b) => a.orden - b.orden);
      guardarParametros(actualizados);
   };

   const handleUp = () => {
      const actualizados = parametros.map(p => {
         if (p.id === id) {
            p.orden -= 1;
            firebase.db.collection('parametro').doc(p.id).update(p);
         } else if (p.orden === orden - 1) {
            p.orden += 1;
            firebase.db.collection('parametro').doc(p.id).update(p);
         }
         return p;
      }).sort((a, b) => a.orden - b.orden);
      guardarParametros(actualizados);
   };

   const eliminarParam = () => {
      firebase.db.collection('parametro').doc(id).delete();
      const filtrados = parametros
         .filter(p => p.id !== id)
         .map((p, i) => {
            p.orden = i + 1;
            firebase.db.collection('parametro').doc(p.id).update(p);
            return p;
         });
      guardarParametros(filtrados);
   };

   return (
      <>
         <tr className={styles.filaParametro}>
            <td className={styles.columna}><strong>{orden}</strong></td>
            <td className={styles.columna}>{condicion}</td>
            <td className={styles.columna}>{min}</td>
            <td className={styles.columna}>{max}</td>
            <td className={styles.columna}>{um}</td>
            <td className={styles.columna}>{racion} kg</td>
            <td className={styles.colAcciones}>
               <div className={styles.tooltipWrapper}>
                  <Link href={`/parametros/${id}`} passHref>
                     <Button as="a" variant="outline-success" size="sm" className={styles.iconBtnEdit}>
                        <RiEdit2Line />
                     </Button>
                  </Link>
                  <span className={styles.tooltipText}>Editar</span>
               </div>

               <div className={styles.tooltipWrapper}>
                  <Button variant="outline-danger" size="sm" onClick={eliminarParam} className={styles.iconBtnElim}>
                     <RiDeleteBin2Line />
                  </Button>
                  <span className={styles.tooltipText}>Eliminar</span>
               </div>

               {orden !== 1 ? (
                  <div className={styles.tooltipWrapper}>
                     <Button variant="outline-primary" size="sm" onClick={handleUp} className={styles.iconBtnSubir}>
                        <RiArrowUpLine />
                     </Button>
                     <span className={styles.tooltipText}>Mover hacia arriba</span>
                  </div>
               ) : (
                  <div className={styles.tooltipWrapper}>
                     <Button variant="outline-secondary" size="sm" disabled className={styles.iconBtnStop}>
                        <RiSubtractLine />
                     </Button>
                     <span className={styles.tooltipText}>No se puede subir</span>
                  </div>
               )}

               {orden !== parametros.length ? (
                  <div className={styles.tooltipWrapper}>
                     <Button variant="outline-primary" size="sm" onClick={handleDown} className={styles.iconBtnBajar}>
                        <RiArrowDownLine />
                     </Button>
                     <span className={styles.tooltipText}>Bajar</span>
                  </div>
               ) : (
                  <div className={styles.tooltipWrapper}>
                     <Button variant="outline-secondary" size="sm" disabled className={styles.iconBtnStop}>
                        <RiSubtractLine />
                     </Button>
                     <span className={styles.tooltipText}>No se puede bajar</span>
                  </div>
               )}
            </td>

         </tr>
      </>

   );
};

export default Parametro;
