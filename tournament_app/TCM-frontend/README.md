# Tournament Management System - Frontend

A complete, professional frontend application for tournament creation and setup. Built with React, Vite, and Tailwind CSS with a carefully designed color palette and responsive UI components.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will open at `http://localhost:3000`

## 🎨 Design System

### Professional Color Palette

The application uses a carefully crafted color palette configured in Tailwind:

- **Primary**: `#0EA5E9` - Main brand color for CTAs and highlights
- **Primary Dark**: `#0B3D91` - Hover states and emphasis
- **Accent Teal**: `#06B6D4` - Secondary actions and accents
- **Accent Coral**: `#FF6B6B` - Warnings and destructive actions
- **Gold**: `#F59E0B` - Premium features and highlights
- **Success**: `#10B981` - Success states and confirmations
- **Slate**: `#475569` - Primary text color
- **Surface**: `#F8FAFC` - Background color
- **Card**: `#FFFFFF` - Card backgrounds

### Custom Components

Pre-built component classes available in `src/index.css`:

- `.card` - Standard card with shadow and hover effect
- `.btn-cta` - Primary call-to-action button
- `.btn-secondary` - Secondary action button
- `.btn-danger` - Destructive action button
- `.btn-icon` - Icon-only button
- `.glow-primary` - Neon glow effect
- `.grad-primary` - Primary gradient (blue to teal)
- `.input-field` - Standard input field
- `.textarea-field` - Text area field
- `.select-field` - Select dropdown
- `.label-field` - Form label
- `.badge-*` - Status badges (success, warning, info, danger)
- `.toast-*` - Toast notifications

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── DemoBanner.jsx
│   │   ├── FieldManager.jsx
│   │   ├── Layout.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── SnapshotList.jsx
│   │   ├── SponsorManager.jsx
│   │   └── Toast.jsx
│   ├── pages/              # Page components
│   │   ├── Dashboard.jsx
│   │   ├── TournamentForm.jsx
│   │   └── VisitorRegistration.jsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useToast.js
│   │   └── useTournamentSocket.js
│   ├── data/               # Seed data for demo mode
│   │   └── seed.js
│   ├── api.js              # API integration layer
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles + Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .env.example
```

## ✨ Features

### 1. Tournament Dashboard
- View all tournaments in a responsive card grid
- Search by name, slug, or location
- Filter by status (draft, active, completed, cancelled)
- Quick stats display (teams, matches, fields)
- Quick actions: Edit, Publish, Snapshot, Archive
- **Create Tournament** button always opens a fresh, empty form

### 2. Create/Edit Tournament
- Clear heading distinction:
  - **"Create Tournament"** when creating new
  - **"Edit Tournament"** when editing existing
- Comprehensive form fields:
  - Title, Slug (with auto-generate)
  - Description and Rules (textarea)
  - Start/End datetime with timezone
  - Location
  - Max teams
  - Registration close date
- Multi-field support with time slots and buffers
- Sponsor management with logo URLs
- Publish toggle
- Auto-save on submit with loading state

### 3. Multi-Field Support
- Add/Edit/Remove playing fields
- Per-field configuration:
  - Name
  - Open/Close times
  - Buffer minutes between matches
- Visual field counter
- Scheduled matches widget (stub ready for backend)

### 4. Real-Time Integration
- WebSocket hook: `useTournamentSocket.js`
- Connects to: `${VITE_WS_BASE}/ws/tournaments/${id}/`
- Expected message format:
  ```json
  {
    "type": "tournament.updated" | "match.scheduled" | "team.registered" | "field.updated",
    "payload": { /* relevant data */ }
  }
  ```
- Automatic fallback to polling every 10s if WebSocket unavailable
- Graceful reconnection handling

### 5. Historical Snapshots
- Create snapshots with optional description
- List all snapshots with timestamps
- Download snapshot as JSON
- Backend API endpoint: `POST /api/tournaments/:id/snapshot/`

### 6. Visitor Registration
- Registration form: name, email, phone, role
- Role options: Guest, Volunteer, Press
- Recent visitors list with status badges
- Check-in toggle (client-side state management)
- Backend API endpoint: `POST /api/visitors/`

## 🔌 Backend API Integration

### Demo Mode
If the backend is unavailable, the app automatically falls back to seed data and displays a dismissible banner: **"Demo mode — no backend connected"**

### Required Backend Endpoints

#### Tournaments

**GET /api/tournaments/**
- Fetch all tournaments
- Response:
  ```json
  [
    {
      "id": "evt-tca",
      "title": "TCA Championship 2025",
      "slug": "tca-2025",
      "description": "Tournament description",
      "rules": "Tournament rules",
      "start_date": "2025-11-15T09:00:00Z",
      "end_date": "2025-11-17T18:00:00Z",
      "timezone": "America/New_York",
      "location": "Madison Square Garden, New York",
      "max_teams": 16,
      "registration_close": "2025-11-10T23:59:59Z",
      "status": "draft",
      "is_published": false,
      "sponsors": [...],
      "fields": [...],
      "stats": {
        "teams_registered": 12,
        "matches_scheduled": 24,
        "fields_count": 2
      }
    }
  ]
  ```

**GET /api/tournaments/:id/**
- Fetch single tournament with full details
- Response: Same structure as above

**POST /api/tournaments/**
- Create new tournament
- Request body: Tournament object (without id)
- Response: Created tournament with assigned id

**PATCH /api/tournaments/:id/**
- Update existing tournament
- Request body: Partial tournament object
- Response: Updated tournament

**DELETE /api/tournaments/:id/**
- Delete tournament
- Response: 204 No Content or `{ "success": true }`

#### Snapshots

**GET /api/tournaments/:id/snapshots/**
- Fetch all snapshots for a tournament
- Response:
  ```json
  [
    {
      "id": "snap1",
      "tournament_id": "evt-tca",
      "created_at": "2025-10-28T10:00:00Z",
      "created_by": "admin@example.com",
      "description": "Pre-launch snapshot",
      "data": { /* full tournament state */ }
    }
  ]
  ```

**POST /api/tournaments/:id/snapshot/**
- Create snapshot of current tournament state
- Request body: `{ "description": "optional description" }`
- Response: Created snapshot object

#### Visitors

**GET /api/visitors/**
- Fetch all registered visitors
- Response:
  ```json
  [
    {
      "id": "vis1",
      "name": "John Smith",
      "email": "john@example.com",
      "phone": "+1-555-0123",
      "role": "press",
      "checked_in": true,
      "registered_at": "2025-10-29T09:15:00Z"
    }
  ]
  ```

**POST /api/visitors/**
- Register new visitor
- Request body:
  ```json
  {
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+1-555-0123",
    "role": "guest|volunteer|press"
  }
  ```
- Response: Created visitor object with id

**PATCH /api/visitors/:id/**
- Update visitor (e.g., check-in status)
- Request body: `{ "checked_in": true }`
- Response: Updated visitor object

#### Team Registration (for Student Portal Integration)

**POST /api/tournaments/:id/teams/**
- Register a team for a tournament (called from student portal)
- Request body:
  ```json
  {
    "name": "Thunder Strikers",
    "captain": "John Doe",
    "contact_email": "team@example.com",
    "contact_phone": "+1-555-0123",
    "members": [
      {
        "name": "Player 1",
        "student_id": "STU001",
        "email": "player1@example.com"
      }
    ]
  }
  ```
- Response: Created team object with id
- **This endpoint is automatically called when students register from the student portal**
- The tournament frontend will automatically refresh to show new teams

**GET /api/tournaments/:id/teams/**
- Fetch all teams registered for a tournament
- Response:
  ```json
  [
    {
      "id": "team1",
      "tournament_id": "evt-tca",
      "name": "Thunder Strikers",
      "captain": "John Doe",
      "contact_email": "team@example.com",
      "contact_phone": "+1-555-0123",
      "registered_at": "2025-10-28T14:30:00Z",
      "members": [...]
    }
  ]
  ```

**PATCH /api/tournaments/:id/teams/:teamId/**
- Update team information
- Request body: Partial team object
- Response: Updated team object

**DELETE /api/tournaments/:id/teams/:teamId/**
- Withdraw/remove team from tournament
- Response: 204 No Content

#### Authentication (Optional)
All endpoints accept optional `Authorization: Bearer <token>` header.

## 🔗 Student Portal Integration

### How Team Registration Works:

1. **Student Portal** → Student fills registration form
2. **Backend** → Receives registration via `POST /api/tournaments/:id/teams/`
3. **Backend** → Creates team record in database
4. **Backend** → Sends WebSocket notification to tournament admin frontend
5. **Tournament Frontend** → Receives update via WebSocket (or polling)
6. **Tournament Frontend** → Automatically refreshes team list and updates stats

### WebSocket Message for New Team:
```json
{
  "type": "team.registered",
  "payload": {
    "tournament_id": "evt-tca",
    "team": {
      "id": "team123",
      "name": "Thunder Strikers",
      "captain": "John Doe"
    },
    "stats": {
      "teams_registered": 13,
      "matches_scheduled": 12
    }
  }
}
```

### Real-Time Updates:
- The `useTournamentSocket` hook listens for `team.registered` events
- When a team registers from the student portal, the admin dashboard updates automatically
- No manual refresh needed!

## 🧪 User Flow Verification

### Flow 1: Demo Mode
1. Open application without backend running
2. ✓ See TCA seeded tournament on dashboard
3. ✓ Banner displays "Demo mode — no backend connected"
4. ✓ All features work with local state

### Flow 2: Create Tournament
1. Click **"Create Tournament"** button on dashboard
2. ✓ Form opens with heading **"Create Tournament"**
3. ✓ All fields are empty
4. Fill in required fields (Title, Slug, Location, Dates)
5. Add fields using **"+ Add Field"**
6. Add sponsors using **"+ Add Sponsor"**
7. Click **"Save Tournament"**
8. ✓ Success toast appears
9. ✓ Redirects to dashboard
10. ✓ New tournament appears in list

### Flow 3: Edit Tournament
1. Click **"Edit"** button on tournament card
2. ✓ Form opens with heading **"Edit Tournament"**
3. ✓ All fields pre-filled with tournament data
4. Modify any fields
5. Add/remove fields or sponsors
6. Click **"Save Tournament"**
7. ✓ Success toast appears
8. ✓ Changes reflected on dashboard

### Flow 4: Manage Fields
1. Open tournament form (create or edit)
2. Click **"+ Add Field"**
3. ✓ New field form appears
4. Enter field name, times, and buffer
5. ✓ Field counter updates
6. Click remove icon to delete field
7. ✓ Confirmation dialog appears
8. ✓ Field removed from list

### Flow 5: Create Snapshot
1. On dashboard, click **"📸 Snapshot"** button
2. ✓ Prompt asks for description
3. Enter description or leave blank
4. ✓ Success toast appears
5. Edit tournament to see snapshots section
6. ✓ New snapshot appears in list
7. Click **"Download"**
8. ✓ JSON file downloads

### Flow 6: Register Visitor
1. Navigate to **"Visitors"** page via sidebar
2. Fill in visitor registration form
3. Select role (Guest/Volunteer/Press)
4. Click **"Register Visitor"**
5. ✓ Success toast appears
6. ✓ Visitor appears in recent visitors list
7. Click **"Check In"** button
8. ✓ Visitor card turns green with checkmark
9. Click **"Cancel"** to undo check-in
10. ✓ Card returns to default state

## 🎯 Key Features for Production

### Responsive Design
- Mobile-first approach
- Sidebar collapses to top navigation on small screens
- Touch-friendly button sizes
- Optimized card layouts for all screen sizes

### Accessibility
- Semantic HTML structure
- ARIA labels on icon buttons
- Keyboard navigation support
- Focus outlines (`.focus-outline` class)
- Minimum color contrast ratios met

### Performance
- Code splitting with React Router
- Lazy loading ready (can add React.lazy)
- Optimized Tailwind CSS (purged unused classes)
- Fast Vite dev server and builds

### User Experience
- Loading spinners for async operations
- Toast notifications for feedback
- Confirmation dialogs for destructive actions
- Auto-generated slugs from titles
- Sticky form actions bar
- Micro-interactions (hover effects, transitions)

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local`:

