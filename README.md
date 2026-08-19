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

## Modelo de contenido

| Content-type | Tipo | Endpoint | Qué alimenta |
|---|---|---|---|
| `Home` | single | `/api/home?populate=*` | Hero, títulos de sección, cifras, mensajes de valor y tarjetas de contacto |
| `Plataforma` | colección | `/api/plataformas?sort=orden:asc` | Carrusel de plataformas del hero |
| `Servicio` | colección | `/api/servicios?populate=enlaces` | Sección *Nuestros servicios* |
| `Operación de mercado` | colección | `/api/operaciones-mercado` | Tablero de cierre (físicos / financieros) |
| `Boletín` | colección | `/api/boletines?sort=fecha:desc` | Sección *Boletines del mercado* |

Componentes reutilizables en `apps/cms/src/components/`: `shared.enlace`, `shared.seo`,
`home.cifra`, `home.mensaje-valor`, `home.tarjeta-contacto`.

`Draft & Publish` está activo en todo salvo en *Operación de mercado*, que son datos y no
contenido editorial.

## Probar el circuito completo

1. Entra al panel → **Content Manager → Home** y cambia el título.
2. Pulsa **Save** y luego **Publish**.
3. Recarga http://localhost:5173 — el hero muestra el texto nuevo.

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

## Siguientes pasos naturales

- Activar **i18n** (es/en) para el toggle Esp/Ing del header.
- Subir PDFs reales a los boletines con el campo `adjunto` (Media Library).
- Cambiar SQLite por Postgres y desplegar (Strapi Cloud o self-host).
- Generar tipos del cliente a partir de `apps/cms/types/generated`.
