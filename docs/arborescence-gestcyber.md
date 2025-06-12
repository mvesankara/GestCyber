# Arborescence des Fichiers - GestCyber

Voici l'organisation complÃ¨te des fichiers pour le projet de gestion de crise cyber GestCyber, Ã  tÃ©lÃ©charger et organiser sur votre PC en local.

## ð Structure Racine du Projet

```
gestcyber/
âââ ð frontend/                    # Application web frontend
âââ ð backend/                     # API et serveur backend  
âââ ð database/                    # Scripts et schÃ©mas de base de donnÃ©es
âââ ð docker/                      # Configuration conteneurisation
âââ ð docs/                        # Documentation complÃ¨te
âââ ð scripts/                     # Scripts d'automatisation
âââ ð config/                      # Fichiers de configuration
âââ ð logs/                        # RÃ©pertoire des logs (Ã  crÃ©er)
âââ ð uploads/                     # RÃ©pertoire des uploads (Ã  crÃ©er)
âââ ð backups/                     # RÃ©pertoire des sauvegardes (Ã  crÃ©er)
âââ README.md                       # Documentation principale
âââ .gitignore                      # Fichiers Ã  ignorer Git
âââ docker-compose.yml              # Orchestration des services
```

## ð Frontend - Application Web

```
frontend/
âââ index.html                      # Page principale de l'application
âââ style.css                       # Feuilles de style CSS
âââ app.js                          # Logique JavaScript
âââ ð assets/                      # Ressources statiques
â   âââ ð images/                  # Images et icÃ´nes
â   âââ ð fonts/                   # Polices personnalisÃ©es
â   âââ ð icons/                   # IcÃ´nes SVG
âââ ð components/                  # Composants rÃ©utilisables (optionnel)
âââ README-deploiement.md           # Guide de dÃ©ploiement frontend
```

## ð Backend - Serveur API

```
backend/
âââ src/                            # Code source principal
â   âââ app.js                      # Point d'entrÃ©e de l'application
â   âââ ð controllers/             # Logique mÃ©tier des endpoints
â   â   âââ authController.js       # Authentification
â   â   âââ incidentController.js   # Gestion des incidents
â   â   âââ actionController.js     # Gestion des actions
â   â   âââ investigationController.js # Investigation numÃ©rique
â   â   âââ communicationController.js # Communications
â   â   âââ systemController.js     # Gestion des systÃ¨mes
â   â   âââ metricsController.js    # MÃ©triques et KPIs
â   â   âââ retexController.js      # Retours d'expÃ©rience
â   âââ ð routes/                  # DÃ©finition des routes API
â   â   âââ index.js                # Routes principales
â   â   âââ ð api/                 # Routes API spÃ©cialisÃ©es
â   â       âââ auth.js             # Routes authentification
â   â       âââ incidents.js        # Routes incidents
â   â       âââ actions.js          # Routes actions
â   â       âââ investigations.js   # Routes investigation
â   â       âââ communications.js   # Routes communication
â   â       âââ systems.js          # Routes systÃ¨mes
â   â       âââ metrics.js          # Routes mÃ©triques
â   â       âââ retex.js            # Routes RETEX
â   âââ ð middleware/              # Middleware Express
â   â   âââ auth.js                 # Authentification JWT
â   â   âââ validation.js           # Validation des donnÃ©es
â   â   âââ logging.js              # Logs des requÃªtes
â   â   âââ errorHandler.js         # Gestion d'erreurs
â   âââ ð services/                # Services mÃ©tier
â   â   âââ authService.js          # Service authentification
â   â   âââ alertService.js         # Service d'alertes
â   â   âââ notificationService.js  # Service notifications
â   â   âââ reportService.js        # Service de rapports
â   â   âââ metricsService.js       # Service mÃ©triques
â   âââ ð utils/                   # Utilitaires
â   â   âââ database.js             # Connexion base de donnÃ©es
â   â   âââ logger.js               # Configuration logs
â   â   âââ constants.js            # Constantes application
â   â   âââ validators.js           # Validateurs
â   âââ ð config/                  # Configuration
â       âââ database.js             # Config base de donnÃ©es
â       âââ auth.js                 # Config authentification
â       âââ app.js                  # Config application
âââ tests/                          # Tests automatisÃ©s
â   âââ ð unit/                    # Tests unitaires
â   âââ ð integration/             # Tests d'intÃ©gration
â   âââ ð fixtures/                # DonnÃ©es de test
âââ package.json                    # DÃ©pendances Node.js
âââ .env.example                    # Variables d'environnement exemple
âââ Dockerfile                      # Image Docker backend
âââ README.md                       # Documentation backend
```

