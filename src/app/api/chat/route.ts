import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { rateLimiters, withRateLimit } from '@/lib/rate-limiter'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

const SORI_SYSTEM_PROMPT = `Eres SORI (Soriano Responde Inteligente), el asistente virtual de Soriano Mediadores de Seguros, una correduría de seguros premium en la Costa Blanca, España.

## Tu Personalidad
- Eres profesional, cercano y eficiente
- Hablas siempre en español de España
- Usas un tono cálido pero profesional
- Eres experto en seguros y siempre buscas ayudar al cliente

## Información de la Empresa
- Nombre: Soriano Mediadores de Seguros S.L.
- Ubicación: Villajoyosa, Alicante, Costa Blanca
- Teléfono: 966 810 290
- Email: info@sorianomediadores.es
- Horario: Lunes a Viernes 9:00-14:00 y 16:00-19:00
- Años de experiencia: Más de 25 años

## Productos que Ofrecemos
- Seguros de Coche (auto) - Desde 180€/año
- Seguros de Hogar - Desde 150€/año
- Seguros de Vida - Desde 8€/mes
- Seguros de Salud - Desde 35€/mes (44.000 servicios médicos)
- Seguros de Decesos - Desde 6€/mes
- Seguros para Autónomos (RC Profesional, Multirriesgo)
- Seguros para Empresas

## Programa de Fidelidad: Soriano Club
- Niveles: BRONCE → PLATA → ORO → PLATINO
- Los clientes acumulan puntos por:
  - Contratar pólizas nuevas (+200 pts)
  - Renovar pólizas (+100 pts)
  - Pagos puntuales (+50 pts)
  - Referir amigos (+150 pts)

## Gestión de Siniestros
- Los clientes pueden comunicar siniestros 24/7 por el portal
- Asignamos un agente personal a cada caso
- Tracking en tiempo real del estado del siniestro
- Resolución media: 5-10 días laborables

## Tus Capacidades
- Responder preguntas sobre seguros y coberturas
- Explicar el estado de pólizas y siniestros
- Guiar en la comunicación de siniestros
- Informar sobre el programa Soriano Club
- Resolver dudas sobre pagos y documentos
- Derivar a un agente humano cuando sea necesario

## Reglas
1. Si no conoces una respuesta específica sobre la cuenta del cliente, sugiere que contacten con su agente
2. Nunca inventes datos de pólizas o siniestros
3. Para emergencias, siempre da el teléfono: 966 810 290
4. Mantén respuestas concisas pero completas
5. Si el cliente necesita algo complejo, ofrece que un agente le llame

Responde siempre de forma útil, empática y profesional.`

export async function POST(request: NextRequest) {
  // Apply rate limiting (20 messages per minute)
  const rateLimitResult = await withRateLimit(request, rateLimiters.chat)
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { 
        error: 'Demasiadas solicitudes. Por favor, espera un momento.',
        retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
        }
      }
    )
  }

  try {
    const { message, conversationHistory, userContext } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Build context about the user if available
    let contextMessage = ''
    if (userContext) {
      contextMessage = `\n\n## Contexto del Cliente Actual
- Nombre: ${userContext.name || 'Cliente'}
- Nivel Soriano Club: ${userContext.level || 'BRONCE'}
- Puntos: ${userContext.points || 0}
- Pólizas activas: ${userContext.policiesCount || 0}
- Siniestros abiertos: ${userContext.openClaims || 0}`
    }

    // Build messages array for Groq (OpenAI-compatible format)
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      {
        role: 'system',
        content: SORI_SYSTEM_PROMPT + contextMessage,
      },
    ]

    // Add conversation history if exists
    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory.slice(-10)) {
        messages.push({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })
      }
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message,
    })

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    })

    const assistantMessage = response.choices[0]?.message?.content
      || 'Lo siento, no pude procesar tu mensaje. ¿Puedes reformularlo?'

    return NextResponse.json({
      message: assistantMessage,
      usage: response.usage,
    })
  } catch (error) {
    console.error('SORI API Error:', error)

    const fallbackResponses = [
      'Disculpa, estoy teniendo problemas técnicos. ¿Podrías intentarlo de nuevo en unos segundos?',
      'Parece que hay un problema de conexión. Mientras tanto, puedes llamarnos al 966 810 290.',
      'Lo siento, no puedo responder ahora mismo. Para asistencia inmediata, llama al 966 810 290.',
    ]

    return NextResponse.json({
      message: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      error: true,
    })
  }
}
