/**
 * Main server file for Pokedex Backend API
 * @module index
 */

import express from 'express';
import cors from 'cors';
import { CONFIG } from './config/constants.js';
import authRoutes from './routes/auth.routes.js';
import pokemonRoutes from './routes/pokemon.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api', authRoutes);
app.use('/api', pokemonRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(CONFIG.PORT, () => {
  console.log(`
    ╔══════════════════════════════════════════╗
    ║   Pokedex Backend API Server Running    ║
    ╠══════════════════════════════════════════╣
    ║   Port: ${CONFIG.PORT.toString().padEnd(32)} ║
    ║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(24)} ║
    ║   PokeAPI: ${CONFIG.POKEAPI_BASE_URL.padEnd(27)} ║
    ╚══════════════════════════════════════════╝
  `);
});

export default app;
