# Assets Necesarios para e-SORI

## Logos (public/assets/logos/)

### Soriano Mediadores
- [ ] `soriano-logo.svg` - Logo principal (vectorial)
- [ ] `soriano-logo-white.svg` - Logo blanco para fondos oscuros
- [ ] `soriano-icon.svg` - Icono/símbolo solo (la "S")
- [ ] `soriano-logo.png` - Logo PNG (fallback)
- [ ] `soriano-favicon.ico` - Favicon 32x32

### Occident (Aseguradora)
- [ ] `occident-logo.svg` - Logo Occident
- [ ] `occident-logo-white.svg` - Logo blanco
- [ ] `occident-icon.svg` - Icono Occident

### Apps
- [ ] `app-icon-192.png` - Icono PWA 192x192
- [ ] `app-icon-512.png` - Icono PWA 512x512
- [ ] `apple-touch-icon.png` - iOS 180x180

## Branding (public/assets/branding/)

### Fondos y Patrones
- [ ] `hero-pattern.svg` - Patrón decorativo
- [ ] `gradient-bg.jpg` - Fondo degradado
- [ ] `texture-paper.png` - Textura para PDFs

### Ilustraciones por Producto
- [ ] `illustration-auto.svg` - Seguro coche
- [ ] `illustration-hogar.svg` - Seguro hogar
- [ ] `illustration-vida.svg` - Seguro vida
- [ ] `illustration-salud.svg` - Seguro salud
- [ ] `illustration-decesos.svg` - Seguro decesos
- [ ] `illustration-mascota.svg` - Seguro mascotas
- [ ] `illustration-viaje.svg` - Seguro viaje
- [ ] `illustration-comercio.svg` - Seguro comercio

### Soriano Club
- [ ] `badge-bronce.svg` - Medalla nivel Bronce
- [ ] `badge-plata.svg` - Medalla nivel Plata
- [ ] `badge-oro.svg` - Medalla nivel Oro
- [ ] `badge-platino.svg` - Medalla nivel Platino
- [ ] `trophy.svg` - Trofeo genérico
- [ ] `star.svg` - Estrella puntos

## Fotos (public/assets/photos/)

### Equipo
- [ ] `team-office.jpg` - Foto oficina Villajoyosa
- [ ] `team-group.jpg` - Foto equipo
- [ ] `team-agent-1.jpg` - Agente 1
- [ ] `team-agent-2.jpg` - Agente 2

### Testimoniales
- [ ] `testimonial-1.jpg` - Cliente 1
- [ ] `testimonial-2.jpg` - Cliente 2
- [ ] `testimonial-3.jpg` - Cliente 3

## PDFs Templates (src/templates/)

### Plantillas de Documentos
- [ ] Cabecera con logos Soriano + Occident
- [ ] Pie de página con datos legales
- [ ] Estilos corporativos (colores, tipografías)

## Información Empresa a Personalizar

### Datos Legales
- CIF: B03XXXXXX (confirmar)
- Registro DGS: J-XXXX (confirmar)
- Dirección exacta oficina
- Teléfonos (fijo, móvil, WhatsApp)
- Email de contacto
- Horarios actualizados

### Redes Sociales
- Facebook URL
- Instagram URL
- LinkedIn URL
- Google Business URL

### Textos Legales
- [ ] Política de privacidad
- [ ] Aviso legal
- [ ] Política de cookies
- [ ] Términos y condiciones

## Promociones a Configurar

### Campañas Estacionales
- [ ] Navidad 2024
- [ ] Black Friday 2024
- [ ] Vuelta al cole
- [ ] Verano
- [ ] San Valentín (parejas)

### Contenido por Campaña
- Título promocional
- Descuento/oferta
- Fecha inicio/fin
- Imagen banner
- Condiciones

---

## Notas

1. Todos los SVG deben ser optimizados (SVGO)
2. Imágenes JPG/PNG optimizadas para web (< 100KB)
3. Usar colores corporativos:
   - Rojo Occident: #E30613
   - Azul Soriano: (definir)
   - Grises: slate palette

4. Tipografías:
   - Títulos: Inter (ya incluida)
   - Cuerpo: Inter (ya incluida)

5. Para PDFs considerar librería:
   - @react-pdf/renderer (React)
   - pdfkit (Node.js)
   - puppeteer (HTML a PDF)
