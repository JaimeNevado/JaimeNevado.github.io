// Configuración de Firebase. Estos valores NO son secretos (Firebase los expone
// en cualquier web); lo que protege la lista son las reglas de Firestore,
// que solo dejan entrar a los dos emails autorizados.
// Pasos para rellenarlo: compra/_setup/LEEME.md

export const firebaseConfig = {
	apiKey: 'AIzaSyCttJBd7bPkwNTxGLB0bNtg4qYkhGALLJI',
	authDomain: 'compra-casa-b3c3a.firebaseapp.com',
	projectId: 'compra-casa-b3c3a',
	storageBucket: 'compra-casa-b3c3a.firebasestorage.app',
	messagingSenderId: '738327685373',
	appId: '1:738327685373:web:59de83e8655dca530d7694',
};

export const isConfigured = !firebaseConfig.apiKey.startsWith('PEGA_AQUI');