## ð Base de DonnÃ©es

```
database/
âââ schema.sql                      # SchÃ©ma complet de la base
âââ ð migrations/                  # Scripts de migration
â   âââ 001_initial_schema.sql      # Schema initial
â   âââ 002_add_users.sql           # Ajout utilisateurs
â   âââ 003_add_indexes.sql         # Ajout d'index
âââ ð seeds/                       # DonnÃ©es d'initialisation
â   âââ users.sql                   # Utilisateurs par dÃ©faut
â   âââ phases.sql                  # Phases ANSSI
â   âââ demo_data.sql               # DonnÃ©es de dÃ©monstration
âââ README.md                       # Documentation base de donnÃ©es
```

## ð Docker et DÃ©ploiement

```
docker/
âââ docker-compose.yml              # Configuration Docker Compose
âââ docker-compose.override.yml     # Surcharge dÃ©veloppement
âââ docker-compose.prod.yml         # Configuration production
âââ ð nginx/                       # Configuration Nginx
â   âââ nginx.conf                  # Configuration principale
â   âââ ð conf.d/                  # Configurations virtuelles
â   âââ ð ssl/                     # Certificats SSL
âââ ð postgres/                    # Configuration PostgreSQL
âââ ð redis/                       # Configuration Redis
âââ Dockerfile.frontend             # Image Docker frontend
```

## ð Documentation

```
docs/
âââ README-deploiement.md           # Guide de dÃ©ploiement gÃ©nÃ©ral
âââ documentation-utilisateur.md    # Guide utilisateur complet
âââ quick-start-guide.md            # Guide de dÃ©marrage rapide
âââ gestcyber-backend-docs.md       # Documentation technique backend
âââ ð api/                         # Documentation API
â   âââ endpoints.md                # Liste des endpoints
â   âââ authentication.md          # Guide d'authentification
â   âââ examples.md                 # Exemples d'utilisation
âââ ð guides/                      # Guides spÃ©cialisÃ©s
â   âââ installation.md             # Installation complÃ¨te
â   âââ configuration.md            # Configuration avancÃ©e
â   âââ security.md                 # Guide de sÃ©curitÃ©
â   âââ troubleshooting.md          # DÃ©pannage
âââ ð architecture/                # Documentation architecture
â   âââ overview.md                 # Vue d'ensemble
â   âââ database-design.md          # Conception base de donnÃ©es
â   âââ api-design.md               # Conception API
âââ CHANGELOG.md                    # Journal des modifications
```

## ð Scripts d'Automatisation

```
scripts/
âââ ð database/                    # Scripts base de donnÃ©es
â   âââ migrate.js                  # Script de migration
â   âââ seed.js                     # Script d'initialisation
â   âââ backup.js                   # Script de sauvegarde
â   âââ backup.sh                   # Script de sauvegarde bash
âââ ð deployment/                  # Scripts de dÃ©ploiement
â   âââ deploy.sh                   # DÃ©ploiement automatique
â   âââ start.sh                    # DÃ©marrage des services
â   âââ stop.sh                     # ArrÃªt des services
âââ ð monitoring/                  # Scripts de monitoring
â   âââ health-check.sh             # VÃ©rification de santÃ©
â   âââ log-rotate.sh               # Rotation des logs
âââ init.sql                        # Script d'initialisation PostgreSQL
```

