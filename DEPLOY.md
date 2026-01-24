# Guía de Despliegue - Hostinger VPS

## 1. SUBIR A GITHUB

### Crear repositorio en GitHub
1. Ve a https://github.com/new
2. Nombre: `soriano-ecliente`
3. Privado o público según prefieras
4. NO marcar "Add README" (ya lo tenemos)
5. Click "Create repository"

### Conectar y subir desde tu PC
```bash
cd c:/Users/rsori/codex/soriano-ecliente
git remote add origin https://github.com/TU_USUARIO/soriano-ecliente.git
git branch -M main
git push -u origin main
```

---

## 2. PREPARAR HOSTINGER VPS

### Conectar por SSH
```bash
ssh root@TU_IP_VPS
```

### Instalar dependencias del sistema
```bash
# Actualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# Verificar
node -v  # v20.x.x
npm -v

# Instalar PM2 (gestor de procesos)
npm install -g pm2

# Instalar PostgreSQL
apt install -y postgresql postgresql-contrib
```

### Configurar PostgreSQL
```bash
# Acceder a PostgreSQL
sudo -u postgres psql

# Crear base de datos y usuario
CREATE USER soriano WITH PASSWORD 'tu_password_seguro';
CREATE DATABASE soriano_ecliente OWNER soriano;
GRANT ALL PRIVILEGES ON DATABASE soriano_ecliente TO soriano;
\q
```

---

## 3. DESPLEGAR LA APLICACIÓN

### Clonar el repositorio
```bash
cd /var/www
git clone https://github.com/TU_USUARIO/soriano-ecliente.git
cd soriano-ecliente
```

### Configurar variables de entorno
```bash
cp .env.example .env
nano .env
```

Editar con tus valores reales:
```env
DATABASE_URL="postgresql://soriano:tu_password_seguro@localhost:5432/soriano_ecliente"
GROQ_API_KEY="gsk_tu_clave_groq"
NEXTAUTH_SECRET="genera-un-secreto-seguro-32-caracteres"
NEXTAUTH_URL="https://tudominio.com"
NEXT_PUBLIC_APP_URL="https://tudominio.com"
```

### Instalar y compilar
```bash
npm install
npm run db:generate
npm run db:push
npm run build
```

### Iniciar con PM2
```bash
pm2 start npm --name "soriano-ecliente" -- start
pm2 save
pm2 startup
```

---

## 4. CONFIGURAR NGINX (Proxy Inverso)

### Instalar Nginx
```bash
apt install -y nginx
```

### Crear configuración
```bash
nano /etc/nginx/sites-available/soriano-ecliente
```

Contenido:
```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

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

### Activar sitio
```bash
ln -s /etc/nginx/sites-available/soriano-ecliente /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## 5. SSL CON CERTBOT (HTTPS)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d tudominio.com -d www.tudominio.com
```

---

## 6. OBTENER API KEY DE GROQ

1. Ve a https://console.groq.com/keys
2. Crea una cuenta (es gratis)
3. Click "Create API Key"
4. Copia la clave y pégala en `.env`

---

## 7. COMANDOS ÚTILES

```bash
# Ver logs de la aplicación
pm2 logs soriano-ecliente

# Reiniciar aplicación
pm2 restart soriano-ecliente

# Ver estado
pm2 status

# Actualizar código
cd /var/www/soriano-ecliente
git pull
npm install
npm run build
pm2 restart soriano-ecliente
```

---

## CHECKLIST FINAL

- [ ] GitHub repo creado y código subido
- [ ] VPS con Node.js 20 instalado
- [ ] PostgreSQL configurado
- [ ] Variables de entorno configuradas (.env)
- [ ] Groq API key obtenida
- [ ] Aplicación compilada y corriendo con PM2
- [ ] Nginx configurado como proxy
- [ ] SSL/HTTPS activado con Certbot
- [ ] Dominio apuntando al VPS
