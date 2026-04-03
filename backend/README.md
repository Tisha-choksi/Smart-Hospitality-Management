# ⚙️ Smart Hospitality Backend

Express.js + Node.js backend for the Smart Hospitality Management System.

**Stack:** Express 4 | TypeScript | Prisma | PostgreSQL (Supabase) | JWT Auth

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.ts                 # Entry point
│   ├── config/
│   │   ├── database.ts
│   │   ├── env.ts
│   │   └── supabase.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   ├── validation.ts
│   │   └── cors.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── guests.routes.ts
│   │   ├── staff.routes.ts
│   │   ├── requests.routes.ts
│   │   ├── feedback.routes.ts
│   │   └── analytics.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── guests.controller.ts
│   │   ├── staff.controller.ts
│   │   ├── requests.controller.ts
│   │   ├── feedback.controller.ts
│   │   └── analytics.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── guest.service.ts
│   │   ├── staff.service.ts
│   │   ├── request.service.ts
│   │   ├── feedback.service.ts
│   │   ├── email.service.ts
│   │   └── ai.service.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── errors.ts
│   │   └── validators.ts
│   └── types/
│       ├── index.ts
│       └── express.d.ts
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── migrations/              # Migration files
│   └── seed.ts                  # Seed script
├── tests/
│   ├── unit/
│   ├── integration/
│   └── setup.ts
├── tsconfig.json
├── package.json
└── .eslintrc.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (via Supabase)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Run database migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed

# Start development server
npm run dev
```

Server runs on `http://localhost:3000`

---

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start dev server with auto-reload

# Production
npm run build            # Compile TypeScript to JavaScript
npm start                # Start production server

# Database
npm run db:migrate       # Run Prisma migrations
npm run db:seed          # Populate seed data
npm run db:reset         # Reset database (⚠️ destructive)

# Code Quality
npm run lint             # Run ESLint
npm run format:check     # Check Prettier
npm run format           # Auto-format code

# Testing
npm run test             # Run Jest tests
npm run test:watch       # Watch mode
```

---

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/register    Register new user
POST   /api/auth/login       Login user
POST   /api/auth/logout      Logout user
POST   /api/auth/refresh     Refresh JWT token
GET    /api/auth/me          Get current user
```

### Guests

```
GET    /api/guests           List all guests (admin)
GET    /api/guests/:id       Get guest by ID
POST   /api/guests           Create new guest
PATCH  /api/guests/:id       Update guest
DELETE /api/guests/:id       Delete guest
```

### Service Requests

```
GET    /api/requests         List requests (paginated)
POST   /api/requests         Create request
GET    /api/requests/:id     Get request details
PATCH  /api/requests/:id     Update request
DELETE /api/requests/:id     Delete request
```

### Staff

```
GET    /api/staff            List all staff
GET    /api/staff/:id        Get staff member
POST   /api/staff            Create staff account
PATCH  /api/staff/:id        Update staff
```

### Feedback

```
POST   /api/feedback         Submit feedback
GET    /api/feedback         List feedback (admin)
GET    /api/feedback/:id     Get feedback details
```

### Analytics

```
GET    /api/analytics/sentiment        Sentiment trends
GET    /api/analytics/requests         Request metrics
GET    /api/analytics/occupancy        Room occupancy
GET    /api/analytics/revenue          Revenue data
```

---

## 🗄️ Database Schema

Managed with Prisma:

```prisma
model User {
  id          String    @id @default(cuid())
  email       String    @unique
  password    String
  name        String
  role        Role      @default(GUEST)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  guest       Guest?
  staff       Staff?
  feedback    Feedback[]
  requests    Request[]
}

enum Role {
  GUEST
  STAFF
  ADMIN
}

// See prisma/schema.prisma for full schema
```

---

## 🔐 Authentication

JWT-based authentication:

```typescript
// Middleware to protect routes
import { authenticateToken } from '@/middleware/auth';

router.get('/protected', authenticateToken, controller);

// Token verification
const token = req.headers.authorization?.split(' ')[1];
jwt.verify(token, JWT_SECRET);
```

---

## 📧 Email Service

Integrated with Resend:

```typescript
import { emailService } from '@/services/email.service';

// Send welcome email
await emailService.sendWelcome({
  email: 'guest@example.com',
  name: 'John Doe',
  bookingRef: 'BOOK123',
});
```

---

## 🤖 AI Service Integration

Call AI services for RAG & sentiment:

```typescript
import { aiService } from '@/services/ai.service';

// Get AI response with RAG
const response = await aiService.queryConcierge({
  question: 'What time is checkout?',
  guestId: '123',
});

// Analyze sentiment
const sentiment = await aiService.analyzeSentiment({
  text: 'Amazing hotel, loved the service!',
});
```

---

## 🧪 Testing

Jest + Supertest for API testing:

```typescript
// tests/integration/auth.test.ts
describe('POST /api/auth/login', () => {
  it('should login user with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
```

Run tests:
```bash
npm run test
npm run test:watch
```

---

## 🚀 Deployment

### Deploy to Render

```bash
# 1. Create Render account and new Web Service
# 2. Connect GitHub repository
# 3. Set environment variables:
DATABASE_URL=...
GROQ_API_KEY=...
GEMINI_API_KEY=...
# 4. Deploy!
```

### Environment Variables

Required in production:

```
DATABASE_URL              # PostgreSQL connection string
JWT_SECRET                # JWT signing key (32+ chars)
GROQ_API_KEY              # Groq API key
GEMINI_API_KEY            # Gemini API key
RESEND_API_KEY            # Resend email API key
UPSTASH_REDIS_URL         # Redis connection
NODE_ENV=production       # Set to production
```

---

## 📊 Performance Tips

1. **Database Indexing**: Add indexes to frequently queried columns
   ```prisma
   model Request {
     id        String  @id
     guestId   String
     status    String
     @@index([guestId])
     @@index([status])
   }
   ```

2. **Caching**: Use Redis for frequently accessed data
   ```typescript
   const cached = await redis.get(`guest:${guestId}`);
   if (!cached) {
     const guest = await db.guest.findUnique({ where: { id: guestId } });
     await redis.set(`guest:${guestId}`, JSON.stringify(guest));
   }
   ```

3. **Pagination**: Always paginate list endpoints
   ```typescript
   const requests = await db.request.findMany({
     take: limit,
     skip: (page - 1) * limit,
   });
   ```

---

## 🐛 Common Issues

### Database connection error?
- Check `DATABASE_URL` in `.env`
- Verify Supabase project is running
- Ensure IP is whitelisted in Supabase

### JWT errors?
- Check `JWT_SECRET` is set
- Verify token format: `Authorization: Bearer <token>`

### Build fails?
```bash
# Regenerate Prisma client
npx prisma generate

# Type check
npx tsc --noEmit
```

---

## 📚 Resources

- [Express Docs](https://expressjs.com/en/api.html)
- [Prisma Docs](https://www.prisma.io/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase](https://supabase.com/docs)
- [JWT](https://jwt.io/)

---

## 📄 License

MIT