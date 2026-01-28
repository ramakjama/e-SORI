# Diagrama de Base de Datos - e-SORI

## Estructura Visual de Relaciones

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            USUARIO (User)                                    │
│  - id, email, name, phone, avatar, password                                 │
│  - xp, coins, level, streak, lastActiveDate                                 │
│  - role, status, createdAt, updatedAt                                       │
└───┬─────────┬─────────┬──────────┬───────────┬──────────┬──────────┬────────┘
    │         │         │          │           │          │          │
    │ 1:N     │ 1:N     │ 1:N      │ 1:1       │ 1:N      │ 1:N      │ 1:N
    │         │         │          │           │          │          │
    ▼         ▼         ▼          ▼           ▼          ▼          ▼
┌───────┐ ┌───────┐ ┌──────────┐ ┌─────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│Policy │ │Claim  │ │Document  │ │Risk     │ │Notif.  │ │Reminder│ │Quiz    │
│       │ │       │ │          │ │Profile  │ │        │ │        │ │Result  │
└───┬───┘ └───┬───┘ └──────────┘ └─────────┘ └────────┘ └────────┘ └────────┘
    │         │
    │ 1:N     │ 1:N
    │         │
    ▼         ▼
┌───────┐ ┌──────────┐
│Claim  │ │Claim     │
│       │ │Message   │
└───────┘ └──────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                         GAMIFICACIÓN                                         │
└──────────┬──────────┬──────────┬──────────┬──────────┬───────────────────────┘
           │          │          │          │          │
           │ 1:N      │ 1:N      │ 1:N      │ 1:N      │ 1:N
           │          │          │          │          │
           ▼          ▼          ▼          ▼          ▼
    ┌──────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌─────────────┐
    │Referral  │ │Transac.│ │Reward  │ │Achieve.│ │UserAchieve. │
    │(Made)    │ │        │ │Purchase│ │        │ │             │
    └──────────┘ └────────┘ └────────┘ └───┬────┘ └──────┬──────┘
                                            │             │
                                            │ 1:N         │ N:1
                                            │             │
                                            └─────────────┘
```

## Modelo de Datos Detallado

### Core Models (Funcionalidad Principal)

#### 1. User → Policy → Claim
```
User (Usuario)
    ├── Policy (Pólizas)
    │       ├── Claim (Siniestros)
    │       │       ├── ClaimMessage (Chat)
    │       │       └── Document (Archivos)
    │       ├── Document (Documentos de póliza)
    │       └── Reminder (Alertas)
    └── RiskProfile (Perfil de riesgo)
```

#### 2. Gamification Flow
```
User
    ├── XP, Coins, Level, Streak
    ├── Achievement
    │       └── UserAchievement (Progreso)
    ├── Reward
    │       └── RewardPurchase (Compras)
    ├── Transaction (Historial)
    ├── QuizResult (Quizzes)
    └── Referral (Referencias)
```

#### 3. Communication Flow
```
User
    ├── Notification (Notificaciones)
    ├── Reminder (Recordatorios)
    └── ClaimMessage (Mensajes de siniestros)
```

## Relaciones Clave

### 1:1 Relationships
- `User` ←→ `RiskProfile` (Un usuario tiene un perfil de riesgo)

### 1:N Relationships
- `User` → `Policy[]` (Un usuario tiene múltiples pólizas)
- `User` → `Claim[]` (Un usuario tiene múltiples siniestros)
- `Policy` → `Claim[]` (Una póliza puede tener múltiples siniestros)
- `User` → `Notification[]` (Un usuario recibe múltiples notificaciones)
- `User` → `Transaction[]` (Un usuario tiene múltiple transacciones)

### N:M Relationships (through join tables)
- `User` ←→ `Achievement` (through `UserAchievement`)
  - Un usuario puede desbloquear múltiples logros
  - Un logro puede ser desbloqueado por múltiples usuarios

### Self-Referencing Relationships
- `Referral`:
  - `referrer` (User) → hace referencia a → `referred` (User)
  - Un usuario puede referir a múltiples usuarios
  - Un usuario puede ser referido por un único usuario

## Cascading Deletes

### OnDelete: CASCADE
```
User deleted → Cascades to:
    ├── Policy
    ├── Claim
    ├── Document
    ├── RiskProfile
    ├── Notification
    ├── Reminder
    ├── QuizResult
    ├── Referral (as referrer)
    ├── ClaimMessage
    ├── UserAchievement
    ├── Transaction
    └── RewardPurchase

