import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      tiposSegurosInteres: 'Auto, Hogar, Vida',
      presupuestoMensual: 150,
      coberturasPrioritarias: 'Responsabilidad civil, Daños propios',
      frecuenciaRevision: 'Anual',
      canalContactoPreferido: 'Email',
      horarioContactoPreferido: 'Mañanas (9-14h)',
      completitud: 96,
    })
  } catch (error) {
    console.error('Error fetching preferences:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const completitud = Object.values(body).filter(v => v).length * 16

    return NextResponse.json({
      ...body,
      completitud,
    })
  } catch (error) {
    console.error('Error saving preferences:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
