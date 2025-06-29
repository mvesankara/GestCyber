# Documentation Technique - Backend GestCyber

## Vue d'ensemble

GestCyber Backend est une API REST securisee developpee en Node.js avec Express.js, concue pour gerer les crises cyber selon les recommandations de l'ANSSI. Le systeme implemente les quatre phases de gestion de crise cyber et offre une plateforme complete de coordination des equipes de reponse a incident.

## Architecture

### Stack technologique
- **Runtime** : Node.js 18+
- **Framework** : Express.js 4.18+
- **Base de donnees** : PostgreSQL 15+
- **Cache** : Redis 7+
- **ORM** : SQL natif avec pool de connexions
- **Authentification** : JWT (JSON Web Tokens)
- **Securite** : Helmet, CORS, Rate Limiting
- **Logs** : Winston
- **Tests** : Jest + Supertest
- **Conteneurisation** : Docker + Docker Compose

### Structure des dossiers

```
backend/
ââ🏾â🏾 src/
â   â🏾â🏾â🏾 controllers/          # Logique metier des endpoints
â   â🏾   â🏾â🏾â🏾 incidentController.js
â🏾   â🏾   â🏾â🏾â🏾 actionController.js
â🏾   â🏾   â🏾â🏾â🏾 investigationController.js
â🏾   â🏾   â🏾â🏾â🏾 communicationController.js
â🏾   â🏾   â🏾â🏾â🏾 systemController.js
â🏾   â🏾   â🏾â🏾â🏾 metricsController.js
â🏾   â🏾   â🏾â🏾â🏾 retexController.js
â🏾   â🏾â🏾â🏾 routes/               # Definition des routes API
â🏾   â🏾   â🏾â🏾â🏾 api/
â🏾   â🏾   â🏾   â🏾â🏾â🏾 incidents.js
â🏾   â🏾   â🏾   â🏾â🏾â🏾 actions.js
â🏾   â🏾   â🏾   â🏾â🏾â🏾 investigations.js
â🏾   â🏾   â🏾   â🏾â🏾â🏾 communications.js
â🏾   â🏾   â🏾   â🏾â🏾â🏾 systems.js
â🏾   â🏾   â🏾   â🏾â🏾â🏾 metrics.js
â🏾   â🏾   â🏾   â🏾â🏾â🏾 retex.js
â🏾   â🏾   â🏾â🏾â🏾 index.js
â🏾   â🏾â🏾â🏾 middleware/           # Middleware Express
â🏾   â🏾   â🏾â🏾â🏾 auth.js          # Authentification JWT
â🏾   â🏾   â🏾â🏾â🏾 validation.js    # Validation des donnees
â🏾   â🏾   â🏾â🏾â🏾 logging.js       # Logs des requetes
â🏾   â🏾   â🏾â🏾â🏾 errorHandler.js  # Gestion d'erreurs
â🏾   â🏾â🏾â🏾 services/            # Services metier
â🏾   â🏾   â🏾â🏾â🏾 authService.js
â🏾   â🏾   â🏾â🏾â🏾 alertService.js
â🏾   â🏾   â🏾â🏾â🏾 notificationService.js
â🏾   â🏾   â🏾â🏾â🏾 reportService.js
â🏾   â🏾   â🏾â🏾â🏾 metricsService.js
â🏾   â🏾â🏾â🏾 utils/               # Utilitaires
â🏾   â🏾   â🏾â🏾â🏾 database.js
â🏾   â🏾   â🏾â🏾â🏾 logger.js
â🏾   â🏾   â🏾â🏾â🏾 constants.js
â🏾   â🏾   â🏾â🏾â🏾 validators.js
â🏾   â🏾â🏾â🏾 config/              # Configuration
â🏾   â🏾   â🏾â🏾â🏾 database.js
â🏾   â🏾   â🏾â🏾â🏾 auth.js
â🏾   â🏾   â🏾â🏾â🏾 app.js
â🏾   â🏾â🏾â🏾 app.js               # Point d'entree
â🏾â🏾â🏾 scripts/                 # Scripts utilitaires
â🏾   â🏾â🏾â🏾 migrate.js
â🏾   â🏾â🏾â🏾 seed.js
â🏾   â🏾â🏾â🏾 backup.js
â🏾â🏾â🏾 tests/                   # Tests automatises
â🏾â🏾â🏾 docs/                    # Documentation
â🏾â🏾â🏾 package.json
â🏾â🏾â🏾 Dockerfile
â🏾â🏾â🏾 docker-compose.yml
â🏾â🏾â🏾 README.md
```

## API Endpoints

### Authentification
```
POST   /api/auth/login           # Connexion utilisateur
POST   /api/auth/logout          # Deconnexion
POST   /api/auth/refresh         # Renouvellement token
GET    /api/auth/me              # Profil utilisateur actuel
```

### Gestion des incidents
```
POST   /api/incidents            # Creer un incident
GET    /api/incidents            # Liste des incidents (avec pagination)
GET    /api/incidents/:id        # Details d'un incident
PUT    /api/incidents/:id        # Modifier un incident
DELETE /api/incidents/:id        # Fermer un incident
PATCH  /api/incidents/:id/phase  # Changer de phase
GET    /api/incidents/:id/timeline     # Chronologie
GET    /api/incidents/:id/metrics      # Metriques
POST   /api/incidents/:id/escalate     # Escalader
```

### Gestion des actions
```
POST   /api/actions              # Creer une action
GET    /api/incidents/:id/actions     # Actions d'un incident
GET    /api/actions/:id          # Details d'une action
PUT    /api/actions/:id          # Modifier une action
PATCH  /api/actions/:id/assign   # Assigner une action
PATCH  /api/actions/:id/complete # Marquer comme terminee
POST   /api/actions/:id/escalate # Escalader une action
GET    /api/actions/kpis         # KPIs des actions
```

