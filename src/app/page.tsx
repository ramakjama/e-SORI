import { redirect } from 'next/navigation'

// e-SORI App - DEMO_MODE: Redirige directo al dashboard
export default function RootPage() {
  redirect('/dashboard')
}
