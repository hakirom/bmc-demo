# BMC Demo — Strapi 5 + React

Implementación de **[Strapi](https://strapi.io/) 5** como CMS headless, con un front-end
React que consume su API REST. El contenido de ejemplo modela el sitio de la Bolsa
Mercantil de Colombia.

> ⚠️ **Demo no oficial.** No está afiliada ni respaldada por la Bolsa Mercantil de
> Colombia S.A. Las operaciones de mercado son datos simulados. El front-end lleva un
> aviso visible y `robots: noindex`.

```
apps/
├── cms/   Strapi 5.52 (TypeScript, SQLite) — API + panel de administración
└── web/   Vite 6 + React 19 + Tailwind v4 — consume la API del CMS
```

## Arranque

```bash
npm run setup
```

Luego, en dos terminales (o `npm run dev`, que levanta ambos):

```bash
npm run dev:cms   # http://localhost:1337/admin
```

```bash
npm run dev:web   # http://localhost:5173
```

**Primer arranque:** abre http://localhost:1337/admin y crea tu usuario administrador
(Strapi lo pide una sola vez; nadie más puede crearlo por ti). El contenido de ejemplo
y los permisos públicos ya quedaron cargados por el seed automático.

## Cómo encaja todo

1. Al arrancar, `apps/cms/src/index.ts` ejecuta `src/seed/`, que:
   - habilita `find`/`findOne` para el rol **Public** en los cinco content-types, y
   - carga el contenido inicial **solo si la colección está vacía** (idempotente).
2. El front-end pide todo en paralelo desde `apps/web/src/lib/cms.ts` y lo mapea a las
   mismas formas que el contenido local.
3. Si Strapi no responde, `ContentProvider` cae al contenido de `src/data/site.ts` y el
   badge inferior izquierdo cambia a *"CMS no disponible — contenido local"*. La página
   nunca se rompe por el backend.

## Panel de administración con la marca BMC

El admin de Strapi está personalizado con la línea gráfica del sitio: navy `#013365`
para acciones, azul `#1E88D3` para estados activos, fondos con el tinte `#F2F9FE`,
logos propios en login y menú, favicon y textos en español. Detalles y tokens en
[`apps/cms/README.md`](apps/cms/README.md).

## Modelo de contenido

| Content-type | Tipo | Endpoint | Qué alimenta |
|---|---|---|---|
| `Home` | single | `/api/home?populate=*` | Hero, títulos de sección, cifras, mensajes de valor y tarjetas de contacto |
| `Plataforma` | colección | `/api/plataformas?sort=orden:asc` | Carrusel de plataformas del hero |
| `Servicio` | colección | `/api/servicios?populate=enlaces` | Sección *Nuestros servicios* |
| `Operación de mercado` | colección | `/api/operaciones-mercado` | Tablero de cierre (físicos / financieros) |
| `Boletín` | colección | `/api/boletines?sort=fecha:desc` | Sección *Boletines del mercado* |
| `Configuración del sitio` | single | `/api/configuracion-sitio` | Barra de utilidades, mega menú, footer, certificaciones y legales |
| `Textos de interfaz` | single | `/api/textos-interfaz` | Microcopy: botones, cabeceras de tabla, acceso, portal y guion del asistente |
| `Componente de portal` | colección | `/api/componentes-portal` | Tarjetas del portal privado, con interruptor de activo |
| `Solicitud PQRSF` | colección | `/api/solicitudes-pqrsf` | Casos radicados por el asistente (solo escritura pública) |

Componentes reutilizables en `apps/cms/src/components/`: `shared.enlace`, `shared.seo`,
`shared.certificacion`, `nav.columna`, `home.cifra`, `home.mensaje-valor`,
`home.tarjeta-contacto`.

### Bilingüe (es/en)

i18n está activo en Plataforma, Servicio, Boletín, Home y Configuración del sitio. El
español es el idioma por defecto. Algunos campos son **compartidos** a propósito —
`orden`, `icono`, la fecha y la categoría de los boletines, las certificaciones y las
redes sociales—: se editan una vez y valen para ambos idiomas.

El selector **Esp/Ing** de la barra superior del front cambia el idioma de verdad: pide
`?locale=` a la API y recarga hero, menú, tablero, boletines y pie de página. Números y
fechas se formatean según el idioma (`es-CO` / `en-US`).

El microcopy que no es contenido editorial (cabeceras de tabla, «Conocer más», etiquetas
ARIA) vive en `apps/web/src/data/ui.ts`, no en el CMS.

### Rutas del front

| Ruta | Qué hay |
|---|---|
| `/` | Portada pública |
| `/acceso` | Inicio de sesión y registro (Strapi users-permissions) |
| `/portal` | Portal privado con los componentes activos del CMS |
| `/pqrsf` | Asistente de PQRSF que radica el caso en el CMS |

### Interruptores desde el panel

- **Plataforma → `activa`**: la apaga en la portada sin borrarla.
- **Plataforma → `requiereSesion`**: decide si «Acceder» lleva al login o al portal.
- **Componente de portal → `activo` / `requiereSesion`**: enciende cada tarjeta del
  portal y decide si se muestra bloqueada a quien no ha entrado.

En la demo vienen apagadas a propósito la plataforma *Administración de programas* y el
componente *Simulador de garantías*, para poder encenderlos en vivo.

### Asistente PQRSF

Motor local basado en reglas (`apps/web/src/lib/asistente-pqrsf.ts`): clasifica el tipo
de solicitud por palabras clave, conduce la conversación y radica el caso con un número
`BMC-AAAAMMDD-XXXX`, guardando la transcripción completa. **No hay llamadas externas ni
claves de API.** La interfaz `MotorAsistente` es el punto de extensión para enchufar un
modelo real detrás de un proxy en Strapi.

El guion de la conversación se edita en **Textos de interfaz → guionPqrsf**, así que el
cliente puede reescribir lo que dice el asistente sin tocar código.

### Panel preparado para editores

`apps/cms/src/seed/admin-views.ts` deja configuradas las vistas del Content Manager:
columnas de listado, orden por defecto, editor agrupado por bloques y un texto de ayuda
bajo cada campo importante. Se aplica al arrancar, lee lo que ya existe y solo escribe si
hay cambios, de modo que respeta lo que se ajuste a mano desde «Configurar la vista».

`Draft & Publish` está activo en todo salvo en *Operación de mercado*, que son datos y no
contenido editorial.

## Probar el circuito completo

1. Entra al panel → **Content Manager → Home** y cambia el título.
2. Pulsa **Save** y luego **Publish**.
3. Recarga http://localhost:5173 — el hero muestra el texto nuevo.

Y el circuito bilingüe:

1. En **Home**, cambia el idioma del documento a *English* (selector arriba a la derecha).
2. Edita el titular, guarda y publica.
3. En el front, pon el selector en **Ing**: solo cambia esa versión; el español queda igual.

Para comprobar el fallback: detén el CMS y recarga el front; sigue funcionando con el
contenido local.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run setup` | Instala dependencias de ambas apps |
| `npm run dev` | Levanta CMS y front a la vez |
| `npm run dev:cms` / `npm run dev:web` | Cada uno por separado |
| `npm run build` | Build de producción de ambos |
| `npm run typecheck` | TypeScript del front |

## Configuración

- **Base de datos:** SQLite en `apps/cms/.tmp/data.db` (no versionada). Para Postgres,
  cambia `DATABASE_CLIENT` y las credenciales en `apps/cms/.env`.
- **URL del CMS para el front:** `VITE_CMS_URL` en `apps/web/.env` (por defecto
  `http://localhost:1337`).
- **Desactivar el seed:** `SEED_DISABLED=true` en `apps/cms/.env`.
- Los `.env` no se versionan; cada app tiene su `.env.example`.

## Despliegue

### El front en Vercel

El `vercel.json` de la raíz ya deja el proyecto listo: instala y compila solo
`apps/web`, publica `apps/web/dist` y reescribe todas las rutas a `index.html` (necesario
para que `/acceso`, `/portal` y `/pqrsf` funcionen al recargar).

En **Settings → Environment Variables** define:

```
VITE_CMS_URL = https://tu-cms-publico
```

Vite incrusta esa variable **en tiempo de compilación**, así que hay que volver a
desplegar después de cambiarla. Si falta, el front apunta a `localhost:1337`, no
encuentra el CMS y cae al contenido local: la portada se ve, pero el portal aparece
vacío y el asistente no puede radicar.

### El CMS no va en Vercel

Strapi es un servidor Node persistente con base de datos; Vercel ejecuta funciones
efímeras con el disco en solo lectura, así que el SQLite se perdería entre invocaciones.
Opciones que sí funcionan:

| Dónde | Notas |
|---|---|
| **Strapi Cloud** | Camino oficial: Postgres, CDN y correo incluidos |
| **Render / Railway / Fly.io** | Contenedor Node + Postgres gestionado |
| **VPS propio** | Docker o PM2 detrás de Nginx |

En cualquiera de ellos hay que cambiar `DATABASE_CLIENT` a `postgres` en `apps/cms/.env`
(SQLite no sirve con disco efímero) y añadir el dominio del front a la configuración de
CORS en `apps/cms/config/middlewares.ts`.

## Qué no viene del CMS (a propósito)

- El widget *Mis trámites* del portal usa datos de ejemplo fijos: representan registros
  por usuario que en producción vendrían del sistema transaccional, no de un CMS.
- `apps/web/src/data/ui.ts` y `site.ts` ya no son fuente de contenido: quedan solo como
  respaldo para que la web siga en pie si Strapi no responde.

## Siguientes pasos naturales

- Subir PDFs reales a los boletines con el campo `adjunto` (Media Library).
- Emitir un **API token** de solo lectura y dejar de depender del rol Public abierto.
- Cambiar SQLite por Postgres y desplegar (Strapi Cloud o self-host).
- Generar tipos del cliente a partir de `apps/cms/types/generated`.
