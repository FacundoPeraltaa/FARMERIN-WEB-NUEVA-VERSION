// src/components/Parametros.js
import React, { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { FirebaseContext } from '../firebase2';
import Layout from '../components/layout/layout';
import DetalleParametro from '../components/layout/detalleParametro';
import SelectTambo from '../components/layout/selectTambo';
import { Button, DropdownButton, Dropdown, Row, Col, } from 'react-bootstrap';
import { format } from 'date-fns';
import { addNotification } from '../redux/notificacionSlice';
import styles from '../styles/Parametro.module.scss'


const Parametros = () => {
  const [valor, setValor] = useState(0);
  const { firebase, setPorc, tamboSel } = useContext(FirebaseContext);
  const [selectedChange, setSelectedChange] = useState(null);
  const [isIncrease, setIsIncrease] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (tamboSel) {
      obtenerPorcentaje();
    }
  }, [tamboSel]);

  const obtenerPorcentaje = async () => {
    try {
      const snapshot = await firebase.db.collection('tambo').doc(tamboSel.id).get();
      snapshotParametros(snapshot);
    } catch (error) {
      console.log(error);
    }
  };

  function snapshotParametros(snapshot) {
    setValor(snapshot.data().porcentaje);
  }

  const handleApplyChange = async () => {
    if (selectedChange === null || !tamboSel) return;

    let nuevoPorcentaje = selectedChange;
    let porcentajeAnimal = 1 + nuevoPorcentaje / 100;

    if (nuevoPorcentaje > 100) nuevoPorcentaje = 100;
    if (nuevoPorcentaje < -50) nuevoPorcentaje = -50;

    let p = { porcentaje: nuevoPorcentaje };
    let pAnimal = { porcentaje: porcentajeAnimal };

    setPorc(nuevoPorcentaje);

    try {
      await firebase.db.collection('tambo').doc(tamboSel.id).update(p);

      // Obtener la colección de animales
      const animalesSnapshot = await firebase.db.collection('animal').where('tamboId', '==', tamboSel.id).get();

      animalesSnapshot.forEach(async (doc) => {
        const animalData = doc.data();
        if (!animalData.fbaja && !animalData.mbaja) {
          await firebase.db.collection('animal').doc(doc.id).update(pAnimal);
        }
      });

      // Agregar notificación en Firestore
      await firebase.db.collection('tambo').doc(tamboSel.id).collection('notificaciones').add({
        mensaje: isIncrease ? `AUMENTO DEL ${selectedChange} %` : `REDUCCIÓN DEL ${selectedChange} %`,
        fecha: firebase.nowTimeStamp(),
      });

      // Agregar notificación en Redux
      dispatch(addNotification({
        id: Date.now(),
        mensaje: isIncrease ? `AUMENTO DEL ${selectedChange} %` : `REDUCCIÓN DEL ${selectedChange} %`,
        fecha: firebase.nowTimeStamp(),
      }));

      console.log(tamboSel);
    } catch (error) {
      console.log(error);
    }
    setValor(nuevoPorcentaje);
    setSelectedChange(null);
  };

  const restablecer = async () => {
    if (tamboSel) {
      setValor(0);
      let p = { porcentaje: 0 };  // Para la colección 'tambo'
      let pAnimal = { porcentaje: 1 };  // Para la colección 'animal'

      try {
        // Actualizar el porcentaje en la colección 'tambo'
        await firebase.db.collection('tambo').doc(tamboSel.id).update(p);

        // Obtener la colección de animales
        const animalesSnapshot = await firebase.db.collection('animal').where('tamboId', '==', tamboSel.id).get();

        animalesSnapshot.forEach(async (doc) => {
          const animalData = doc.data();
          if (!animalData.fbaja && !animalData.mbaja) {
            await firebase.db.collection('animal').doc(doc.id).update(pAnimal);
          }
        });

        // Agregar notificación en Firestore
        await firebase.db.collection('tambo').doc(tamboSel.id).collection('notificaciones').add({
          mensaje: 'SE VOLVIÓ AL VALOR ORIGINAL DE LA RACIÓN.',
          fecha: firebase.nowTimeStamp(),
        });

        // Agregar notificación en Redux
        dispatch(addNotification({
          id: Date.now(),
          mensaje: 'SE VOLVIÓ AL VALOR ORIGINAL DE LA RACIÓN.',
          fecha: firebase.nowTimeStamp(),
        }));

        console.log('se ejecutó y se agregó la notificación');
      } catch (error) {
        console.log(error);
      }
    }
  };

  let porcentaje;

  if (valor === 10) porcentaje = 1.1;
  else if (valor === 20) porcentaje = 1.2;
  else if (valor === 30) porcentaje = 1.3;
  else if (valor === 40) porcentaje = 1.4;
  else if (valor === 50) porcentaje = 1.5;
  else if (valor === 60) porcentaje = 1.6;
  else if (valor === 70) porcentaje = 1.7;
  else if (valor === 80) porcentaje = 1.8;
  else if (valor === 90) porcentaje = 1.9;
  else if (valor === 100) porcentaje = 2;
  else if (valor === -10) porcentaje = 0.9;
  else if (valor === -20) porcentaje = 0.8;
  else if (valor === -30) porcentaje = 0.7;
  else if (valor === -40) porcentaje = 0.6;
  else if (valor === -50) porcentaje = 0.5;
  else if (valor === 0) porcentaje = 1;

  return (
    <Layout titulo="Parámetros Nutricionales">
      <div className={styles.container}>
        <h1 className={styles.titulo}>🥩 Alimentación</h1>

        <div className={styles.estadoActual}>
          <span className={styles.estadoLabel}>Estado actual:</span>
          <span className={styles.estadoValor}>
            {valor === 0
              ? "Por defecto"
              : valor < 0
                ? `Reducción del ${valor}%`
                : `Aumento del ${valor}%`}
          </span>
        </div>

        <div className={styles.bloqueBotones}>
          <DropdownButton
            id="dropdown-aumentar-button"
            title={
              isIncrease && selectedChange !== null
                ? `Aumento: ${selectedChange}%`
                : "Seleccionar Aumento"
            }
            className={`${styles.dropdownAumentarButton} ${styles.dropdownEstilo}`}
            variant=""
            onSelect={(e) => {
              setSelectedChange(parseInt(e));
              setIsIncrease(true);
            }}
          >
            {["10", "20", "30", "40", "50", "60", "70", "80", "90", "100"].map(
              (p) => (
                <Dropdown.Item key={p} eventKey={p}>
                  {p}%
                </Dropdown.Item>
              )
            )}
          </DropdownButton>

          <Button className={styles.botonRestablecer} onClick={restablecer}>
            Restablecer
          </Button>

          <DropdownButton
            id="dropdown-reducir-button"
            title={
              !isIncrease && selectedChange !== null
                ? `Reducción: ${selectedChange}%`
                : "Seleccionar Reducción"
            }
            className={`${styles.dropdownReducirButton} ${styles.dropdownEstilo}`}
            variant=""
            onSelect={(e) => {
              setSelectedChange(parseInt(e));
              setIsIncrease(false);
            }}
          >
            {["-10", "-20", "-30", "-40", "-50"].map((p) => (
              <Dropdown.Item key={p} eventKey={p}>
                {p}%
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </div>

        {selectedChange !== null && (
          <div className={styles.botonAplicarWrapper}>
            <Button className={styles.botonAplicar} onClick={handleApplyChange}>
              Aplicar cambio
            </Button>
          </div>
        )}

        {tamboSel ? (
          <>
            <Row className="gx-4 gy-4 mt-3">
              <Col md={6}>
                <DetalleParametro
                  idTambo={tamboSel.id}
                  categoria="Vaquillona"
                  porcentaje={porcentaje}
                />
              </Col>
              <Col md={6}>
                <DetalleParametro
                  idTambo={tamboSel.id}
                  categoria="Vaca"
                  porcentaje={porcentaje}
                />
              </Col>
            </Row>
          </>
        ) : (
          <SelectTambo />
        )}
      </div>
    </Layout>
  );


};

export default Parametros;