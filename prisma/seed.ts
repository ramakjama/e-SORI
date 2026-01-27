import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.user.deleteMany()
  
  console.log('✅ Cleaned existing data')

  // Create demo users
  const hashedPassword = await bcrypt.hash('demo123', 10)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@soriano.com',
      name: 'Admin Soriano',
      password: hashedPassword,
      role: 'ADMIN',
      level: 'PLATINO',
      points: 15000,
      referralCode: 'ADMIN2024',
    }
  })

  console.log('✅ Created admin user')
  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
