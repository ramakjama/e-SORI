import { redirect } from 'next/navigation'

// e-SORI App - Redirige al login
export default function RootPage() {
  redirect('/login')
}
