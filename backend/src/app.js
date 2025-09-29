const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// --- Global Error Handlers (pour le débogage) ---
process.on('uncaughtException', (err, origin) => {
  console.error(`ERREUR NON CAPTURÉE: ${err}\n` + `Origine: ${origin}`);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Rejet de promesse non géré:', promise, 'raison:', reason);
});

// Charger les variables d'environnement
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes API
app.use('/api', require('./routes'));

// Gestionnaire d'erreurs Express
app.use((err, req, res, next) => {
    console.error("Gestionnaire d'erreurs Express:", err.stack);
    res.status(500).json({ error: 'Une erreur interne est survenue' });
});

// Démarrage du serveur
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
}

module.exports = app;