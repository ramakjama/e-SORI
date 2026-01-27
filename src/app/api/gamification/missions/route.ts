import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

const MISSIONS_DATA = [
  { id: 'daily_login', reward: 50, experience: 10 },
  { id: 'complete_profile_basic', reward: 100, experience: 25 },
  { id: 'complete_profile_contact', reward: 100, experience: 25 },
  { id: 'complete_profile_work', reward: 100, experience: 25 },
  { id: 'complete_profile_family', reward: 100, experience: 25 },
  { id: 'complete_profile_financial', reward: 100, experience: 25 },
  { id: 'complete_profile_education', reward: 100, experience: 25 },
  { id: 'complete_profile_social', reward: 100, experience: 25 },
  { id: 'complete_profile_vehicle', reward: 150, experience: 30 },
  { id: 'complete_profile_home', reward: 150, experience: 30 },
  { id: 'complete_profile_health', reward: 150, experience: 30 },
  { id: 'complete_profile_preferences', reward: 150, experience: 30 },
  { id: 'complete_profile_hobbies', reward: 150, experience: 30 },
]

function calculateLevel(experience: number): string {
  if (experience >= 10000) return 'DIAMANTE'
  if (experience >= 5000) return 'PLATINO'
  if (experience >= 2000) return 'ORO'
  if (experience >= 500) return 'PLATA'
  return 'BRONCE'
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const missions = await prisma.userMission.findMany({
      where: {
        userId: session.user.id,
        status: { in: ['active', 'completed'] }
      },
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    const gamification = await prisma.gamification.findUnique({
      where: { userId: session.user.id }
    })

    return NextResponse.json({
      missions,
      level: gamification?.level || 'BRONCE',
      points: gamification?.points || 0,
      experience: gamification?.experience || 0
    })
  } catch (error) {
    console.error('Error fetching missions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { missionId, action } = await req.json()

    if (action === 'complete') {
      const mission = await prisma.userMission.findFirst({
        where: {
          userId: session.user.id,
          missionId,
          status: 'active'
        }
      })

      if (!mission) {
        return NextResponse.json({ error: 'Mission not found' }, { status: 404 })
      }

      const missionData = MISSIONS_DATA.find(m => m.id === missionId)

      if (!missionData) {
        return NextResponse.json({ error: 'Invalid mission' }, { status: 400 })
      }

      await prisma.userMission.update({
        where: { id: mission.id },
        data: {
          status: 'completed',
          progress: mission.target,
          completedAt: new Date()
        }
      })

      const gamification = await prisma.gamification.findUnique({
        where: { userId: session.user.id }
      })

      const newPoints = (gamification?.points || 0) + missionData.reward
      const newExperience = (gamification?.experience || 0) + missionData.experience
      const newLevel = calculateLevel(newExperience)

      const updatedGamification = await prisma.gamification.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          points: newPoints,
          experience: newExperience,
          level: newLevel,
          streak: 1,
          lastActivityDate: new Date()
        },
        update: {
          points: newPoints,
          experience: newExperience,
          level: newLevel,
          lastActivityDate: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        mission,
        gamification: updatedGamification,
        rewards: {
          points: missionData.reward,
          experience: missionData.experience
        }
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating mission:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
