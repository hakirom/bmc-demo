# DEMO — Bolsa Mercantil de Colombia

Réplica **no oficial** de la home de [bolsamercantil.com.co](https://www.bolsamercantil.com.co/),
construida como demostración de diseño e ingeniería front-end.

> ⚠️ Esto **no es** el sitio de la Bolsa Mercantil de Colombia S.A. No está afiliado ni
> respaldado por la BMC. Las cifras del tablero de mercado son **simuladas** y no
> corresponden a operaciones reales. El sitio lleva un badge visible de DEMO,
> `robots: noindex` y no debe desplegarse en un dominio público.

## Stack

- Vite 6 + React 19 + TypeScript (strict)
- Tailwind CSS v4 (tokens de marca en `src/styles/globals.css`)
- lucide-react para iconografía
- Sin dependencias de datos: todo el contenido vive en `src/data/site.ts`

## Comandos

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck
npm run build      # tsc --noEmit && vite build → dist/
npm run preview
```

## Estructura

```
src/
├── data/site.ts              # TODO el copy y los datos simulados
├── lib/
│   ├── utils.ts              # cn()
│   └── use-reveal.ts         # animación de entrada con IntersectionObserver
├── components/
│   ├── top-bar.tsx           # barra de utilidades + selector Esp/Ing
│   ├── navbar.tsx            # logo, Acceso, buscador y mega menú
│   ├── hero.tsx              # hero + carrusel de plataformas
│   ├── market-board.tsx      # cierre de rueda + tablero físicos/financieros
│   ├── services.tsx          # NUESTROS SERVICIOS (4 bloques)
│   ├── stats-strip.tsx       # franja de cifras
│   ├── value-carousel.tsx    # ¿Cómo agregamos valor a Colombia?
│   ├── contact-section.tsx   # CONTÁCTENOS
│   ├── site-footer.tsx       # footer, certificaciones y legal
│   ├── bmc-logo.tsx          # marca dibujada en SVG (sin assets de terceros)
│   ├── icon.tsx              # mapa de iconos
│   ├── section-heading.tsx   # encabezado reutilizable
│   ├── whatsapp-fab.tsx      # botón flotante de contacto
│   └── demo-badge.tsx        # aviso de réplica no oficial
└── styles/globals.css        # paleta BMC (#013365 / #1E88D3) y utilidades
```

## Cambiar el contenido

Todo el texto está centralizado en `src/data/site.ts`. Editar ahí basta: los
componentes no llevan copy hard-codeado.

## Notas de fidelidad

- Los logos, tipografías e imágenes propietarias **no** se descargaron del sitio
  original. La marca BMC está redibujada en SVG y la tipografía es Source Sans 3.
- La estructura y los textos institucionales reproducen la home pública
  (capturada el 2026-08-19) para que la comparación visual sea útil.
