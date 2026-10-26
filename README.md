# Verdulería La Verdadera: landing page

Sitio estático en HTML, CSS y JS puro, sin dependencias ni proceso de build. Se sube tal cual a cualquier hosting estático (Netlify, Vercel, GitHub Pages, cPanel).

```
index.html            Contenido, SEO, datos estructurados e ilustraciones SVG (sprite)
css/styles.css        Todo el diseño y las animaciones (tokens de marca al principio)
js/main.js            Animaciones al hacer scroll, parallax, estado abierto/cerrado
img/                  favicon.svg, apple-touch-icon.png, og-image.png (imagen para redes)
img/local/            Fotos del local (vacía por ahora)
manifest.webmanifest, robots.txt, sitemap.xml
```

## Identidad propuesta

| Rol | Color | Uso |
|---|---|---|
| Verde hoja | `#1d4a2f` | Color principal, botones, sección Historia |
| Lima | `#a6d94f` | Acento fresco, resaltados |
| Tomate | `#d63a22` | Sección Contacto, botón flotante |
| Mandarina | `#f59e1b` | Sello giratorio, acentos |
| Crema | `#fff8ec` | Fondo |
| Tinta | `#14261a` | Texto, bordes y sombras duras |

Tipografías: **Bricolage Grotesque** (títulos) y **DM Sans** (texto), de Google Fonts.
El estilo combina bordes de tinta con sombras duras, como stickers, y usa ilustraciones de frutas y verduras.

## Cómo editar

Todos los lugares para editar están marcados en el código con un comentario `EDITAR`.

### Dirección y mapa (pendiente)
En `index.html`, buscá `EDITAR: dirección`:
1. Reemplazá `Dirección: muy pronto` por la dirección real.
2. En el `<iframe>` del mapa, cambiá `q=Alta+Gracia,+C%C3%B3rdoba,+Argentina` por la dirección, por ejemplo `q=Av.+Belgrano+123,+Alta+Gracia,+Córdoba`.
3. En el botón **Cómo llegar**, cambiá la `query=` de la misma forma, o pegá el link de Google Maps del local cuando esté dado de alta.
4. En el bloque JSON-LD del `<head>`, agregá `"streetAddress": "Av. Belgrano 123"` y `"postalCode": "5186"` dentro de `address`.

### Fotos del local
1. Exportá las fotos en **WebP**, de unos 800×1000 px (formato vertical 4:5) y menos de 150 KB cada una. Podés usar squoosh.app.
2. Guardalas en `img/local/` (por ejemplo `frente.webp`).
3. En `index.html`, reemplazá cada bloque `<div class="photo-placeholder" ...>...</div>` por:
   ```html
   <img src="img/local/frente.webp" alt="Frente de Verdulería La Verdadera en Alta Gracia" width="800" height="1000" loading="lazy" decoding="async">
   ```
4. Cambiá el `<figcaption>` si querés otro texto.

### Historia
En `index.html`, buscá `EDITAR: historia del local` y reemplazá los párrafos. La línea de tiempo está justo debajo. Para avanzar un paso, mové la clase `current` al siguiente `<li>` y poné `done` en el anterior. Si avanzás un paso, en `css/styles.css` cambiá `width: 50%` por `100%` en `.timeline.is-in::after`.

### Horarios
Están en tres lugares:
- El texto visible en `index.html`, en la tarjeta "Horarios" y en el footer.
- El JSON-LD del `<head>`.
- La configuración `HOURS` al principio de `js/main.js`, que calcula "Abierto ahora / Cerrado" con la hora de Córdoba. Los días van de `0` (domingo) a `6` (sábado).

### Teléfono
Buscá `3513863812` en `index.html` y reemplazá todas las apariciones (links `tel:` y `wa.me`).

### Dominio
Reemplazá `https://www.verduleriavicky.com.ar` en `index.html`, `robots.txt` y `sitemap.xml`.

## Animaciones (todas en CSS o JS liviano)
- Letras de "La Verdadera" con entrada elástica y salto al pasar el mouse.
- Productos del hero que flotan, entran con efecto pop y siguen el mouse en desktop.
- Manchas de fondo que cambian de forma y un sello que gira.
- Marquesina inclinada y cinta de obra "Local en armado" en movimiento.
- Productos decorativos con parallax en todas las secciones.
- Aparición al hacer scroll, resaltados que se pintan y una línea de tiempo que se llena.
- Estado **abierto/cerrado en vivo**, con un marcador de la hora actual en la barra del día.
- Barra de progreso de lectura (scroll-driven animations nativas).
- Botón flotante de llamada con onda animada.
- Si el sistema tiene activado "reducir movimiento", todas las animaciones se apagan.

## Probar en local
Cualquier servidor estático sirve, por ejemplo `npx serve .`. Abrir el `index.html` con doble clic también funciona.
