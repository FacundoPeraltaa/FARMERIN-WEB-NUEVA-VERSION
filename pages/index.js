import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from 'react-bootstrap';
import { RiAddBoxLine } from 'react-icons/ri';

import { FirebaseContext } from '../firebase2';
import Layout from '../components/layout/layout';
import { Botonera, Contenedor, Mensaje } from '../components/ui/Elementos';
import DetalleTambos from '../components/layout/detalleTambo';
import styles from '../styles/Tambos.module.scss';

const Home = () => {
  const [error, guardarError] = useState(false);
  const { firebase, usuario, tambos, guardarTambos } = useContext(FirebaseContext);
  const router = useRouter();

  useEffect(() => {
    const redirectLogin = async () => {
      await router.push('/login');
    };

    if (!usuario) {
      redirectLogin();
    } else {
      const obtenerTambos = async () => {
        await firebase.db
          .collection('tambo')
          .where('usuarios', 'array-contains', usuario.uid)
          .orderBy('nombre', 'desc')
          .onSnapshot(manejarSnapshot);
      };
      obtenerTambos();
    }
  }, []);

  function manejarSnapshot(snapshot) {
    const tambos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    guardarTambos(tambos);
  }

  return (
    <Layout titulo="Tambos">
      {tambos && tambos.length > 0 ? (
        <>
          <section className={styles.encabezado}>
            <div className={styles.titulo}>
              <h3>📋 Listado de Tambos</h3>
              <p>Gestioná tus tambos fácilmente</p>
            </div>
            <div>
              <Link href="/tambos/[id]" as="/tambos/0">
                <Button className={styles.btnNuevoTambo}>
                  <RiAddBoxLine size={20} />
                  &nbsp; Crear nuevo tambo
                </Button>
              </Link>
            </div>
          </section>

          <Contenedor className={styles.cardStack}>
            {tambos.map(t => (
              <DetalleTambos key={t.id} tambo={t} />
            ))}
          </Contenedor>

          <div className={styles.divider}><span>- O -</span></div>

        <section className={styles.benefitsGrid}>
            <div className={`${styles.benefitText} ${styles.reportes}`}>
              <h5>REPORTES</h5>
              <p>
                En la sección Reportes vas a poder consultar información clave sobre el funcionamiento del tambo. Incluye datos productivos, partes diarios y estadísticas generales que te brindan una visión completa para analizar el rendimiento y tomar decisiones informadas.              </p>
            </div>

            <img src="Alimento.jpg" className={styles.benefitImage} alt="Soluciones a medida" />

            <div className={`${styles.benefitText} ${styles.control}`}>
              <h5>HERRAMIENTAS</h5>
              <p>
                En la sección Herramientas vas a encontrar utilidades prácticas que te ayudan en la gestión diaria del tambo, como el monitoreo de ingresos de animales, el control de turnos y otras funciones clave para mantener la operación organizada.              </p>
            </div>

            <img src="TamboPasillo.jpg" className={styles.benefitImage} alt="Almacenamiento" />

            <div className={`${styles.benefitText} ${styles.nutricion}`}>
              <h5>NUTRICION</h5>
              <p>
                La sección Nutrición te permite llevar un seguimiento integral de la alimentación del rodeo. Desde acá podés configurar parámetros, registrar controles y acceder a indicadores que ayudan a optimizar la eficiencia alimenticia y la producción lechera.

              </p>
            </div>

            <img src="VacaBlack.jpg" className={styles.benefitImage} alt="Alertas" />
          </section>

        </>
      ) : (
        <>
          <Mensaje className="text-center py-5">
            <h4 className={styles.tituloEmpty}>
              <span className="emoji">🚜</span>
              Todavía no tenés un tambo cargado
            </h4>

            <Link href="/tambos/[id]" as="/tambos/0">
              <Button variant="primary" size="lg" className={styles.btnCrear}>
                <RiAddBoxLine size={24} /> &nbsp; Crear mi primer tambo
              </Button>
            </Link>
          </Mensaje>


          <div className={styles.divider}><span>- O -</span></div>
          <section className={styles.benefitsGrid}>
            <div className={`${styles.benefitText} ${styles.reportes}`}>
              <h5>REPORTES</h5>
              <p>
                En la sección Reportes vas a poder consultar información clave sobre el funcionamiento del tambo. Incluye datos productivos, partes diarios y estadísticas generales que te brindan una visión completa para analizar el rendimiento y tomar decisiones informadas.              </p>
            </div>

            <img src="Alimento.jpg" className={styles.benefitImage} alt="Soluciones a medida" />

            <div className={`${styles.benefitText} ${styles.control}`}>
              <h5>HERRAMIENTAS</h5>
              <p>
                En la sección Herramientas vas a encontrar utilidades prácticas que te ayudan en la gestión diaria del tambo, como el monitoreo de ingresos de animales, el control de turnos y otras funciones clave para mantener la operación organizada.              </p>
            </div>

            <img src="TamboPasillo.jpg" className={styles.benefitImage} alt="Almacenamiento" />

            <div className={`${styles.benefitText} ${styles.nutricion}`}>
              <h5>NUTRICION</h5>
              <p>
                La sección Nutrición te permite llevar un seguimiento integral de la alimentación del rodeo. Desde acá podés configurar parámetros, registrar controles y acceder a indicadores que ayudan a optimizar la eficiencia alimenticia y la producción lechera.

              </p>
            </div>

            <img src="VacaBlack.jpg" className={styles.benefitImage} alt="Alertas" />
          </section>

        </>
      )}
    </Layout>
  );
};

export default Home;
