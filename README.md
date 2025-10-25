# Pokédex Application

A full-stack Pokédex application built with Next.js 15 and Node.js 24, featuring comprehensive Pokemon information, search, and filtering capabilities.

## Features

- **Authentication**: Secure login system with session management
- **Pokemon List**: Paginated list of Pokemon with search and sort functionality
- **Pokemon Details**: Comprehensive information including abilities, moves, stats, and forms
- **Responsive Design**: Mobile-first approach with full responsive support
- **SEO Optimized**: Meta tags, semantic HTML, and OpenGraph support
- **Atomic Design**: Well-organized component architecture
- **Type Safe**: Full TypeScript implementation
- **Tested**: Unit tests for utilities and components

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Testing**: Jest + React Testing Library

### Backend
- **Runtime**: Node.js 24
- **Framework**: Express.js 5
- **Data Source**: PokeAPI
- **Authentication**: Bearer token with in-memory sessions

## Project Structure

```
pokedex/
├── backend/                    # Backend API
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Custom middleware
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   └── index.js           # Server entry point
│   └── package.json
├── frontend/                   # Frontend application
│   ├── app/                   # Next.js pages
│   │   ├── login/            # Login page
│   │   ├── pokemon/[id]/     # Pokemon detail page
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   │   ├── atoms/           # Basic components
│   │   ├── molecules/       # Composed components
│   │   ├── organisms/       # Complex components
│   │   └── templates/       # Page templates
│   ├── constants/           # Constants and config
│   ├── enums/              # TypeScript enums
│   ├── lib/                # API client
│   ├── store/              # Zustand stores
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   └── __tests__/          # Unit tests
├── USER_STORIES.md          # User stories
├── GENAI_TASK_README.md     # GenAI task documentation
└── AI_PROMPTS_AND_EDITS.md  # AI development log
```

## Getting Started

### Prerequisites
- Node.js 20.9.0 or higher (Note: Node 24 not yet released, using Node 20+)
- npm or yarn
- GitHub CLI (for repository creation)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MaferG/pokedex.git
   cd pokedex
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on http://localhost:3001

2. **Start the Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on http://localhost:3000

3. **Access the Application**
   - Open http://localhost:3000 in your browser
   - Login with credentials: `admin / admin`

## API Documentation

### Authentication Endpoints

#### POST /api/login
Authenticate user and receive session token.

**Request**:
```json
{
  "username": "admin",
  "password": "admin"
}
```

**Response**:
```json
{
  "success": true,
  "token": "session_token_here",
  "expiresAt": 1234567890,
  "message": "Login successful"
}
```

### Pokemon Endpoints

#### GET /api/pokemons
Get paginated list of Pokemon.

**Query Parameters**:
- `limit` (optional): Number per page (1-100, default: 20)
- `offset` (optional): Starting position (default: 0)
- `search` (optional): Search by name

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "count": 1328,
  "next": "...",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "bulbasaur",
      "url": "...",
      "image": "..."
    }
  ]
}
```

#### GET /api/pokemons/:id
Get detailed Pokemon information.

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "id": 1,
  "name": "bulbasaur",
  "height": 7,
  "weight": 69,
  "images": {...},
  "types": [...],
  "abilities": [...],
  "moves": [...],
  "stats": [...],
  "species": {...}
}
```

## Running Tests

### Frontend Tests
```bash
cd frontend
npm test              # Run tests once
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

### Current Test Coverage
- Utility functions: 100%
- Validation logic: 100%
- Sort/filter functions: 100%

## Development Workflow

### Adding a New Feature

1. **Create User Story** in [USER_STORIES.md](USER_STORIES.md)
2. **Backend Changes** (if needed):
   - Add service in `backend/src/services/`
   - Add controller in `backend/src/controllers/`
   - Add route in `backend/src/routes/`
   - Add JSDoc documentation
3. **Frontend Changes**:
   - Follow Atomic Design principles
   - Add types in `frontend/types/`
   - Create components in appropriate folder
   - Add JSDoc documentation
   - Create tests in `frontend/__tests__/`

### Code Style Guidelines

- **TypeScript**: Use strict mode, avoid `any`
- **Components**: Functional components with TypeScript
- **Documentation**: JSDoc for all functions and components
- **Naming**:
  - Components: PascalCase
  - Functions/variables: camelCase
  - Constants: UPPER_SNAKE_CASE
- **File Structure**: One component per file
- **Testing**: Write tests for utilities and complex logic

## Architecture Decisions

### Why Atomic Design?
Provides clear component hierarchy and maximum reusability. Components are organized from simple to complex:
- **Atoms**: Basic UI elements (Button, Input)
- **Molecules**: Simple combinations (PokemonCard, LoginForm)
- **Organisms**: Complex sections (PokemonGrid, Header)
- **Templates**: Page layouts (MainLayout)

### Why Zustand?
Lightweight state management with simple API and minimal boilerplate. Perfect for medium-sized applications.

### Why Container-Presentational Pattern?
Separates concerns between data/logic (containers) and UI (presentational components), making components more reusable and testable.

## User Stories

See [USER_STORIES.md](USER_STORIES.md) for detailed user stories following the Given-When-Then format with:
- Role
- Complexity (Fibonacci estimation)
- Acceptance criteria
- Definition of Done

## GenAI Task

See [GENAI_TASK_README.md](GENAI_TASK_README.md) for the TypeScript Table Component implementation for task management with full CRUD functionality.

## AI Development Log

See [AI_PROMPTS_AND_EDITS.md](AI_PROMPTS_AND_EDITS.md) for a comprehensive log of all AI-generated code, prompts used, and human modifications made during development.

## Environment Variables

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Deployment

### Backend Deployment
1. Set environment variables
2. Install dependencies: `npm install --production`
3. Start server: `npm start`

### Frontend Deployment
1. Set `NEXT_PUBLIC_API_URL` to production backend URL
2. Build: `npm run build`
3. Start: `npm start`

### Recommended Platforms
- **Backend**: Railway, Render, Heroku
- **Frontend**: Vercel, Netlify
- **Database** (for production): PostgreSQL, MongoDB
- **Session Store** (for production): Redis

## Known Limitations

- **In-Memory Sessions**: Not suitable for production (use Redis)
- **No Database**: Pokemon data comes from PokeAPI only
- **Basic Auth**: Simple admin/admin credentials (implement proper auth for production)
- **No Rate Limiting**: Should be added for production
- **Client-Side Search**: Works well for current page only

## Future Enhancements

- [ ] Advanced filtering (by type, generation, etc.)
- [ ] Pokemon comparison feature
- [ ] Favorites/bookmarks system
- [ ] Team builder
- [ ] Dark mode
- [ ] Internationalization (i18n)
- [ ] Progressive Web App (PWA)
- [ ] E2E testing
- [ ] Storybook documentation
- [ ] Performance optimizations (image optimization, lazy loading)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project was created as part of a technical interview assessment.

## Contact

For questions or feedback about this project, please open an issue on GitHub.

---

Built with Claude Code - AI-assisted development
