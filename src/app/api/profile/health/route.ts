import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      grupoSanguineo: 'A+',
      alergias: 'Polen, ácaros',
      condicionesMedicas: '',
      medicacionHabitual: '',
      contactoEmergencia: 'María García',
      telefonoEmergencia: '+34 698 765 432',
      relacionEmergencia: 'Cónyuge',
      completitud: 56,
    })
  } catch (error) {
    console.error('Error fetching health data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const completitud = Object.values(body).filter(v => v).length * 14

    return NextResponse.json({
      ...body,
      completitud,
    })
  } catch (error) {
    console.error('Error saving health data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
