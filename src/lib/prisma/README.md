# Prisma Schema - e-SORI

## Descripción

Este directorio contiene el schema completo de Prisma para e-SORI, la aplicación de gestión de seguros con gamificación de Soriano Mediadores.

## Archivos

- `schema.prisma` - Schema principal de Prisma con todos los modelos
- `seed.ts` - Script para poblar la base de datos con datos iniciales
- `SCHEMA_DOCUMENTATION.md` - Documentación detallada de todos los modelos
- `README.md` - Este archivo

## Requisitos Previos

1. PostgreSQL 14+ instalado y ejecutándose
2. Node.js 18+ instalado
3. Variables de entorno configuradas

## Variables de Entorno

Crea o actualiza tu archivo `.env` en la raíz del proyecto:

```env
# Database
DATABASE_URL="postgresql://usuario:password@localhost:5432/esori_db?schema=public"

# Para desarrollo local
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/esori_dev?schema=public"
```

## Instalación

### 1. Instalar Prisma

```bash
npm install prisma --save-dev
npm install @prisma/client
```

### 2. Instalar bcryptjs (para seeds)

```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

## Configuración Inicial

### 1. Inicializar Prisma (si no está inicializado)

```bash
npx prisma init
```

### 2. Generar el Cliente de Prisma

```bash
npx prisma generate
```

### 3. Crear la Base de Datos

```bash
# Crear la base de datos si no existe
createdb esori_dev

# O usando psql
psql -U postgres -c "CREATE DATABASE esori_dev;"
```

### 4. Ejecutar Migraciones

```bash
# Crear y aplicar la migración inicial
npx prisma migrate dev --name init

# Esto creará:
# - Las tablas en la base de datos
# - El directorio prisma/migrations
# - Generará el cliente de Prisma
```

### 5. Poblar con Datos Iniciales (Seed)

```bash
# Primero, asegúrate de tener el script en package.json
# Agrega esto a tu package.json:
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} src/lib/prisma/seed.ts"
  }
}

# Luego ejecuta:
npx prisma db seed
```

## Comandos Útiles

### Desarrollo

```bash
# Abrir Prisma Studio (interfaz visual)
npx prisma studio

# Crear una nueva migración
npx prisma migrate dev --name nombre_de_la_migracion

# Resetear la base de datos (CUIDADO: borra todos los datos)
npx prisma migrate reset

# Formatear el schema
npx prisma format

# Validar el schema
npx prisma validate
```

### Producción

```bash
# Aplicar migraciones en producción
npx prisma migrate deploy

# Generar el cliente (después de cambios)
npx prisma generate
```

## Estructura de Modelos

### 13 Modelos Principales

1. **User** - Usuarios con gamificación
2. **Policy** - Pólizas de seguros
3. **Claim** - Siniestros
4. **Document** - Documentos y archivos
5. **RiskProfile** - Perfiles de riesgo
6. **Notification** - Notificaciones
7. **Reminder** - Recordatorios
8. **QuizResult** - Resultados de quizzes
9. **Referral** - Programa de referidos
10. **ClaimMessage** - Chat de siniestros
11. **Achievement** - Logros desbloqueables
12. **Reward** - Marketplace de recompensas
13. **Transaction** - Historial de coins

### Modelos Auxiliares

- **UserAchievement** - Progreso de logros por usuario
- **RewardPurchase** - Compras del marketplace

## Uso del Cliente Prisma

### Importar el Cliente

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
```

### Ejemplos de Uso

#### Crear un Usuario

```typescript
const user = await prisma.user.create({
  data: {
    email: 'usuario@example.com',
    name: 'Juan Pérez',
    role: 'CLIENT',
    status: 'ACTIVE',
  },
});
```

#### Consultar Pólizas con Relaciones

```typescript
const policies = await prisma.policy.findMany({
  where: {
    userId: user.id,
    status: 'ACTIVE',
  },
  include: {
    user: true,
    claims: true,
    documents: true,
  },
});
```

#### Crear un Siniestro

```typescript
const claim = await prisma.claim.create({
  data: {
    userId: user.id,
    policyId: policy.id,
    claimNumber: 'CLM-2026-00001',
    incidentDate: new Date(),
    description: 'Colisión en intersección',
    claimedAmount: 2500.00,
    status: 'SUBMITTED',
    priority: 'NORMAL',
  },
});
```

#### Actualizar XP y Coins del Usuario

