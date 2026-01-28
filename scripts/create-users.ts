/**
 * Script para crear usuarios de Soriano Mediadores
 * Ejecutar con: npx ts-node scripts/create-users.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Contraseña por defecto para todos los usuarios: Soriano2024!
const DEFAULT_PASSWORD = 'Soriano2024!'

const USERS_TO_CREATE = [
  {
    email: 'ramon.soriano@sorianomediadores.es',
    name: 'Ramón Soriano',
    role: 'ADMIN' as const,
  },
  {
    email: 'direccion@sorianomediadores.es',
    name: 'Dirección Soriano',
    role: 'ADMIN' as const,
  },
  {
    email: 'laura.fernandez@sorianomediadores.es',
    name: 'Laura Fernández',
    role: 'EMPLEADO' as const,
  },
  {
    email: 'pau.ripoll@sorianomediadores.es',
    name: 'Pau Ripoll',
    role: 'EMPLEADO' as const,
  },
  {
    email: 'toni.medina@sorianomediadores.es',
    name: 'Toni Medina',
    role: 'EMPLEADO' as const,
  },
  {
    email: 'juan.perez@sorianomediadores.es',
    name: 'Juan Pérez',
    role: 'EMPLEADO' as const,
  },
  {
    email: 'hector.nolivos@sorianomediadores.es',
    name: 'Héctor Nolivos',
    role: 'EMPLEADO' as const,
  },
  {
    email: 'tania.zhyla@sorianomediadores.es',
    name: 'Tania Zhyla',
    role: 'EMPLEADO' as const,
  },
]

async function main() {
  console.log('🔐 Creando usuarios de Soriano Mediadores...\n')

  // Hash de la contraseña (se usará para todos)
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10)

  for (const userData of USERS_TO_CREATE) {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      })

      if (existingUser) {
        console.log(`⚠️  El usuario ${userData.email} ya existe. Actualizando contraseña...`)

        // Actualizar la contraseña del usuario existente
        await prisma.user.update({
          where: { email: userData.email },
          data: {
            password: hashedPassword,
            name: userData.name,
            role: userData.role,
            isActive: true,
          },
        })

        console.log(`✅ Usuario ${userData.email} actualizado correctamente\n`)
      } else {
        // Crear nuevo usuario
        const user = await prisma.user.create({
          data: {
            email: userData.email,
            name: userData.name,
            role: userData.role,
            password: hashedPassword,
            level: 'PLATINO', // Nivel premium para equipo
            points: 0,
            isActive: true,
            emailVerified: new Date(), // Email verificado por defecto
          },
        })

        // Crear wallets para el usuario
        await prisma.wallet.createMany({
          data: [
            { userId: user.id, type: 'XP', balance: 0 },
            { userId: user.id, type: 'COINS', balance: 100 }, // Bonus inicial
            { userId: user.id, type: 'SHIELDS', balance: 0 },
          ],
        })

        console.log(`✅ Usuario ${userData.email} creado exitosamente`)
        console.log(`   Rol: ${userData.role}`)
        console.log(`   Nivel: PLATINO\n`)
      }
    } catch (error) {
      console.error(`❌ Error creando usuario ${userData.email}:`, error)
    }
  }

  console.log('\n✨ Proceso completado!\n')
  console.log('📧 Usuarios creados/actualizados:')
  USERS_TO_CREATE.forEach(u => console.log(`   - ${u.email}`))
  console.log(`\n🔑 Contraseña para todos los usuarios: ${DEFAULT_PASSWORD}`)
  console.log('\n⚠️  IMPORTANTE: Los usuarios ramon.soriano y direccion tienen la MISMA contraseña.')
  console.log('   Ambos pueden iniciar sesión con: ' + DEFAULT_PASSWORD)
}

main()
  .catch((e) => {
    console.error('❌ Error fatal:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