## ð Configuration

```
config/
âââ ð environment/                 # Configurations par environnement
â   âââ development.env             # Environnement dÃ©veloppement
â   âââ staging.env                 # Environnement de test
â   âââ production.env              # Environnement production
âââ ð nginx/                       # Configurations Nginx
â   âââ gestcyber.conf              # Configuration site
â   âââ ssl.conf                    # Configuration SSL
âââ ð monitoring/                  # Configuration monitoring
â   âââ prometheus.yml              # Configuration Prometheus
â   âââ ð grafana/                 # Configuration Grafana
â       âââ ð dashboards/          # Tableaux de bord
â       âââ ð datasources/         # Sources de donnÃ©es
âââ redis.conf                      # Configuration Redis
âââ logrotate.conf                  # Configuration rotation logs
```

## ð Fichiers Racine

```
gestcyber/
âââ README.md                       # Documentation principale du projet
âââ .gitignore                      # Fichiers Ã  ignorer par Git
âââ .env.example                    # Variables d'environnement exemple
âââ docker-compose.yml              # Configuration Docker principale
âââ LICENSE                         # Licence du projet
âââ CONTRIBUTING.md                 # Guide de contribution
âââ SECURITY.md                     # Politique de sÃ©curitÃ©
```

## ð Instructions de TÃ©lÃ©chargement

### 1. CrÃ©er la structure de dossiers

```bash
# CrÃ©er le dossier principal
mkdir gestcyber
cd gestcyber

# CrÃ©er la structure de dossiers
mkdir -p frontend backend database docker docs scripts config
mkdir -p logs uploads backups
mkdir -p backend/src/{controllers,routes/api,middleware,services,utils,config}
mkdir -p backend/tests/{unit,integration,fixtures}
mkdir -p database/{migrations,seeds}
mkdir -p docker/{nginx/conf.d,postgres,redis}
mkdir -p docs/{api,guides,architecture}
mkdir -p scripts/{database,deployment,monitoring}
mkdir -p config/{environment,nginx,monitoring/grafana/{dashboards,datasources}}
```

### 2. TÃ©lÃ©charger les fichiers principaux

RÃ©cupÃ©rer les fichiers gÃ©nÃ©rÃ©s lors de nos conversations prÃ©cÃ©dentes :

- **Frontend** : `index.html`, `style.css`, `app.js`
- **Backend** : `package.json`, `.env.example`, tous les contrÃ´leurs et services
- **Base de donnÃ©es** : `schema.sql` et scripts de migration
- **Docker** : `docker-compose.yml` et configurations
- **Documentation** : tous les guides et documentations

### 3. Configurer les permissions

```bash
# Permissions pour les dossiers de logs et uploads
chmod 755 logs uploads backups
chmod +x scripts/**/*.sh
```

## ð Checklist de VÃ©rification

- [ ] Structure de dossiers crÃ©Ã©e
- [ ] Fichiers frontend tÃ©lÃ©chargÃ©s
- [ ] Fichiers backend tÃ©lÃ©chargÃ©s  
- [ ] Scripts de base de donnÃ©es prÃ©sents
- [ ] Configuration Docker prÃªte
- [ ] Documentation complÃ¨te
- [ ] Variables d'environnement configurÃ©es
- [ ] Permissions correctes dÃ©finies

## ð§ Prochaines Ãtapes

1. **Configuration** : Adapter les fichiers `.env` Ã  votre environnement
2. **Installation** : Suivre le guide de dÃ©marrage rapide
3. **Tests** : Valider le fonctionnement avec Docker Compose
4. **DÃ©ploiement** : Utiliser les guides de dÃ©ploiement selon votre infrastructure

Cette structure respecte les bonnes pratiques de dÃ©veloppement et facilite la maintenance, les mises Ã  jour et le dÃ©ploiement de l'application GestCyber.