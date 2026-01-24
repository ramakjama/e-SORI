# Checklist de Assets - Soriano e-Cliente

Este documento lista todos los archivos que necesitas proporcionar para personalizar completamente la aplicación.

---

## 1. LOGOS (Obligatorios)

### Logos de Soriano Mediadores
| Archivo | Ubicación | Formato | Tamaño Recomendado |
|---------|-----------|---------|-------------------|
| Logo principal | `/public/assets/logos/soriano-logo.svg` | SVG | Vector |
| Logo oscuro (para dark mode) | `/public/assets/logos/soriano-logo-dark.svg` | SVG | Vector |
| Logo icono (cuadrado) | `/public/assets/logos/soriano-icon.svg` | SVG | 512x512 |
| Favicon | `/public/favicon.ico` | ICO | 32x32, 16x16 |
| Apple Touch Icon | `/public/apple-touch-icon.png` | PNG | 180x180 |

### Logos de Aseguradoras Partner
| Aseguradora | Ubicación |
|-------------|-----------|
| Occident | `/public/assets/logos/partners/occident.png` |
| AXA | `/public/assets/logos/partners/axa.png` |
| Mapfre | `/public/assets/logos/partners/mapfre.png` |
| Allianz | `/public/assets/logos/partners/allianz.png` |
| Generali | `/public/assets/logos/partners/generali.png` |
| Santa Lucía | `/public/assets/logos/partners/santalucia.png` |
| DKV | `/public/assets/logos/partners/dkv.png` |
| Asisa | `/public/assets/logos/partners/asisa.png` |

**Formato recomendado:** PNG con fondo transparente, 200x80px

---

## 2. IMÁGENES

### Imágenes de la Oficina
| Archivo | Ubicación | Descripción |
|---------|-----------|-------------|
| Fachada | `/public/assets/images/office/fachada.jpg` | Exterior de la oficina |
| Recepción | `/public/assets/images/office/recepcion.jpg` | Interior |
| Equipo | `/public/assets/images/office/equipo.jpg` | Foto grupal |
| Villajoyosa | `/public/assets/images/office/villajoyosa.jpg` | Oficina principal |

**Formato:** JPG, 1920x1080px mínimo

### Fotos del Equipo
| Archivo | Descripción |
|---------|-------------|
| `/public/assets/images/team/director.jpg` | Director General |
| `/public/assets/images/team/comercial.jpg` | Dir. Comercial |
| `/public/assets/images/team/siniestros.jpg` | Resp. Siniestros |
| `/public/assets/images/team/[nombre].jpg` | Otros empleados |

**Formato:** JPG cuadrado, mínimo 400x400px (se recortará circular)

### Imágenes de Productos
| Producto | Ubicación |
|----------|-----------|
| Auto | `/public/assets/images/products/auto.jpg` |
| Hogar | `/public/assets/images/products/hogar.jpg` |
| Salud | `/public/assets/images/products/salud.jpg` |
| Vida | `/public/assets/images/products/vida.jpg` |
| Decesos | `/public/assets/images/products/decesos.jpg` |
| Comercio | `/public/assets/images/products/comercio.jpg` |
| Mascotas | `/public/assets/images/products/mascotas.jpg` |
| Moto | `/public/assets/images/products/moto.jpg` |
| Viaje | `/public/assets/images/products/viaje.jpg` |
| RC Profesional | `/public/assets/images/products/rc-profesional.jpg` |
| Comunidades | `/public/assets/images/products/comunidades.jpg` |
| Accidentes | `/public/assets/images/products/accidentes.jpg` |

**Formato:** JPG, 800x600px mínimo

### Banners de Promociones
| Campaña | Ubicación |
|---------|-----------|
| Black Friday | `/public/assets/images/promotions/black-friday-2025.jpg` |
| Cyber Monday | `/public/assets/images/promotions/cyber-monday-2025.jpg` |
| Navidad | `/public/assets/images/promotions/navidad-2025.jpg` |
| Verano | `/public/assets/images/promotions/verano-2025.jpg` |
| San Valentín | `/public/assets/images/promotions/san-valentin-2025.jpg` |
| Primavera | `/public/assets/images/promotions/primavera-2025.jpg` |
| Vuelta al Cole | `/public/assets/images/promotions/vuelta-cole-2025.jpg` |
| Referidos | `/public/assets/images/promotions/referidos.jpg` |
| Pack Familia | `/public/assets/images/promotions/pack-familia.jpg` |
| Jóvenes | `/public/assets/images/promotions/jovenes.jpg` |

**Formato:** JPG, 1920x600px (desktop), 800x800px (móvil)

### Open Graph / Redes Sociales
| Archivo | Ubicación | Uso |
|---------|-----------|-----|
| og-image.jpg | `/public/assets/images/og-image.jpg` | Compartir en redes |

**Formato:** JPG, 1200x630px

---

## 3. DOCUMENTOS PDF

