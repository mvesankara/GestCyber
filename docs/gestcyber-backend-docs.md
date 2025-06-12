# Documentation Technique - Backend GestCyber

## Vue d'ensemble

GestCyber Backend est une API REST sÃ©curisÃ©e dÃ©veloppÃ©e en Node.js avec Express.js, conÃ§ue pour gÃ©rer les crises cyber selon les recommandations de l'ANSSI. Le systÃ¨me implÃ©mente les quatre phases de gestion de crise cyber et offre une plateforme complÃ¨te de coordination des Ã©quipes de rÃ©ponse Ã  incident.

## Architecture

### Stack technologique
- **Runtime** : Node.js 18+
- **Framework** : Express.js 4.18+
- **Base de donnÃ©es** : PostgreSQL 15+
- **Cache** : Redis 7+
- **ORM** : SQL natif avec pool de connexions
- **Authentification** : JWT (JSON Web Tokens)
- **SÃ©curitÃ©** : Helmet, CORS, Rate Limiting
- **Logs** : Winston
- **Tests** : Jest + Supertest
- **Conteneurisation** : Docker + Docker Compose

### Structure des dossiers

```
backend/
âââ src/
â   âââ controllers/          # Logique mÃ©tier des endpoints
â   â   âââ incidentController.js
â   â   âââ actionController.js
â   â   âââ investigationController.js
â   â   âââ communicationController.js
â   â   âââ systemController.js
â   â   âââ metricsController.js
â   â   âââ retexController.js
â   âââ routes/               # DÃ©finition des routes API
â   â   âââ api/
â   â   â   âââ incidents.js
â   â   â   âââ actions.js
â   â   â   âââ investigations.js
â   â   â   âââ communications.js
â   â   â   âââ systems.js
â   â   â   âââ metrics.js
â   â   â   âââ retex.js
â   â   âââ index.js
â   âââ middleware/           # Middleware Express
â   â   âââ auth.js          # Authentification JWT
â   â   âââ validation.js    # Validation des donnÃ©es
â   â   âââ logging.js       # Logs des requÃªtes
â   â   âââ errorHandler.js  # Gestion d'erreurs
â   âââ services/            # Services mÃ©tier
â   â   âââ authService.js
â   â   âââ alertService.js
â   â   âââ notificationService.js
â   â   âââ reportService.js
â   â   âââ metricsService.js
â   âââ utils/               # Utilitaires
â   â   âââ database.js
â   â   âââ logger.js
â   â   âââ constants.js
â   â   âââ validators.js
â   âââ config/              # Configuration
â   â   âââ database.js
â   â   âââ auth.js
â   â   âââ app.js
â   âââ app.js               # Point d'entrÃ©e
âââ scripts/                 # Scripts utilitaires
â   âââ migrate.js
â   âââ seed.js
â   âââ backup.js
âââ tests/                   # Tests automatisÃ©s
âââ docs/                    # Documentation
âââ package.json
âââ Dockerfile
âââ docker-compose.yml
âââ README.md
```

## API Endpoints

### Authentification
```
POST   /api/auth/login           # Connexion utilisateur
POST   /api/auth/logout          # DÃ©connexion
POST   /api/auth/refresh         # Renouvellement token
GET    /api/auth/me              # Profil utilisateur actuel
```

### Gestion des incidents
```
POST   /api/incidents            # CrÃ©er un incident
GET    /api/incidents            # Liste des incidents (avec pagination)
GET    /api/incidents/:id        # DÃ©tails d'un incident
PUT    /api/incidents/:id        # Modifier un incident
DELETE /api/incidents/:id        # Fermer un incident
PATCH  /api/incidents/:id/phase  # Changer de phase
GET    /api/incidents/:id/timeline     # Chronologie
GET    /api/incidents/:id/metrics      # MÃ©triques
POST   /api/incidents/:id/escalate     # Escalader
```

