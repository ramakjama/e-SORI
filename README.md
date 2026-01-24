# e-SORI | Soriano e-Cliente

Portal de seguros premium para Soriano Mediadores de Seguros S.L.

## Stack Tecnológico

- **Framework:** Next.js 14 (App Router)
- **Base de Datos:** PostgreSQL + Prisma ORM
- **IA Chat:** Groq API (llama-3.3-70b-versatile)
- **Estilos:** Tailwind CSS + Framer Motion
- **Autenticación:** NextAuth.js

## Características

- 35+ Landing pages de conversión (productos, segmentos, campañas)
- Sistema de gamificación "Soriano Club" con niveles y puntos
- Chat IA "SORI" para atención al cliente
- Gestión de pólizas, siniestros y documentos
- Sistema de leads con tracking UTM
- Dark mode y diseño responsive premium

## Instalación

```bash
# Clonar repositorio
git clone https://github.com/TU_USUARIO/soriano-ecliente.git
cd soriano-ecliente

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Generar cliente Prisma
npm run db:generate

# Inicializar base de datos
npm run db:push

# Iniciar en desarrollo
npm run dev
```

## Variables de Entorno

Ver `.env.example` para todas las variables necesarias:

- `DATABASE_URL` - PostgreSQL connection string
- `GROQ_API_KEY` - API key de [Groq](https://console.groq.com/keys)
- `NEXTAUTH_SECRET` - Secreto para sesiones
- `NEXTAUTH_URL` - URL de la aplicación

## Despliegue en Hostinger VPS

```bash
# En el servidor
git clone https://github.com/TU_USUARIO/soriano-ecliente.git
cd soriano-ecliente
npm install
npm run build
npm run start
```

## Estructura del Proyecto

```
src/
├── app/                    # Rutas Next.js
│   ├── (landing)/         # Landing pages públicas
│   ├── (dashboard)/       # Panel de cliente
│   └── api/               # API routes
├── components/            # Componentes React
│   ├── landing/          # Componentes de landing
│   └── ui/               # Componentes UI base
├── data/landings/        # Contenido de landings
└── lib/                  # Utilidades y configuración
```

## Licencia

Privado - Soriano Mediadores de Seguros S.L.
