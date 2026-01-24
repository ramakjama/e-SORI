# Guía de Despliegue - e-SORI

## Requisitos Previos

### En tu VPS Hostinger necesitas:
- Node.js 18+ instalado
- PostgreSQL instalado y corriendo
- Git instalado
- PM2 (opcional, para gestionar el proceso)

---

## Paso 1: Preparar la Base de Datos PostgreSQL

```bash
# Conectar a PostgreSQL
sudo -u postgres psql

# Crear la base de datos y usuario
CREATE DATABASE esori_db;
CREATE USER esori_user WITH ENCRYPTED PASSWORD 'TuPasswordSegura123!';
GRANT ALL PRIVILEGES ON DATABASE esori_db TO esori_user;

# Salir
\q
```

---

## Paso 2: Subir el Código a GitHub

```bash
# En tu máquina local
cd c:/Users/rsori/codex/soriano-ecliente

# Inicializar git si no está
git init

# Añadir remote (reemplaza con tu repo)
git remote add origin https://github.com/TU_USUARIO/soriano-ecliente.git

# Añadir archivos (el .gitignore ya excluye .env y node_modules)
git add .
git commit -m "Initial commit - e-SORI"
git push -u origin main
```

---

## Paso 3: Clonar en el VPS Hostinger

```bash
# En el VPS
cd /var/www
git clone https://github.com/TU_USUARIO/soriano-ecliente.git esori
cd esori
```

---

## Paso 4: Configurar Variables de Entorno

```bash
# Copiar el ejemplo y editarlo
cp .env.example .env
nano .env
```

**Edita el archivo .env con tus valores reales:**

```env
# Base de Datos PostgreSQL
DATABASE_URL="postgresql://esori_user:TuPasswordSegura123!@localhost:5432/esori_db"

# Groq API - Obtén tu clave GRATIS en https://console.groq.com/keys
GROQ_API_KEY="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# NextAuth - Genera con: openssl rand -base64 32
NEXTAUTH_SECRET="GENERA-UN-SECRET-UNICO-DE-32-CARACTERES"
NEXTAUTH_URL="https://tu-dominio.com"

# Aplicación
NEXT_PUBLIC_APP_NAME="e-SORI"
NEXT_PUBLIC_APP_URL="https://tu-dominio.com"
```

---

## Paso 5: Instalar Dependencias y Configurar Prisma

```bash
# Instalar dependencias
npm install

# Generar cliente Prisma
npm run db:generate

# Ejecutar migraciones (crear tablas)
npm run db:push

# (Opcional) Cargar datos de prueba
npm run db:seed
```

---

## Paso 6: Build de Producción

```bash
npm run build
```

---

## Paso 7: Ejecutar en Producción

### Opción A: Con PM2 (Recomendado)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar la aplicación
pm2 start npm --name "esori" -- start

# Guardar configuración para reinicio automático
pm2 save
pm2 startup
```

### Opción B: Sin PM2

```bash
npm start
```

---

## Paso 8: Configurar Nginx (Reverse Proxy)

```nginx
# /etc/nginx/sites-available/esori
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activar el sitio
sudo ln -s /etc/nginx/sites-available/esori /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Paso 9: SSL con Certbot (HTTPS)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
```

---

## Comandos Útiles

```bash
# Ver logs de la aplicación
pm2 logs esori

# Reiniciar la aplicación
pm2 restart esori

# Ver estado
pm2 status

# Actualizar código
cd /var/www/esori
git pull
npm install
npm run build
pm2 restart esori
```

---

## Obtener API Key de Groq (GRATIS)

1. Ve a https://console.groq.com
2. Crea una cuenta (gratis)
3. Ve a "API Keys"
4. Crea una nueva key
5. Cópiala al .env como GROQ_API_KEY

---

## Checklist Final

- [ ] PostgreSQL configurado con usuario y base de datos
- [ ] .env configurado con todos los valores
- [ ] GROQ_API_KEY obtenida de https://console.groq.com
- [ ] Prisma migrado (`npm run db:push`)
- [ ] Build de producción completado
- [ ] PM2 corriendo la aplicación
- [ ] Nginx configurado como reverse proxy
- [ ] SSL/HTTPS activo con Certbot
- [ ] Dominio apuntando al VPS

---

## Soporte

Si tienes problemas:
1. Revisa los logs: `pm2 logs esori`
2. Verifica PostgreSQL: `sudo systemctl status postgresql`
3. Verifica Nginx: `sudo nginx -t`
