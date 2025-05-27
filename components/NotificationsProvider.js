import React, { createContext, useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../firebase2';

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const { firebase, tambos, tamboSel } = useContext(FirebaseContext);
  const [notifications, setNotifications] = useState([]);
  const [historial, setHistorial] = useState([]);

  // Obtener alertas
  useEffect(() => {
    if (!firebase || !tambos) return;
    const tambosArray = tambos.map(t => t.id);
    if (tambosArray.length === 0) return;
    const unsub = firebase.db.collection('alerta')
      .where('idtambo', 'in', tambosArray)
      .orderBy('fecha', 'desc')
      .onSnapshot(snapshot => {
        const alertasTambos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: 'alerta'
        }));
        setNotifications(alertasTambos);
      });
    return () => unsub && unsub();
  }, [firebase, tambos]);

  // Obtener historial
  useEffect(() => {
    if (!firebase || !tamboSel) return;
    const unsub = firebase.db.collection('tambo')
      .doc(tamboSel.id)
      .collection('notificaciones')
      .orderBy('fecha', 'desc')
      .onSnapshot(snapshot => {
        const historialData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: 'historial'
        }));
        setHistorial(historialData);
      });
    return () => unsub && unsub();
  }, [firebase, tamboSel]);

  // Funciones para marcar como leída
  const markNotificationAsRead = async (id) => {
    if (!firebase) return;
    try {
      await firebase.db.collection('alerta').doc(id).update({ visto: true });
      setNotifications(notifications => notifications.map(n => n.id === id ? { ...n, visto: true } : n));
    } catch (e) { console.error(e); }
  };

  const markAllNotificationsAsRead = async () => {
    if (!firebase) return;
    const unread = notifications.filter(n => !n.visto);
    await Promise.all(unread.map(n => firebase.db.collection('alerta').doc(n.id).update({ visto: true })));
    setNotifications(notifications => notifications.map(n => ({ ...n, visto: true })));
  };

  return (
    <NotificationsContext.Provider value={{
      notifications,
      setNotifications,
      historial,
      markNotificationAsRead,
      markAllNotificationsAsRead
    }}>
      {children}
    </NotificationsContext.Provider>
  );
}; 