### Gestion des actions
```
POST   /api/actions              # CrÃ©er une action
GET    /api/incidents/:id/actions     # Actions d'un incident
GET    /api/actions/:id          # DÃ©tails d'une action
PUT    /api/actions/:id          # Modifier une action
PATCH  /api/actions/:id/assign   # Assigner une action
PATCH  /api/actions/:id/complete # Marquer comme terminÃ©e
POST   /api/actions/:id/escalate # Escalader une action
GET    /api/actions/kpis         # KPIs des actions
```

### Investigation numÃ©rique
```
POST   /api/investigations       # CrÃ©er une investigation
GET    /api/investigations/:id   # DÃ©tails investigation
PUT    /api/investigations/:id/iocs    # Mettre Ã  jour IoCs
PATCH  /api/investigations/:id/finalize # Finaliser
GET    /api/investigations/:id/evidence # Preuves collectÃ©es
POST   /api/investigations/:id/report   # GÃ©nÃ©rer rapport
```

### Communications
```
POST   /api/communications       # CrÃ©er une communication
GET    /api/communications       # Liste des communications
GET    /api/communications/:id   # DÃ©tails communication
PUT    /api/communications/:id   # Modifier communication
POST   /api/communications/:id/send     # Envoyer
GET    /api/communications/templates    # Templates disponibles
```

### SystÃ¨mes et actifs
```
GET    /api/systems              # Liste des systÃ¨mes
POST   /api/systems              # Ajouter un systÃ¨me
GET    /api/systems/:id          # DÃ©tails systÃ¨me
PUT    /api/systems/:id          # Modifier systÃ¨me
PATCH  /api/systems/:id/status   # Changer statut
GET    /api/systems/:id/dependencies    # DÃ©pendances
```

### Reconstruction
```
GET    /api/reconstructions      # Plans de reconstruction
POST   /api/reconstructions      # CrÃ©er plan reconstruction
GET    /api/reconstructions/:id  # DÃ©tails plan
PUT    /api/reconstructions/:id  # Modifier plan
PATCH  /api/reconstructions/:id/start   # DÃ©marrer reconstruction
PATCH  /api/reconstructions/:id/complete # Finaliser reconstruction
```

### MÃ©triques et rapports
```
GET    /api/metrics              # MÃ©triques gÃ©nÃ©rales
GET    /api/metrics/incidents    # MÃ©triques par incident
GET    /api/metrics/teams        # Performance des Ã©quipes
GET    /api/reports              # Liste des rapports
POST   /api/reports/generate     # GÃ©nÃ©rer rapport
GET    /api/reports/:id/download # TÃ©lÃ©charger rapport
```

### RETEX
```
POST   /api/retex                # CrÃ©er RETEX
GET    /api/retex                # Liste RETEX
GET    /api/retex/:id            # DÃ©tails RETEX
PUT    /api/retex/:id            # Modifier RETEX
PATCH  /api/retex/:id/finalize   # Finaliser RETEX
```

## SÃ©curitÃ©

### Authentification et autorisation
- **JWT** : Tokens avec expiration configurable
- **Hachage** : Mots de passe avec bcrypt (12 rounds)
- **RBAC** : ContrÃ´le d'accÃ¨s basÃ© sur les rÃ´les
- **2FA** : Support de l'authentification Ã  deux facteurs (optionnel)

### Protection des endpoints
- **Rate Limiting** : 100 requÃªtes/15 minutes par IP
- **CORS** : Configuration restrictive
- **Helmet** : Headers de sÃ©curitÃ© HTTP
- **Validation** : Validation stricte des entrÃ©es avec Joi
- **SQL Injection** : RequÃªtes paramÃ©trÃ©es uniquement

### Audit et logs
- **Winston** : Logs structurÃ©s avec niveaux
- **Audit Trail** : TraÃ§abilitÃ© de toutes les actions
- **Monitoring** : MÃ©triques de performance et santÃ©

## Configuration

