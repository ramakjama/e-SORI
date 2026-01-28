# Setup Rápido de Prisma - e-SORI

## Instalación Rápida (5 minutos)

### 1. Instalar Dependencias

```bash
npm install prisma @prisma/client bcryptjs
npm install -D @types/bcryptjs ts-node
```

### 2. Configurar Variables de Entorno

Crea o actualiza `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/esori_dev?schema=public"
```

### 3. Configurar package.json

Agrega el script de seed a tu `package.json`:

```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset"
  },
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} src/lib/prisma/seed.ts"
  }
}
```

### 4. Inicializar Base de Datos

```bash
# Generar el cliente de Prisma
npm run db:generate

# Crear la primera migración
npm run db:migrate -- --name init

# Poblar con datos de prueba
npm run db:seed
```

### 5. Verificar Instalación

```bash
# Abrir Prisma Studio para ver los datos
npm run db:studio
```

## Estructura de Archivos Creada

```
soriano-ecliente/
├── src/
│   └── lib/
│       └── prisma/
│           ├── schema.prisma              # Schema principal
│           ├── seed.ts                    # Datos iniciales
│           ├── examples.ts                # Ejemplos de queries
│           ├── SCHEMA_DOCUMENTATION.md    # Documentación completa
│           └── README.md                  # Guía de uso
├── prisma/
│   └── migrations/                        # Migraciones (generado)
└── .env                                   # Variables de entorno
```

## Credenciales de Prueba

Después de ejecutar el seed, tendrás estos usuarios:

| Email | Password | Rol |
|-------|----------|-----|
| admin@sorianomediadores.com | Test123! | ADMIN |
| test@example.com | Test123! | CLIENT |
| agent@sorianomediadores.com | Test123! | AGENT |

## Modelos Creados

✅ **13 Modelos Principales:**
1. User (con gamificación)
2. Policy
3. Claim
4. Document
5. RiskProfile
6. Notification
7. Reminder
8. QuizResult
9. Referral
10. ClaimMessage
11. Achievement
12. Reward
13. Transaction

✅ **2 Modelos Auxiliares:**
- UserAchievement
- RewardPurchase

## Datos de Seed Incluidos

- 10 Achievements predefinidos
- 7 Rewards en el marketplace
- 3 Usuarios de prueba
- 1 Póliza de ejemplo

## Próximos Pasos

1. **Integrar en la Aplicación**
   ```typescript
   // src/lib/prisma.ts
   import { PrismaClient } from '@prisma/client';

   const globalForPrisma = global as unknown as { prisma: PrismaClient };

   export const prisma =
     globalForPrisma.prisma ||
     new PrismaClient({
       log: ['query', 'error', 'warn'],
     });

   if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
   ```

2. **Crear API Routes**
   ```typescript
   // app/api/policies/route.ts
   import { prisma } from '@/lib/prisma';

   export async function GET(request: Request) {
     const policies = await prisma.policy.findMany();
     return Response.json(policies);
   }
   ```

3. **Usar en Server Components**
   ```typescript
   // app/dashboard/page.tsx
   import { prisma } from '@/lib/prisma';

   export default async function DashboardPage() {
     const policies = await prisma.policy.findMany();
     return <PolicyList policies={policies} />;
   }
   ```

## Comandos Útiles

```bash
# Ver base de datos visualmente
npm run db:studio

# Crear nueva migración después de cambios
npm run db:migrate -- --name nombre_descriptivo

# Resetear base de datos (desarrollo)
npm run db:reset

# Generar cliente después de cambios
npm run db:generate

# Ver estado de migraciones
npx prisma migrate status

# Aplicar migraciones en producción
npx prisma migrate deploy
```

## Troubleshooting

### Error: "Can't reach database server"
```bash
# Windows: Inicia PostgreSQL
# Opción 1: Si usas PostgreSQL instalado
pg_ctl -D "C:\Program Files\PostgreSQL\14\data" start

# Opción 2: Si usas Docker
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:14
```

### Error: "Database does not exist"
```bash
# Crear base de datos
createdb esori_dev

# O con psql
psql -U postgres -c "CREATE DATABASE esori_dev;"
```

### Error de TypeScript en seed.ts
```bash
# Instalar ts-node si no está instalado
npm install -D ts-node @types/node
```

## Recursos

- [Documentación Completa](src/lib/prisma/SCHEMA_DOCUMENTATION.md)
- [Ejemplos de Queries](src/lib/prisma/examples.ts)
- [Schema Prisma](src/lib/prisma/schema.prisma)
- [Prisma Docs](https://www.prisma.io/docs)

## Soporte

Para problemas técnicos, consulta la documentación o contacta al equipo de desarrollo.

---

**¡Listo!** Tu base de datos está configurada y lista para usar.