Policy deleted → Cascades to:
    ├── Claim
    ├── Document
    └── Reminder

Claim deleted → Cascades to:
    ├── Document
    └── ClaimMessage
```

### OnDelete: RESTRICT
```
Reward → RewardPurchase
(No se puede eliminar una recompensa con compras activas)
```

### OnDelete: SET NULL
```
Referral → User (referred)
(Si se elimina el referido, el registro de referral persiste con NULL)
```

## Índices para Performance

### High-Priority Indexes
```sql
-- User lookups
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_status ON users(status);
CREATE INDEX idx_user_level ON users(level);

-- Policy queries
CREATE INDEX idx_policy_user ON policies(userId);
CREATE INDEX idx_policy_number ON policies(policyNumber);
CREATE INDEX idx_policy_status ON policies(status);
CREATE INDEX idx_policy_expiry ON policies(endDate);

-- Claim tracking
CREATE INDEX idx_claim_user ON claims(userId);
CREATE INDEX idx_claim_policy ON claims(policyId);
CREATE INDEX idx_claim_status ON claims(status);
CREATE INDEX idx_claim_number ON claims(claimNumber);

-- Notifications
CREATE INDEX idx_notif_user_read ON notifications(userId, read);
CREATE INDEX idx_notif_created ON notifications(createdAt);