### Variables d'environnement
```env
# Base
NODE_ENV=production
PORT=5000

# Base de donnÃ©es
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gestcyber
DB_USER=gestcyber_user
DB_PASSWORD=secure_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password

# JWT
JWT_SECRET=very_long_secret_key
JWT_EXPIRES_IN=24h

# Services externes
TWILIO_ACCOUNT_SID=...
SENDGRID_API_KEY=...
SLACK_BOT_TOKEN=...
```

### Niveaux de logs
- **error** : Erreurs critiques
- **warn** : Avertissements
- **info** : Informations gÃ©nÃ©rales
- **debug** : Informations de dÃ©bogage

## DÃ©ploiement

### PrÃ©requis
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker (optionnel)

### Installation locale
```bash
# Cloner le repository
git clone https://github.com/your-org/gestcyber-backend.git
cd gestcyber-backend

# Installer les dÃ©pendances
npm install

# Configurer l'environnement
cp .env.example .env
# Ãditer .env avec vos valeurs

# CrÃ©er la base de donnÃ©es
npm run db:migrate

# InsÃ©rer les donnÃ©es de test
npm run db:seed

# DÃ©marrer en mode dÃ©veloppement
npm run dev

# Ou en mode production
npm start
```

### DÃ©ploiement Docker
```bash
# Construire et dÃ©marrer les services
docker-compose up -d

# VÃ©rifier l'Ã©tat des services
docker-compose ps

# Voir les logs
docker-compose logs -f backend
```

### DÃ©ploiement production
```bash
# Build de l'image
docker build -t gestcyber-backend:latest .

# Tag pour registry
docker tag gestcyber-backend:latest registry.example.com/gestcyber-backend:latest

# Push vers registry
docker push registry.example.com/gestcyber-backend:latest
```

## Monitoring et maintenance

### Health checks
```bash
# SantÃ© de l'API
curl http://localhost:5000/health

# SantÃ© de la base de donnÃ©es
curl http://localhost:5000/health/db

# MÃ©triques Prometheus
curl http://localhost:9090/metrics
```

### Logs
```bash
# Logs en temps rÃ©el
docker-compose logs -f backend

# Logs spÃ©cifiques
tail -f logs/gestcyber.log | grep ERROR
```

### Sauvegarde base de donnÃ©es
```bash
# Sauvegarde manuelle
npm run db:backup

# Sauvegarde via Docker
docker exec gestcyber-postgres pg_dump -U gestcyber_user gestcyber > backup.sql
```

## Tests

### Lancer les tests
```bash
# Tests unitaires
npm test

# Tests avec couverture
npm run test:coverage

# Tests en mode watch
npm run test:watch

# Tests d'intÃ©gration
npm run test:integration
```

### Structure des tests
```
tests/
âââ unit/                    # Tests unitaires
â   âââ controllers/
â   âââ services/
â   âââ utils/
âââ integration/             # Tests d'intÃ©gration
â   âââ api/
â   âââ database/
âââ fixtures/                # DonnÃ©es de test
```

## Contribution

### Standards de code
- **ESLint** : Configuration Standard
- **Prettier** : Formatage automatique
- **Commits** : Convention Conventional Commits
- **Branches** : GitFlow

### Workflow de dÃ©veloppement
1. CrÃ©er une branche feature
2. DÃ©velopper et tester
3. Soumettre une Pull Request
4. Review de code
5. Tests automatisÃ©s
6. Merge vers develop

## Support et dÃ©pannage

### Erreurs communes

**Erreur de connexion DB**
```bash
# VÃ©rifier que PostgreSQL fonctionne
docker-compose ps postgres

# VÃ©rifier les logs
docker-compose logs postgres
```

**ProblÃ¨me de permissions**
```bash
# VÃ©rifier les permissions utilisateur
ls -la logs/
chmod 755 logs/
```

**MÃ©moire insuffisante**
```bash
# Augmenter la limite Node.js
node --max-old-space-size=4096 src/app.js
```

### Contact support
- **Email** : support@gestcyber.com
- **Issues** : GitHub Issues
- **Documentation** : Wiki interne