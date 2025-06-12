const express = require('express');
const router = express.Router();

// Routes API principales
router.use('/auth', require('./api/auth'));
router.use('/incidents', require('./api/incidents'));
router.use('/actions', require('./api/actions'));
router.use('/investigations', require('./api/investigations'));
router.use('/communications', require('./api/communications'));
router.use('/systems', require('./api/systems'));
router.use('/metrics', require('./api/metrics'));
router.use('/retex', require('./api/retex'));

// Route de documentation API
router.get('/', (req, res) => {
    res.json({
        message: 'API GestCyber - Gestion de Crise Cyber',
        version: '1.0.0',
        endpoints: [
            '/api/auth - Authentification',
            '/api/incidents - Gestion des incidents',
            '/api/actions - Gestion des actions',
            '/api/investigations - Investigation numérique',
            '/api/communications - Communications de crise',
            '/api/systems - Gestion des systèmes',
            '/api/metrics - Métriques et KPIs',
            '/api/retex - Retours d\'expérience'
        ],
        documentation: '/docs'
    });
});

module.exports = router;