-- Transactions
CREATE INDEX idx_trans_user ON transactions(userId);
CREATE INDEX idx_trans_type ON transactions(type);
CREATE INDEX idx_trans_created ON transactions(createdAt);
```

## Enums Overview

### User Enums
- `UserRole`: CLIENT, ADMIN, AGENT, SUPER_ADMIN
- `UserStatus`: ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION

### Policy Enums
- `PolicyType`: AUTO, HOME, HEALTH, LIFE, BUSINESS, TRAVEL, PET, OTHER
- `PolicyStatus`: ACTIVE, EXPIRED, CANCELLED, PENDING, SUSPENDED
- `PaymentFrequency`: MONTHLY, QUARTERLY, SEMI_ANNUAL, ANNUAL

### Claim Enums
- `ClaimStatus`: SUBMITTED, UNDER_REVIEW, PENDING_INFO, APPROVED, REJECTED, PAID, CLOSED
- `ClaimPriority`: LOW, NORMAL, HIGH, URGENT

### Document Enums
- `DocumentType`: POLICY_CONTRACT, ID_CARD, DRIVER_LICENSE, VEHICLE_REGISTRATION, etc.

### Gamification Enums
- `AchievementCategory`: POLICY_MANAGEMENT, CLAIMS, LEARNING, REFERRALS, ENGAGEMENT, SPECIAL
- `AchievementRarity`: COMMON, RARE, EPIC, LEGENDARY
- `RewardCategory`: DISCOUNT, GIFT_CARD, INSURANCE_BENEFIT, PHYSICAL_ITEM, etc.
- `TransactionType`: EARNED, SPENT, BONUS, REFUND, ADJUSTMENT, etc.

### Notification Enums
- `NotificationType`: POLICY_RENEWAL, CLAIM_UPDATE, PAYMENT_DUE, etc.
- `NotificationPriority`: LOW, NORMAL, HIGH, URGENT

### Referral Enums
- `ReferralStatus`: PENDING, COMPLETED, EXPIRED, CANCELLED
- `ReferralStage`: INVITED, SIGNED_UP, VERIFIED, FIRST_POLICY, COMPLETED

## JSON Fields (Flexible Data)

### Policy
```json
{
  "vehicleInfo": {
    "make": "Seat",
    "model": "León",
    "year": 2022,
    "licensePlate": "1234-ABC"
  },
  "propertyInfo": {
    "type": "apartment",
    "size": 100,
    "rooms": 3
  },
  "healthInfo": {
    "preExisting": ["diabetes"],
    "medications": ["metformin"]
  }
}
```

### RiskProfile
```json
{
  "vehicles": [
    {
      "type": "car",
      "make": "Seat",
      "year": 2022
    }
  ],
  "drivingRecord": {
    "accidents": 0,
    "violations": 1,
    "years": 10
  }
}
```

### Achievement Criteria
```json
{
  "type": "policy_count",
  "value": 5,
  "operator": ">=",
  "timeframe": "all_time"
}
```

## Query Patterns

### Common Query 1: User Dashboard
```typescript
// Obtener todo lo necesario para el dashboard
const dashboard = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    policies: { where: { status: 'ACTIVE' } },
    claims: { take: 5, orderBy: { createdAt: 'desc' } },
    notifications: { where: { read: false } },
    achievements: {
      where: { completed: true },
      include: { achievement: true }
    }
  }
});
```

### Common Query 2: Claim with Full Context
```typescript
// Obtener siniestro completo con todas las relaciones
const claim = await prisma.claim.findUnique({
  where: { id: claimId },
  include: {
    user: true,
    policy: true,
    documents: true,
    messages: {
      include: { user: true },
      orderBy: { createdAt: 'asc' }
    }
  }
});
```

### Common Query 3: Gamification Update
```typescript
// Actualizar XP/Coins y registrar transacción
await prisma.$transaction([
  prisma.user.update({
    where: { id: userId },
    data: { xp: { increment: 50 }, coins: { increment: 10 } }
  }),
  prisma.transaction.create({
    data: {
      userId,
      type: 'EARNED',
      amount: 10,
      description: 'Quiz completado'
    }
  })
]);
```

## Data Flow Examples

### Flow 1: Usuario completa un Quiz
```
1. QuizResult creado → score, xpEarned, coinsEarned
2. User actualizado → xp += 50, coins += 10
3. Transaction creada → QUIZ_REWARD, +10 coins
4. Achievement verificado → "first_quiz" desbloqueado?
5. Si achievement → UserAchievement creado
6. Si achievement → User actualizado → +bonus XP/coins
7. Notification creada → "Logro desbloqueado!"
```

### Flow 2: Usuario reporta Siniestro
```
1. Claim creado → status: SUBMITTED
2. Notification creada → "Siniestro recibido"
3. ClaimMessage creado → Mensaje inicial del sistema
4. Achievement verificado → "first_claim" desbloqueado?
5. Email enviado → Confirmación al usuario
6. Reminder creado → Seguimiento en 48h
```

### Flow 3: Referido Completo
```
1. Referral creado → stage: INVITED
2. Referred usuario se registra → stage: SIGNED_UP
3. Email verificado → stage: VERIFIED
4. Primera póliza → stage: FIRST_POLICY
5. Pago confirmado → stage: COMPLETED, status: COMPLETED
6. User (referrer) → coins += 100
7. User (referred) → coins += 50
8. Transaction × 2 → REFERRAL_REWARD
9. Notification × 2 → "Referido completado!"
```

## Storage Considerations

### Estimated Storage per Model (1000 users)

| Model | Rows | Storage |
|-------|------|---------|
| User | 1,000 | ~500 KB |
| Policy | 3,000 | ~1.5 MB |
| Claim | 500 | ~300 KB |
| Document | 5,000 | ~2 MB (metadata only) |
| Notification | 50,000 | ~10 MB |
| Transaction | 100,000 | ~20 MB |
| Achievement | 50 | ~20 KB |
| UserAchievement | 10,000 | ~500 KB |

**Total Estimated:** ~35 MB para 1000 usuarios activos (sin archivos)

### File Storage (S3/CloudFlare R2)
- Documentos reales almacenados externamente
- Solo URLs guardadas en DB
- Estimado: ~100 MB por usuario activo

## Backup Strategy

### What to Backup
1. **Critical Data** (daily):
   - User, Policy, Claim, RiskProfile

2. **Gamification Data** (weekly):
   - Achievement, UserAchievement, Transaction

3. **Logs** (monthly):
   - Notification, Reminder, ClaimMessage

### Backup Commands
```bash
# Full backup
pg_dump esori_db > backup_$(date +%Y%m%d).sql

# Selective backup
pg_dump esori_db -t users -t policies -t claims > critical_backup.sql
```

---

**Versión:** 1.0.0
**Última Actualización:** 2026-01-27
**Total de Modelos:** 15
**Total de Relaciones:** 32
**Total de Índices:** 45+
