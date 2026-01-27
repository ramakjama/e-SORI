import 'next-auth'
import { UserRole, UserLevel } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: UserRole
      level: UserLevel
      points: number
      referralCode: string | null
    }
  }

  interface User {
    id: string
    role: UserRole
    level: UserLevel
    points: number
    referralCode?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
    level: UserLevel
    points: number
    referralCode?: string | null
  }
}
