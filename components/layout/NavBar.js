import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import styles from '../../styles/Sidebar.module.scss';
import { FirebaseContext } from '../../firebase2';
import { useRouter } from 'next/router';
import { Button, Modal, Badge, Alert } from 'react-bootstrap';
import { ContenedorAlertas } from '../ui/Elementos';
import { useDispatch, useSelector } from "react-redux";
import { updateValor } from '../../redux/valorSlice';

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMobileMenu = () => setMenuOpen(!menuOpen);
  const { usuario, firebase, tambos, guardarTamboSel, tamboSel, porc } = useContext(FirebaseContext);
  const [alertas, setAlertas] = useState([]);
  const [alertasSinLeer, setAlertasSinLeer] = useState([]);
  const [show, setShow] = useState(false);
  const [showHistorial, setShowHistorial] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [ultimoCambio, setUltimoCambio] = useState(null);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const valor = useSelector((state) => state.valor);

  useEffect(() => {
    if (porc !== undefined) {
      dispatch(updateValor(porc));
    }
  }, [porc, dispatch]);

  useEffect(() => {
    if (tamboSel && tamboSel.porcentaje !== undefined) {
      dispatch(updateValor(tamboSel.porcentaje));
    }
  }, [tamboSel, dispatch]);

  useEffect(() => {
    if (firebase && tambos) {
      obtenerAlertas();
    }
  }, [firebase, tambos]);

  useEffect(() => {
    if (tamboSel) {
      obtenerUltimoCambio();
      obtenerHistorial();
    }
  }, [tamboSel]);

  const handleCampanaClick = () => {
    setShow(true);
    if (alertasSinLeer.length > 0) {
      marcarComoLeidas();
    }
  };

  const handleClose = () => setShow(false);
  const handleHistorialClose = () => setShowHistorial(false);
  const handleHistorialShow = () => setShowHistorial(true);

  function cerrarSesion() {
    guardarTamboSel(null);
    firebase.logout();
    return router.push('/login');
  }

  async function vista(alerta) {
    try {
      await firebase.db.collection('alerta').doc(alerta.id).update({
        ...alerta,
        visto: true
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function marcarComoLeidas() {
    for (const alerta of alertasSinLeer) {
      await vista(alerta);
    }
    setAlertasSinLeer([]);
    obtenerAlertas();
  }

  async function obtenerAlertas() {
    const tambosArray = tambos.map(t => t.id);
    if (!firebase || tambosArray.length === 0) return;
    try {
      const snapshot = await firebase.db.collection('alerta')
        .where('idtambo', 'in', tambosArray)
        .orderBy('fecha', 'desc')
        .get();
      const alertasTambos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAlertas(alertasTambos);
      const sinLeer = alertasTambos.filter(a => !a.visto);
      setAlertasSinLeer(sinLeer);
      if (sinLeer.length > 0) {
        setUltimoCambio(sinLeer[0]); // Muestra la más reciente
      }
    } catch (error) {
      console.log(error);
      setError(true);
    }
  }

  async function obtenerHistorial() {
    if (!tamboSel) return;
    try {
      const snapshot = await firebase.db.collection('tambo')
        .doc(tamboSel.id)
        .collection('notificaciones')
        .orderBy('fecha', 'desc')
        .get();
      const historialData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHistorial(historialData);
    } catch (error) {
      console.log(error);
    }
  }

  async function obtenerUltimoCambio() {
    if (!tamboSel) return;
    try {
      const snapshot = await firebase.db.collection('tambo')
        .doc(tamboSel.id)
        .collection('notificaciones')
        .orderBy('fecha', 'desc')
        .limit(1)
        .get();
      const doc = snapshot.docs[0];
      if (doc) {
        setUltimoCambio({ id: doc.id, ...doc.data() });
      }
    } catch (error) {
      console.log(error);
    }
  }

  function formatFecha(fecha) {
    if (fecha instanceof Date) return fecha.toLocaleDateString();
    if (fecha?.toDate) return fecha.toDate().toLocaleDateString();
    if (typeof fecha === 'string') return new Date(fecha).toLocaleDateString();
    return 'Fecha desconocida';
  }

  return (
    <header className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          <Link href="/">
            <img src="/logoF (BLANCO).png" alt="Logo" className={styles.logoIcon} />
          </Link>
          <Link href="/">
            <img src="/logoLetras (BLANCO).png" alt="Farmerin" className={styles.logoText} />
          </Link>
        </div>

        <button className={styles.menuToggle} onClick={toggleMobileMenu}>
          Menú
        </button>

        <nav className={`${styles.navLinks} ${menuOpen ? styles.active : ''}`}>
          <Link href="/"><span>Tambos</span></Link>
          <Link href="/animales"><span>Animales</span></Link>

          <div className={styles.dropdown}>
            <button className={styles.dropbtn}>Nutrición</button>
            <div className={styles.dropdownContent}>
              <Link href="/parametros"><span>Parámetros</span></Link>
              <Link href="/control"><span>Control</span></Link>
              <Link href="/controlLechero"><span>Control Lechero</span></Link>
            </div>
          </div>

          <div className={styles.dropdown}>
            <button className={styles.dropbtn}>Reportes</button>
            <div className={styles.dropdownContent}>
              <Link href="/gralAnimales"><span>Gral. Animales</span></Link>
              <Link href="/produccion"><span>Producción</span></Link>
              <Link href="/parteDiario"><span>Parte Diario</span></Link>
              <Link href="/recepciones"><span>Recepciones</span></Link>
            </div>
          </div>

          <div className={styles.dropdown}>
            <button className={styles.dropbtn}>Herramientas</button>
            <div className={styles.dropdownContent}>
              <Link href="/monitor"><span>Monitor de Ingreso</span></Link>
              <Link href="/raciones"><span>Control de Ingreso</span></Link>
              <Link href="/IngresosTurnos"><span>Control de Turnos</span></Link>
            </div>
          </div>

          <div className={styles.dropdown}>
            <button className={styles.dropbtn}>Configuración</button>
            <div className={styles.dropdownContent}>
              <Link href="/listados"><span>Listados</span></Link>
              <Link href="/altaMasiva"><span>Alta Masiva</span></Link>
              <Link href="/actualizacion"><span>Actualización Masiva</span></Link>
              <Link href="/dirsa"><span>Dirsa</span></Link>
            </div>
          </div>

          <Link href="/ayuda"><span>Ayuda</span></Link>

          <span style={{ position: 'relative', marginRight: '10px', cursor: 'pointer', }} onClick={handleCampanaClick} title="Notificaciones">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color='#fbfbfb'>
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {alertasSinLeer.length > 0 && (
              <span style={{
                background: '#e74c3c',
                color: '#fff',
                borderRadius: '50%',
                padding: '2px 7px',
                fontSize: '11px',
                position: 'absolute',
                top: '-8px',
                right: '-10px',
                fontWeight: 'bold',
                minWidth: '20px',
                textAlign: 'center',
                lineHeight: '16px'
              }}>{alertasSinLeer.length}</span>
            )}
          </span>

          <Link href="/perfilFarmerin"><span>Mi Farmerin</span></Link>
        </nav>
      </div>

      {/* Modal de alerta */}
      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Alertas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ultimoCambio ? (
            <div className="historial-container">
              <ContenedorAlertas>
                <div className="historial-item" key={ultimoCambio.id}>
                  <div className="historial-fecha">{formatFecha(ultimoCambio.fecha)}:</div> {ultimoCambio.mensaje}
                </div>
              </ContenedorAlertas>
            </div>
          ) : (
            <Alert variant="warning">No se registran alertas</Alert>
          )}
          <Button
            variant="info"
            onClick={handleHistorialShow}
            style={{ marginTop: '10px', backgroundColor: '#1b8aa5' }}
            className="boton-historial"
          >
            Ver historial de cambios
          </Button>
        </Modal.Body>
      </Modal>

      {/* Modal de historial */}
      <Modal size="lg" show={showHistorial} onHide={handleHistorialClose}>
        <Modal.Header closeButton>
          <Modal.Title>Historial de cambios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="historial-container">
            {historial.length > 0 ? historial.map((cambio) => (
              <div key={cambio.id} className="historial-item">
                <div className="historial-fecha">{formatFecha(cambio.fecha)}</div>
                <div className="historial-mensaje">{cambio.mensaje}</div>
              </div>
            )) : (
              <Alert variant="info">No hay cambios registrados.</Alert>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </header>
  );
};

export default NavBar;
