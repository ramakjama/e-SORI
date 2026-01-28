-- Script SQL para crear usuarios de Soriano Mediadores
-- Contraseña para todos: Soriano2024!
-- Hash bcrypt (10 rounds): $2b$10$NcwBhPUgqHjMmSiHY9IiWuPukYvK4T2CNohFEh4vgR8JpnFE8Kjby

-- Insertar usuarios (si no existen)
INSERT INTO "users" (
  "id",
  "email",
  "name",
  "password",
  "role",
  "level",
  "points",
  "isActive",
  "emailVerified",
  "createdAt",
  "updatedAt"
) VALUES
  -- Ramón Soriano (ADMIN)
  (
    'user_ramon_soriano_001',
    'ramon.soriano@sorianomediadores.es',
    'Ramón Soriano',
    '$2b$10$NcwBhPUgqHjMmSiHY9IiWuPukYvK4T2CNohFEh4vgR8JpnFE8Kjby',
    'ADMIN',
    'PLATINO',
    0,
    true,
    NOW(),
    NOW(),
    NOW()
  ),
  -- Dirección (ADMIN - mismo password que Ramón)
  (
    'user_direccion_001',
    'direccion@sorianomediadores.es',
    'Dirección Soriano',
    '$2b$10$NcwBhPUgqHjMmSiHY9IiWuPukYvK4T2CNohFEh4vgR8JpnFE8Kjby',
    'ADMIN',
    'PLATINO',
    0,
    true,
    NOW(),
    NOW(),
    NOW()
  ),
  -- Laura Fernández (EMPLEADO)
  (
    'user_laura_fernandez_001',
    'laura.fernandez@sorianomediadores.es',
    'Laura Fernández',
    '$2b$10$NcwBhPUgqHjMmSiHY9IiWuPukYvK4T2CNohFEh4vgR8JpnFE8Kjby',
    'EMPLEADO',
    'PLATINO',
    0,
    true,
    NOW(),
    NOW(),
    NOW()
  ),
  -- Pau Ripoll (EMPLEADO)
  (
    'user_pau_ripoll_001',
    'pau.ripoll@sorianomediadores.es',
    'Pau Ripoll',
    '$2b$10$NcwBhPUgqHjMmSiHY9IiWuPukYvK4T2CNohFEh4vgR8JpnFE8Kjby',
    'EMPLEADO',
    'PLATINO',
    0,
    true,
    NOW(),
    NOW(),
    NOW()
  ),
  -- Toni Medina (EMPLEADO)
  (
    'user_toni_medina_001',
    'toni.medina@sorianomediadores.es',
    'Toni Medina',
    '$2b$10$NcwBhPUgqHjMmSiHY9IiWuPukYvK4T2CNohFEh4vgR8JpnFE8Kjby',
    'EMPLEADO',
    'PLATINO',
    0,
    true,
    NOW(),
    NOW(),
    NOW()
  ),
  -- Juan Pérez (EMPLEADO)
  (
    'user_juan_perez_001',
    'juan.perez@sorianomediadores.es',
    'Juan Pérez',
    '$2b$10$NcwBhPUgqHjMmSiHY9IiWuPukYvK4T2CNohFEh4vgR8JpnFE8Kjby',
    'EMPLEADO',
    'PLATINO',
    0,
    true,
    NOW(),
    NOW(),
    NOW()
  ),
  -- Héctor Nolivos (EMPLEADO)
  (
    'user_hector_nolivos_001',
    'hector.nolivos@sorianomediadores.es',
    'Héctor Nolivos',
    '$2b$10$NcwBhPUgqHjMmSiHY9IiWuPukYvK4T2CNohFEh4vgR8JpnFE8Kjby',
    'EMPLEADO',
    'PLATINO',
    0,
    true,
    NOW(),
    NOW(),
    NOW()
  ),
  -- Tania Zhyla (EMPLEADO)
  (
    'user_tania_zhyla_001',
    'tania.zhyla@sorianomediadores.es',
    'Tania Zhyla',
    '$2b$10$NcwBhPUgqHjMmSiHY9IiWuPukYvK4T2CNohFEh4vgR8JpnFE8Kjby',
    'EMPLEADO',
    'PLATINO',
    0,
    true,
    NOW(),
    NOW(),
    NOW()
  )
ON CONFLICT ("email") DO UPDATE SET
  "password" = EXCLUDED."password",
  "name" = EXCLUDED."name",
  "role" = EXCLUDED."role",
  "isActive" = true,
  "emailVerified" = NOW(),
  "updatedAt" = NOW();

-- Crear wallets para cada usuario
INSERT INTO "wallets" ("id", "userId", "type", "balance", "createdAt", "updatedAt")
SELECT
  'wallet_' || u."id" || '_' || w.type,
  u."id",
  w.type,
  CASE WHEN w.type = 'COINS' THEN 100 ELSE 0 END,
  NOW(),
  NOW()
FROM "users" u
CROSS JOIN (VALUES ('XP'), ('COINS'), ('SHIELDS')) AS w(type)
WHERE u."email" LIKE '%@sorianomediadores.es'
ON CONFLICT ("userId", "type") DO NOTHING;
