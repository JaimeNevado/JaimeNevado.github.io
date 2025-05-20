export function obtenerTraducciones(idioma) {
  const traducciones = {
    'Español': {
      'options-title': 'Opciones',
      'idioma': 'Idioma:',
      'region': 'Ciudad o Región:',
      'sonido': 'Sonido',
      'efectosSonido': 'Efectos de Sonido',
      'notificaciones': 'Notificaciones',
      'modoCiego': 'Modo Ciego (próximamente)',
      'bloqueo': 'Bloquear Solicitudes (próximamente)',
      'jugar': 'JUGAR',
      'desafios': 'DESAFÍOS',
      'galeria': 'GALERÍA',
      'clasificacion': 'CLASIFICACIÓN',
      'amigos': 'AMIGOS',
      'perfil': 'PERFIL',
      'opciones': 'OPCIONES'
    },
    'Inglés': {
      'options-title': 'Settings',
      'idioma': 'Language:',
      'region': 'City or Region:',
      'sonido': 'Sound',
      'efectosSonido': 'Sound Effects',
      'notificaciones': 'Notifications',
      'modoCiego': 'Blind Mode (coming soon)',
      'bloqueo': 'Block Requests (coming soon)',
      'jugar': 'PLAY',
      'desafios': 'CHALLENGES',
      'galeria': 'GALLERY',
      'clasificacion': 'LEADERBOARD',
      'amigos': 'FRIENDS',
      'perfil': 'PROFILE',
      'opciones': 'SETTINGS'
    },
    'Francés': {
      'options-title': 'Paramètres',
      'idioma': 'Langue :',
      'region': 'Ville ou région :',
      'sonido': 'Son',
      'efectosSonido': 'Effets sonores',
      'notificaciones': 'Notifications',
      'modoCiego': 'Mode aveugle (bientôt)',
      'bloqueo': 'Bloquer les demandes (bientôt)',
      'jugar': 'JOUER',
      'desafios': 'DÉFIS',
      'galeria': 'GALERIE',
      'clasificacion': 'CLASSEMENT',
      'amigos': 'AMIS',
      'perfil': 'PROFIL',
      'opciones': 'PARAMÈTRES'
    }
  };

  return traducciones[idioma] || traducciones['Español'];
}