### Investigation numerique
```
POST   /api/investigations       # Creer une investigation
GET    /api/investigations/:id   # Details investigation
PUT    /api/investigations/:id/iocs    # Mettre a jour IoCs
PATCH  /api/investigations/:id/finalize # Finaliser
GET    /api/investigations/:id/evidence # Preuves collectees
POST   /api/investigations/:id/report   # Generer rapport
```

### Communications
```
POST   /api/communications       # Creer une communication
GET    /api/communications       # Liste des communications
GET    /api/communications/:id   # Details communication
PUT    /api/communications/:id   # Modifier communication
POST   /api/communications/:id/send     # Envoyer
GET    /api/communications/templates    # Templates disponibles
```

### Systemes et actifs
```
GET    /api/systems              # Liste des systemes
POST   /api/systems              # Ajouter un systeme
GET    /api/systems/:id          # Details systeme
PUT    /api/systems/:id          # Modifier systeme
PATCH  /api/systems/:id/status   # Changer statut
GET    /api/systems/:id/dependencies    # Dependances
```

### Reconstruction
```
GET    /api/reconstructions      # Plans de reconstruction
POST   /api/reconstructions      # Creer plan reconstruction
GET    /api/reconstructions/:id  # Details plan
PUT    /api/reconstructions/:id  # Modifier plan
PATCH  /api/reconstructions/:id/start   # Demarrer reconstruction
PATCH  /api/reconstructions/:id/complete # Finaliser reconstruction
```

### Metriques et rapports
```
GET    /api/metrics              # Metriques generales
GET    /api/metrics/incidents    # Metriques par incident
GET    /api/metrics/teams        # Performance des equipes
GET    /api/reports              # Liste des rapports
POST   /api/reports/generate     # Generer rapport
GET    /api/reports/:id/download # Telecharger rapport
```

### RETEX
```
POST   /api/retex                # Creer RETEX
GET    /api/retex                # Liste RETEX
GET    /api/retex/:id            # Details RETEX
PUT    /api/retex/:id            # Modifier RETEX
PATCH  /api/retex/:id/finalize   # Finaliser RETEX
```

## Securite

### Authentification et autorisation
- **JWT** : Tokens avec expiration configurable
- **Hachage** : Mots de passe avec bcrypt (12 rounds)
- **RBAC** : Controle d'acces base sur les roles
- **2FA** : Support de l'authentification a deux facteurs (optionnel)

### Protection des endpoints
- **Rate Limiting** : 100 requetes/15 minutes par IP
- **CORS** : Configuration restrictive
- **Helmet** : Headers de securite HTTP
- **Validation** : Validation stricte des entrees avec Joi
- **SQL Injection** : Requetes parametrees uniquement

### Audit et logs
- **Winston** : Logs structures avec niveaux
- **Audit Trail** : Tracabilite de toutes les actions
- **Monitoring** : Metriques de performance et sante

## Configuration

### Variables d'environnement
```env
# Base
NODE_ENV=production
PORT=5000

# Base de donnees
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
- **info** : Informations generales
- **debug** : Informations de debogage

## Deploiement

### Prerequis
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker (optionnel)

### Installation locale
```bash
# Cloner le repository
git clone https://github.com/your-org/gestcyber-backend.git
cd gestcyber-backend

# Installer les dependances
npm install

# Configurer l'environnement
cp .env.example .env
# Editer .env avec vos valeurs

# Creer la base de donnees
npm run db:migrate

# Inserer les donnees de test
npm run db:seed

# Demarrer en mode developpement
npm run dev

# Ou en mode production
npm start
```

### Deploiement Docker
```bash
# Construire et demarrer les services
docker-compose up -d

# Verifier l'etat des services
docker-compose ps

# Voir les logs
docker-compose logs -f backend
```

### Deploiement production
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
# Sante de l'API
curl http://localhost:5000/health

# Sante de la base de donnees
curl http://localhost:5000/health/db

# Metriques Prometheus
curl http://localhost:9090/metrics
```

### Logs
```bash
# Logs en temps reel
docker-compose logs -f backend

# Logs specifiques
tail -f logs/gestcyber.log | grep ERROR
```

### Sauvegarde base de donnees
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

# Tests d'integration
npm run test:integration
```

### Structure des tests
```
tests/
ââ🏾â🏾 unit/                    # Tests unitaires
â🏾   â🏾â🏾â🏾 controllers/
â🏾   â🏾â🏾â🏾 services/
â🏾   â🏾â🏾â🏾 utils/
â🏾â🏾â🏾 integration/             # Tests d'integration
â🏾   â🏾â🏾â🏾 api/
â🏾   â🏾â🏾â🏾 database/
â🏾â🏾â🏾 fixtures/                # Donnees de test
```

## Contribution

### Standards de code
- **ESLint** : Configuration Standard
- **Prettier** : Formatage automatique
- **Commits** : Convention Conventional Commits
- **Branches** : GitFlow

### Workflow de developpement
1. Creer une branche feature
2. Developper et tester
3. Soumettre une Pull Request
4. Review de code
5. Tests automatises
6. Merge vers develop

## Support et depannage

### Erreurs communes

**Erreur de connexion DB**
```bash
# Verifier que PostgreSQL fonctionne
docker-compose ps postgres

# Verifier les logs
docker-compose logs postgres
```

**Probleme de permissions**
```bash
# Verifier les permissions utilisateur
ls -la logs/
chmod 755 logs/
```

**Memoire insuffisante**
```bash
# Augmenter la limite Node.js
node --max-old-space-size=4096 src/app.js
```

### Contact support
- **Email** : support@gestcyber.com
- **Issues** : GitHub Issues
- **Documentation** : Wiki interne