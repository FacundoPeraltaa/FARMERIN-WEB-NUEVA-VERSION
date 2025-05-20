import React, { useState, useEffect } from 'react';
import LayoutLogin from '../components/layout/layoutLogin';
import Router from 'next/router';
import CrearCuenta from './crear-cuenta';
import styles from '../styles/Login.module.scss';

//formato del formulario
import { Contenedor, ContenedorPoliticas, ContenedorLogin, ContenedorSpinner, ContenedorPass } from '../components/ui/Elementos';
import { Form, Button, Alert, Spinner, Row, Container, Col, Image, Modal } from 'react-bootstrap';
import firebase from '../firebase2'
import { IoMdEyeOff, IoMdEye } from 'react-icons/io';

//hook de validacion de formualarios
import useValidacion from '../hook/useValidacion';
//importo las reglas de validacion para crear cuenta
import validarIniciarSesion from '../validacion/validarIniciarSesion';

//State inicial para el hook de validacion (inicializo vacío)
const STATE_INICIAL = {
  email: '',
  password: ''
}

const Login = () => {
  const [procesando, guardarProcesando] = useState(false);
  const [error, guardarError] = useState(false);

  const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);

  const { email, password } = valores;

  const [showPass, setShowPass] = useState(false);
  const [show, setShow] = useState(false);
  const [showPoliticas, setShowPoliticas] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [emailToReset, setEmailToReset] = useState("");
  const [alert, setAlert] = useState({ show: false, title: '', message: '', color: '#DD6B55' });
  const [showAlert, setShowAlert] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClosePoliticas = () => setShowPoliticas(false);
  const handleShowPoliticas = () => setShowPoliticas(true);

  const handleCloseForgotPassword = () => setShowForgotPassword(false);
  const handleShowForgotPassword = () => setShowForgotPassword(true);

  const handleChangeEmail = (e) => {
    setEmailToReset(e.target.value);
  };

  async function iniciarSesion() {
    guardarProcesando(true);
    setShowLoader(true);
    try {
      await firebase.login(email, password);
      await Router.push('/');
    } catch (error) {
      console.error('Hubo un error:', error.message);
      guardarError('Correo o contraseña incorrectos. Inténtalo nuevamente.');
    } finally {
      guardarProcesando(false);
      setShowLoader(false);
    }
  }

  // Mostrar el mensaje de error en el formulario
  { error && <Alert variant="danger">{error}</Alert> }


  const forgotPassword = async () => {
    guardarProcesando(true);
    try {
      await firebase.auth.sendPasswordResetEmail(emailToReset);
      setAlert({
        show: true,
        title: '¡ATENCIÓN!',
        message: "TE HEMOS ENVIADO UN MAIL PARA RESTABLECER TU CONTRASEÑA, SI NO LO HAS RECIBIDO REVISA EN SPAM",
        color: '#399dad'
      });
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      setAlert({
        show: true,
        title: '¡ATENCIÓN!',
        message: "EL CORREO INGRESADO NO SE ENCUENTRA REGISTRADO EN FARMERIN",
        color: 'red'
      });
    } finally {
      guardarProcesando(false);
    }
    setShowAlert(true);
  };

  useEffect(() => {
    const handleRouteChangeComplete = () => {
      setShowLoader(false);
    };

    Router.events.on('routeChangeComplete', handleRouteChangeComplete);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, []);

  return (
    <div className={styles.loginContainer}>
      {/* 📱 Mockup estilo Instagram con SCSS puro */}
      <div className={styles.loginImageSection}>
        <div className={styles.phoneMockup}>
          <span className={styles.notch}></span>
          <span className={styles.sideButtonTop}></span>
          <span className={styles.sideButtonBottom}></span>
          <img
            src="/VacaWord.jpg"
            alt="App Preview"
            className={styles.phoneScreen}
          />
        </div>
      </div>

      {/* 🧾 Sección del formulario */}
      <div className={styles.loginFormSection}>
        <div className={styles.loginCard}>
          <img src="/logoLetras.png" alt="Logo" className={styles.loginLogo} />
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={handleChange}
              className={styles.loginInput}
              required
            />
            {errores.email && <p className={styles.errorText}>{errores.email}</p>}

            <div className={styles.passwordInputContainer}>
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                placeholder="Contraseña"
                value={password}
                onChange={handleChange}
                className={styles.loginInput}
                required
              />
              <Button
                variant="light"
                onClick={() => setShowPass(!showPass)}
                size="sm"
                className={styles.togglePassBtn}
              >
                {showPass ? <IoMdEyeOff size={18} /> : <IoMdEye size={18} />}
              </Button>
            </div>
            {errores.password && <p className={styles.errorText}>{errores.password}</p>}
            {error && <p className={styles.errorText}>{error}</p>}

            <button type="submit" className={styles.loginButton}>
              Iniciar sesión
            </button>

            <div className={styles.divider}><span>O</span></div>

            <button type="button" className={styles.loginFacebook}>
              <i className="fa-brands fa-facebook"></i> Iniciar sesión con Facebook
            </button>

            <button type="button" onClick={() => setShowForgotPassword(true)} className={styles.forgotLink}>
              ¿Olvidaste tu contraseña?
            </button>
          </form>
        </div>

        <div className={styles.loginRegisterCard}>
          ¿No tienes una cuenta?{' '}
          <button onClick={() => setShow(true)} className={styles.registerLink}>
            Regístrate
          </button>
        </div>

        <div className={styles.loginApps}>
          <p>Descarga la app.</p>
          <div className={styles.storeButtons}>
            <img src="/googleplay.png" alt="Google Play" />
            <img src="/microsoft.png" alt="Microsoft" />
          </div>
        </div>
      </div>

      {/* 📦 Modal: Registro */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Registrarse</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CrearCuenta />
        </Modal.Body>
      </Modal>

      {/* 📦 Modal: Recuperar contraseña */}
      <Modal show={showForgotPassword} onHide={() => setShowForgotPassword(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Recuperar Contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Ingresa tu correo electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Correo Electrónico"
                value={emailToReset}
                onChange={(e) => setEmailToReset(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="info" onClick={forgotPassword} disabled={procesando} style={{ width: '100%' }}>
              {procesando ? "Procesando..." : "Enviar Mail de Recuperación"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* 📦 Modal: Alerta */}
      <Modal show={showAlert} onHide={() => setShowAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{alert.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{alert.message}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAlert(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Login;