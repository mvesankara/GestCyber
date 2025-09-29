const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Configuration - Point to the .env file at the project root
// NOTE: The dotenv loading was not working as expected. Hardcoding the origin for now.
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de sécurité
app.use(helmet());

// Hardcoded CORS configuration to fix the persistent issue
app.use(cors({
    origin: 'http://localhost', // Explicitly allow the frontend's origin
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX_REQUESTS || 100
});
app.use(limiter);

// Middleware général
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes de santé
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0'
    });
});

// Routes API
app.use('/api', require('./routes'));

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Une erreur interne est survenue',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Route 404
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint non trouvé' });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur GestCyber Backend démarré sur le port ${PORT}`);
    console.log(`📊 Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⏰ Démarré à: ${new Date().toISOString()}`);
});

module.exports = app;