### Estructura de carpetas:
```
/public/documents/
├── productos/
│   ├── auto/
│   │   ├── condicionado-general-occident.pdf
│   │   ├── ipid-auto-occident.pdf
│   │   └── nota-informativa-auto.pdf
│   ├── hogar/
│   │   ├── condicionado-general-occident.pdf
│   │   └── ipid-hogar-occident.pdf
│   ├── salud/
│   │   ├── condicionado-general-dkv.pdf
│   │   ├── cuadro-medico.pdf
│   │   └── ipid-salud.pdf
│   ├── vida/
│   │   ├── condicionado-general-occident.pdf
│   │   └── ipid-vida.pdf
│   ├── decesos/
│   │   ├── condicionado-general-occident.pdf
│   │   └── ipid-decesos.pdf
│   ├── comercio/
│   │   ├── condicionado-general.pdf
│   │   └── ipid-comercio.pdf
│   ├── mascotas/
│   │   └── condicionado-general.pdf
│   ├── moto/
│   │   └── condicionado-general.pdf
│   ├── viaje/
│   │   └── condicionado-general.pdf
│   ├── rc-profesional/
│   │   └── condicionado-general.pdf
│   ├── comunidades/
│   │   └── condicionado-general.pdf
│   └── accidentes/
│       └── condicionado-general.pdf
├── folletos/
│   ├── folleto-auto.pdf
│   ├── folleto-hogar.pdf
│   ├── folleto-salud.pdf
│   ├── folleto-vida.pdf
│   └── folleto-general.pdf
├── contratos/
│   ├── contrato-mediacion.pdf
│   └── consentimiento-datos.pdf
└── legal/
    ├── aviso-legal.pdf
    ├── politica-privacidad.pdf
    └── politica-cookies.pdf
```

### Documentos por producto:

| Producto | Documentos Necesarios |
|----------|----------------------|
| Auto | Condicionado, IPID, Nota informativa |
| Hogar | Condicionado, IPID |
| Salud | Condicionado, IPID, Cuadro médico |
| Vida | Condicionado, IPID |
| Decesos | Condicionado, IPID |
| Comercio | Condicionado, IPID |
| Mascotas | Condicionado |
| Moto | Condicionado |
| Viaje | Condicionado |
| RC Prof. | Condicionado |
| Comunidades | Condicionado |
| Accidentes | Condicionado |

**Nota:** Los documentos de Occident suelen proporcionarlos ellos. Solicítalos al delegado.

---

## 4. DATOS A ACTUALIZAR

### En `/src/config/company.ts`:

```typescript
// ACTUALIZAR estos campos:
legal: {
  cif: 'B-XXXXXXXX', // ← CIF real
  registroMercantil: '...', // ← Datos reales
  registroDGS: 'J-XXXX', // ← Nº registro DGSFP
}

contact: {
  phone: {
    main: '966 810 290', // ← Verificar
    mobile: '600 XXX XXX', // ← Añadir
    whatsapp: '34600XXXXXX', // ← Añadir
  },
  address: {
    street: 'CALLE REAL, Nº X', // ← Dirección exacta
  },
}

team: [
  // ← Añadir nombres reales y fotos
]
```

---

## 5. CONFIGURACIÓN TÉCNICA

### Variables de entorno (.env):

```env
# Base de datos
DATABASE_URL="postgresql://..."

# API Groq (chat SORI)
GROQ_API_KEY="gsk_..."

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://tudominio.com"

# App
NEXT_PUBLIC_APP_URL="https://tudominio.com"
```

---

## RESUMEN RÁPIDO

### Mínimo imprescindible para lanzar:

- [ ] Logo principal SVG
- [ ] Favicon
- [ ] 1 foto de oficina
- [ ] Datos de contacto actualizados
- [ ] CIF y datos legales
- [ ] Condicionados de los productos principales (Auto, Hogar, Salud, Vida)
- [ ] Clave API de Groq
- [ ] Base de datos PostgreSQL configurada

### Recomendado para versión completa:

- [ ] Todos los logos de aseguradoras partner
- [ ] Fotos del equipo
- [ ] Todos los documentos PDF por producto
- [ ] Imágenes de productos y promociones
- [ ] Cuadro médico de salud
- [ ] Banners de campañas

---

## CÓMO OBTENER LOS DOCUMENTOS

1. **Occident/Catalana Occidente:**
   - Contactar con tu delegado comercial
   - Solicitar condicionados, IPIDs y folletos actualizados
   - Pedir versión digital (PDF)

2. **Otras aseguradoras:**
   - Portal del mediador de cada compañía
   - Sección "Documentación" o "Descargas"

3. **Documentos propios:**
   - Contrato de mediación: tu gestoría/abogado
   - Políticas de privacidad: adaptación RGPD

---

**¿Dudas?** Contacta con el desarrollador o revisa la documentación en `/DEPLOY.md`
