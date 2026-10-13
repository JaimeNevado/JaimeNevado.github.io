# La compra: puesta en marcha

Lista de la compra compartida en `nevadox.com/compra`. La web es estática (GitHub Pages) y los datos van en **Firebase**: login con Google y una base de datos Firestore en tiempo real. Con el plan gratuito (Spark) sobra de largo.

> Esta carpeta (`_setup`) no se publica en la web porque GitHub Pages ignora las carpetas que empiezan por `_`. **Sí se ve en el repo público**, así que no metas aquí los emails reales.

## 1. Crear el proyecto de Firebase (unos 10 minutos)

1. Entra en <https://console.firebase.google.com> → **Crear un proyecto** → nombre, por ejemplo, `compra-casa`. Desactiva Google Analytics, no hace falta.
2. **Authentication** → *Comenzar* → *Método de acceso* → **Google** → Habilitar → elige tu email de asistencia → Guardar.
3. **Authentication** → *Configuración* → **Dominios autorizados** → *Añadir dominio* → `nevadox.com`. (`localhost` ya viene incluido para probar en local.)
4. **Firestore Database** → *Crear base de datos* → ubicación `europe-southwest1 (Madrid)` o `eur3` → **modo de producción**.
5. **Firestore Database** → pestaña **Reglas** → pega el contenido de [`firestore.rules`](firestore.rules), **cambia los dos emails por los vuestros (en minúsculas)** y pulsa *Publicar*.
6. ⚙️ **Configuración del proyecto** → *Tus apps* → icono **Web `</>`** → registra la app (nombre `compra`, **sin** Firebase Hosting) → copia el objeto `firebaseConfig`.
7. Pega esos valores en [`compra/app/config.js`](../app/config.js). No son secretos: lo que protege la lista son las reglas del paso 5.

## 2. Probar en local

Desde la raíz del repo:

```bash
python3 -m http.server 8000
```

Abre <http://localhost:8000/compra/>, entra con Google y añade algo. Si entras con una cuenta que no está en las reglas, verás «Aquí no hay nada que ver».

Para ver la interfaz sin Firebase: <http://localhost:8000/compra/?demo> (los datos se guardan solo en ese navegador).

## 3. Publicar

Haz commit y push de la carpeta `compra/`. Quedará en `https://nevadox.com/compra` (GitHub redirige a `/compra/`).

## 4. La etiqueta NFC de la nevera

- Graba la URL `https://nevadox.com/compra/` con la app **NFC Tools** (iPhone o Android) → *Escribir* → *Añadir registro* → **URL/URI**.
- La puerta de la nevera es de metal y **las pegatinas NFC normales no funcionan bien sobre metal**. Compra etiquetas **«anti-metal» / «on-metal»** (NTAG213 o NTAG215), o pégala sobre un imán o una pieza de plástico.
- iPhone: el NFC lee solo con la pantalla desbloqueada. Aparece un aviso y, al tocarlo, se abre la web.

## 5. Extras opcionales

- **Pantalla de inicio**: en Safari pulsa *Compartir → Añadir a pantalla de inicio*; en Chrome, *Instalar app*. Se abre a pantalla completa con su icono. En iPhone así además no caduca la sesión (Safari borra los datos de webs que no visitas en 7 días).
- **Restringir la API key** (más seguridad): en Google Cloud Console → *APIs y servicios → Credenciales* → la clave «Browser key» → *Restricciones de aplicaciones: sitios web* → `https://nevadox.com/*` y `http://localhost:8000/*`.
- **Más supermercados**: añade uno a `STORES` en [`compra/app/catalogo.js`](../app/catalogo.js) (por ejemplo `{ id: 'carrefour', name: 'Carrefour', short: 'C', color: '#1e4fa0', dark: '#6b9be8', tint: '#e4ecf8' }`) y aparecerá como pestaña y como opción en todas partes.

## Cómo está organizado

```
compra/
├── index.html            ← la página (nevadox.com/compra)
├── manifest.webmanifest  ← para instalarla como app
├── app/
│   ├── app.js            ← interfaz y lógica
│   ├── deslizar.js       ← gesto de deslizar para borrar
│   ├── datos.js          ← Firebase + modo demo
│   ├── catalogo.js       ← supermercados, pasillos y autodetección de categoría
│   ├── config.js         ← configuración de Firebase (rellenar)
│   ├── compra.css
│   └── icono*.{svg,png}
└── _setup/               ← no se publica
    ├── LEEME.md
    └── firestore.rules
```

Datos en Firestore:

- `listas/casa/items/{id}`: lo que hay que comprar (`name`, `qty`, `store`, `category`, `note`, `done`, `addedBy`, …).
- `listas/casa/productos/{nombre}`: la memoria de cada producto (dónde se compra, en qué pasillo va y cuántas veces lo habéis comprado). Con esto se rellena el súper automáticamente y se ordena «Lo de siempre».
