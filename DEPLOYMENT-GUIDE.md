# 🚀 Guía de Despliegue - e-SORI

## Requisitos Previos

- Node.js 18+ 
- PostgreSQL 14+
- Redis (opcional, para rate limiting en producción)
- Dominio configurado
- Certificado SSL

## 1. Preparación del Entorno

```bash
# Clonar repositorio
git clone https://github.com/soriano-mediadores/e-sori.git
cd e-sori

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.production.example .env.production
```

## 2. Configurar Variables de Entorno

Editar `.env.production` con valores reales:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
GROQ_API_KEY="..."
```

## 3. Base de Datos

```bash
# Ejecutar migraciones
npx prisma migrate deploy

# Seed inicial (opcional)
npx prisma db seed
```

## 4. Build de Producción

```bash
# Build optimizado
npm run build

# Verificar build
npm run start
```

## 5. Despliegue en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 6. Despliegue en VPS/Servidor Propio

### Con PM2

```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicación
pm2 start npm --name "e-sori" -- start

# Guardar configuración
pm2 save
pm2 startup
```

### Con Docker

```bash
# Build imagen
docker build -t e-sori:latest .

# Ejecutar contenedor
docker run -d \
  --name e-sori \
  -p 3000:3000 \
  --env-file .env.production \
  e-sori:latest
```

## 7. Nginx (Reverse Proxy)

```nginx
server {
    listen 80;
    server_name esori.sorianomediadores.es;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name esori.sorianomediadores.es;

    ssl_certificate /etc/ssl/certs/esori.crt;
    ssl_certificate_key /etc/ssl/private/esori.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 8. Monitoreo

### Logs

```bash
# PM2
pm2 logs e-sori

# Docker
docker logs -f e-sori
```

### Health Check

```bash
curl https://esori.sorianomediadores.es/api/health
```

## 9. Backup

```bash
# Base de datos
pg_dump -U user -d esori_prod > backup_$(date +%Y%m%d).sql

# Archivos subidos
tar -czf uploads_$(date +%Y%m%d).tar.gz public/uploads
```

## 10. Actualizaciones

```bash
# Pull cambios
git pull origin main

# Instalar dependencias
npm install

# Build
npm run build

# Reiniciar
pm2 restart e-sori
```

## Checklist Pre-Producción

- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada
- [ ] SSL configurado
- [ ] Dominio apuntando correctamente
- [ ] Backups automáticos configurados
- [ ] Monitoreo activo (Sentry, etc.)
- [ ] Rate limiting configurado
- [ ] CORS configurado
- [ ] Emails de prueba enviados
- [ ] Pagos en modo test verificados
- [ ] Performance auditado (Lighthouse)
- [ ] Seguridad auditada
- [ ] Documentación actualizada

## Soporte

- Email: dev@sorianomediadores.es
- Teléfono: +34 966 810 290
