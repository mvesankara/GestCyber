const express = require('express');
const router = express.Router();

// Importer les routes
router.use('/auth', require('./api/auth'));
router.use('/gouvernance', require('./api/gouvernance'));
router.use('/incidents', require('./api/incidents'));

// Un point de terminaison de base pour vérifier que l'API est en ligne
router.get('/', (req, res) => {
    res.json({
        message: 'API GestCyber est opérationnelle',
        endpoints: [
            '/api/auth',
            '/api/gouvernance',
            '/api/incidents'
        ]
    });
});

module.exports = router;