```env
VITE_API_BASE=http://localhost:8000/api
VITE_WS_BASE=ws://localhost:8000
```

### Tailwind Customization

Edit `tailwind.config.js` to modify:
- Color palette
- Box shadows
- Border radius
- Content paths for purging

## 📝 TODO Comments in Code

The codebase includes TODO comments where backend implementation is needed:

- `src/api.js` - All API functions have fallback stubs
- `src/components/FieldManager.jsx` - Scheduled matches calculation
- `src/hooks/useTournamentSocket.js` - Polling implementation details
- `src/components/SnapshotList.jsx` - Full snapshot data structure

## 🐛 Development Notes

### CSS Warnings
You may see warnings about unknown `@tailwind` and `@apply` directives in `src/index.css`. These are expected and handled by PostCSS/Tailwind during the build process. They don't affect functionality.

### WebSocket Fallback
The WebSocket connection will gracefully fail and switch to polling if:
- WebSocket URL is unreachable
- Connection times out
- Server doesn't support WebSocket protocol

### Demo Mode Persistence
Changes made in demo mode are stored in component state only and will be lost on page refresh. Connect to a backend for persistence.

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

Output will be in `dist/` directory. Serve with any static hosting:

- Vercel
- Netlify
- AWS S3 + CloudFront
- Nginx
- Apache

### Environment Variables for Production

Set these in your hosting platform:
- `VITE_API_BASE` - Your production API URL
- `VITE_WS_BASE` - Your production WebSocket URL

## 📄 License

This project is part of the Tournament Management System.

## 🤝 Contributing

When adding new features:
1. Follow the existing component structure
2. Use Tailwind utility classes
3. Add toast notifications for user feedback
4. Include loading states for async operations
5. Add TODO comments where backend integration is needed
6. Update this README with new features and API endpoints

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
