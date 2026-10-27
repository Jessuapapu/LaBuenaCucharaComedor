export const triggerWaiterAlert = async (title: string, body: string): Promise<void> => {
  // 1. Activar Vibración física (Android)
  if ('vibrate' in navigator) {
    navigator.vibrate([500, 250, 500]);
  }

  // 2. Manejar la Notificación del Sistema visualmente
  if (!('Notification' in window)) {
    console.warn('Este navegador no soporta notificaciones.');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  } else if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification(title, { body });
    }
  }
};