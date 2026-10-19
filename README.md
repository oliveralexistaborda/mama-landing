# Landing personal (portada)

Sitio estático, sin dependencias ni backend. Solo el primer bloque: estructura mínima y portada visual.

## Vista previa local

Opción 1 (Python):
```bash
cd /Users/OliverTaborda/mama-landing
python3 -m http.server 8080
```
Luego abre http://localhost:8080 en el navegador (o en Safari móvil vía la IP local).

Opción 2: abre directamente `index.html` en el navegador (las fuentes se cargan por CDN).

## Estructura
- `index.html` — portada.
- `styles.css` — estilos (paleta marfil / carbón / rosa viejo).
- `script.js` — animaciones de entrada, parallax suave y respeto a `prefers-reduced-motion`.
- `assets/` — carpeta preparada para tus fotografías reales.

## Añadir una fotografía real
Coloca tu imagen en `assets/` y, dentro del `<figure class="hero__media">` de `index.html`, agrega:
```html
<img src="assets/tu-foto.jpg" alt="Descripción" loading="lazy">
```
