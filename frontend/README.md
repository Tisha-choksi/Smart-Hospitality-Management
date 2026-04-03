# 🖥️ Smart Hospitality Frontend

Next.js 14 frontend for the Smart Hospitality Management System.

**Stack:** Next.js 14 | React 18 | TypeScript | Tailwind CSS | Supabase Auth

---

## 📁 Project Structure

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (guest)/
│   │   ├── dashboard/page.tsx
│   │   ├── concierge/page.tsx
│   │   ├── requests/page.tsx
│   │   ├── feedback/page.tsx
│   │   ├── explore/page.tsx
│   │   └── layout.tsx
│   ├── (staff)/
│   │   ├── dashboard/page.tsx
│   │   ├── requests/page.tsx
│   │   ├── tasks/page.tsx
│   │   └── layout.tsx
│   ├── (admin)/
│   │   ├── analytics/page.tsx
│   │   ├── knowledge-base/page.tsx
│   │   ├── users/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   ├── chat/
│   │   ├── ChatWindow.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── ChatInput.tsx
│   │   └── TypingIndicator.tsx
│   ├── dashboard/
│   │   ├── StatsCard.tsx
│   │   ├── RequestQueue.tsx
│   │   ├── SentimentChart.tsx
│   │   └── OccupancyWidget.tsx
│   └── common/
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       ├── LoadingSpinner.tsx
│       └── ErrorBoundary.tsx
├── lib/
│   ├── supabase.ts
│   ├── api.ts
│   ├── auth.ts
│   └── utils.ts
├── styles/
│   ├── globals.css
│   ├── variables.css
│   └── components.css
├── public/
│   ├── logo.svg
│   └── icons/
├── next.config.js
├── tsconfig.json
├── package.json
└── .eslintrc.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create .env.local (copy from ../../.env)
cp .env .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start dev server on port 3000

# Production
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run format:check     # Check Prettier formatting
npm run format           # Auto-format code

# Testing
npm run test             # Run Jest tests
npm run test:watch       # Watch mode
```

---

## 🎨 Design System

All UI components follow a consistent design system:

### Colors
- **Primary**: `#007AFF` (Blue)
- **Success**: `#34C759` (Green)
- **Warning**: `#FF9500` (Orange)
- **Error**: `#FF3B30` (Red)
- **Neutral**: `#F5F5F7` (Light Gray)

### Typography
- **Heading 1**: 32px, weight 700
- **Heading 2**: 24px, weight 600
- **Body**: 16px, weight 400
- **Small**: 12px, weight 400

### Spacing
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px

See `lib/design-tokens.ts` for all design system tokens.

---

## 🔐 Authentication

Uses **Supabase Auth** (email/password + social logins):

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
});

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});
```

---

## 🌐 API Integration

Backend API client in `lib/api.ts`:

```typescript
import { api } from '@/lib/api';

// GET request
const guests = await api.get('/guests');

// POST request
await api.post('/requests', {
  guestId: '123',
  type: 'room-service',
  description: 'Need extra pillows',
});

// With authentication
api.setAuthToken(token);
```

---

## 💬 Chat / AI Concierge

Real-time chat with streaming:

```typescript
// In components/chat/ChatWindow.tsx
const response = await fetch('/api/ai/concierge/chat', {
  method: 'POST',
  body: JSON.stringify({ message: 'What time is checkout?' }),
});

const reader = response.body?.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const text = new TextDecoder().decode(value);
  setMessages(prev => [...prev, text]);
}
```

---

## 🧪 Testing

Unit tests with Jest + React Testing Library:

```typescript
// components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

Run tests:
```bash
npm run test
npm run test:watch
```

---

## 📱 Responsive Design

Mobile-first approach with Tailwind breakpoints:

```css
/* Mobile: 0px */
/* Tablet: 768px */
/* Desktop: 1024px */
/* Large: 1280px */
```

All components are fully responsive.

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Or link to CI/CD
vercel link
```

### Environment Variables (Vercel)

Set in Vercel dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_AI_SERVICE_URL=https://ai.yourdomain.com
```

---

## 📖 Component Documentation

Each component has JSDoc comments:

```typescript
/**
 * Button Component
 * @param {string} variant - 'primary' | 'secondary' | 'danger'
 * @param {boolean} disabled - Disable button
 * @param {ReactNode} children - Button content
 */
export function Button({ variant, disabled, children }) {
  // ...
}
```

---

## 🐛 Common Issues

### Port 3000 already in use?
```bash
# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Supabase auth not working?
- Check `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env.local`
- Verify auth is enabled in Supabase dashboard

### Build fails?
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

---

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 📄 License

MIT