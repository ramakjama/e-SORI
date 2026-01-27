import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      deportesPracticados: 'Natación, Ciclismo',
      viajesFrecuentes: true,
      destinosFrecuentes: 'Europa, Caribe',
      actividadesRiesgo: '',
      hobbies: 'Lectura, Fotografía',
      mascotasTipo: 'Perro',
      mascotasCantidad: 1,
      completitud: 84,
    })
  } catch (error) {
    console.error('Error fetching hobbies:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const completitud = Object.values(body).filter(v => v !== undefined && v !== null && v !== '').length * 14

    return NextResponse.json({
      ...body,
      completitud,
    })
  } catch (error) {
    console.error('Error saving hobbies:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
