# Pokedex Backend API

A lightweight Node.js Express API that serves as a backend for the Pokedex application, using PokeAPI as the source of truth for Pokemon data.

## Features

- User authentication with session management
- Paginated Pokemon listing
- Detailed Pokemon information
- Search Pokemon by name
- Comprehensive JSDoc documentation

## Tech Stack

- Node.js 24
- Express.js 5
- Axios for API calls
- In-memory session storage

## API Endpoints

### Authentication

#### POST /api/login
Authenticate user and receive session token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "token": "abc123...",
  "expiresAt": 1234567890,
  "message": "Login successful"
}
```

#### POST /api/logout
Invalidate session token.

**Headers:**
```
Authorization: Bearer <token>
```

### Pokemon

#### GET /api/pokemons
Get paginated list of Pokemon.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional): Number of Pokemon per page (1-100, default: 20)
- `offset` (optional): Starting position for pagination (default: 0)
- `search` (optional): Search Pokemon by name

**Response:**
```json
{
  "count": 1302,
  "next": "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "bulbasaur",
      "url": "https://pokeapi.co/api/v2/pokemon/1/",
      "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
    }
  ]
}
```

#### GET /api/pokemons/:id
Get detailed information for a specific Pokemon.

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `id`: Pokemon ID or name

**Response:**
```json
{
  "id": 1,
  "name": "bulbasaur",
  "height": 7,
  "weight": 69,
  "base_experience": 64,
  "images": {
    "front_default": "...",
    "front_shiny": "...",
    "official_artwork": "..."
  },
  "types": [...],
  "abilities": [...],
  "moves": [...],
  "forms": [...],
  "stats": [...],
  "species": {...}
}
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (optional):
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

4. Or start in production mode:
```bash
npm start
```

The server will run on `http://localhost:3001` by default.

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── constants.js       # Application configuration
│   ├── controllers/
│   │   ├── auth.controller.js # Authentication logic
│   │   └── pokemon.controller.js # Pokemon endpoints logic
│   ├── middleware/
│   │   └── auth.middleware.js # Authentication middleware
│   ├── routes/
│   │   ├── auth.routes.js     # Auth route definitions
│   │   └── pokemon.routes.js  # Pokemon route definitions
│   ├── services/
│   │   ├── auth.service.js    # Session management
│   │   └── pokeapi.service.js # PokeAPI integration
│   └── index.js               # Main server file
├── package.json
└── README.md
```

## Authentication

The API uses Bearer token authentication. Include the token in the Authorization header for protected endpoints:

```
Authorization: Bearer <your-token>
```

Sessions expire after 24 hours by default.

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (invalid or missing token)
- `404`: Not Found
- `500`: Internal Server Error

## Development Notes

- All endpoints are documented using JSDoc
- Session data is stored in memory (not suitable for production)
- CORS is enabled for all origins
- Request logging is enabled by default