```typescript
const updatedUser = await prisma.user.update({
  where: { id: user.id },
  data: {
    xp: { increment: 50 },
    coins: { increment: 10 },
  },
});
```

#### Registrar Transacción

```typescript
await prisma.transaction.create({
  data: {
    userId: user.id,
    type: 'EARNED',
    category: 'ACHIEVEMENT',
    amount: 50,
    balanceBefore: user.coins,
    balanceAfter: user.coins + 50,
    description: 'Logro desbloqueado: Primera Póliza',
    referenceId: achievement.id,
    referenceType: 'Achievement',
  },
});
```

#### Desbloquear Achievement

```typescript
await prisma.userAchievement.upsert({
  where: {
    userId_achievementId: {
      userId: user.id,
      achievementId: achievement.id,
    },
  },
  update: {
    progress: { increment: 1 },
    completed: true,
    unlockedAt: new Date(),
  },
  create: {
    userId: user.id,
    achievementId: achievement.id,
    progress: 1,
    maxProgress: 1,
    completed: true,
    unlockedAt: new Date(),
  },
});
```

## Migraciones

### Flujo de Trabajo de Migraciones

1. **Modificar el Schema**
   - Edita `schema.prisma`
   - Agrega, modifica o elimina modelos/campos

2. **Crear Migración**
   ```bash
   npx prisma migrate dev --name descripcion_del_cambio
   ```

3. **Revisar Migración**
   - Revisa el SQL generado en `prisma/migrations/`
   - Verifica que los cambios sean correctos

4. **Aplicar en Producción**
   ```bash
   npx prisma migrate deploy
   ```

### Ejemplo de Migración Manual

Si necesitas hacer cambios complejos que Prisma no puede manejar automáticamente:

```bash
# Crear migración vacía
npx prisma migrate dev --create-only --name custom_migration

# Editar el archivo SQL generado
# Luego aplicar
npx prisma migrate dev
```

## Seguridad

### Mejores Prácticas

1. **Nunca** expongas las credenciales de la base de datos
2. Usa variables de entorno para configuración
3. Implementa Row Level Security (RLS) en PostgreSQL
4. Valida todos los inputs antes de guardar
5. Usa transacciones para operaciones complejas

### Ejemplo de Transacción

```typescript
await prisma.$transaction(async (tx) => {
  // Actualizar usuario
  await tx.user.update({
    where: { id: userId },
    data: { coins: { increment: 50 } },
  });

  // Registrar transacción
  await tx.transaction.create({
    data: {
      userId,
      type: 'EARNED',
      amount: 50,
      description: 'Recompensa por quiz',
    },
  });
});
```

## Performance

### Optimizaciones

1. **Usa Índices** - Ya están definidos en el schema
2. **Select Solo lo Necesario**
   ```typescript
   const user = await prisma.user.findUnique({
     where: { id },
     select: { id: true, name: true, email: true }
   });
   ```

3. **Paginación**
   ```typescript
   const policies = await prisma.policy.findMany({
     skip: (page - 1) * pageSize,
     take: pageSize,
   });
   ```

4. **Conexión Pool**
   ```typescript
   const prisma = new PrismaClient({
     datasources: {
       db: {
         url: process.env.DATABASE_URL,
       },
     },
   });
   ```

## Troubleshooting

### Error: "Can't reach database server"

```bash
# Verifica que PostgreSQL esté corriendo
sudo service postgresql status

# Verifica la conexión
psql -U postgres -d esori_dev
```

### Error: "Migration failed"

```bash
# Resetear migraciones (desarrollo)
npx prisma migrate reset

# Ver estado de migraciones
npx prisma migrate status
```

### Error: "Generated Prisma Client does not match"

```bash
# Regenerar el cliente
npx prisma generate
```

## Testing

### Setup para Tests

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_TEST,
    },
  },
});

beforeEach(async () => {
  await prisma.$transaction([
    prisma.user.deleteMany(),
    prisma.policy.deleteMany(),
    // ... otros modelos
  ]);
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

## Documentación Adicional

- [Documentación de Prisma](https://www.prisma.io/docs)
- [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

## Soporte

Para problemas o preguntas sobre el schema:

1. Revisa la documentación en `SCHEMA_DOCUMENTATION.md`
2. Consulta los ejemplos en este README
3. Contacta al equipo de desarrollo

---

**Versión:** 1.0.0
**Última Actualización:** 2026-01-27
