import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.email || !body.password) {
      return NextResponse.json({ error: 'Nombre, email y contraseña son requeridos' }, { status: 400 })
    }

    return NextResponse.json({
      message: 'Usuario creado correctamente',
      user: {
        id: 'demo-new-user',
        name: body.name,
        email: body.email,
        role: 'CLIENTE',
        level: 'BRONCE',
        points: 50,
        createdAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Error al crear el usuario' }, { status: 500 })
  }
}
