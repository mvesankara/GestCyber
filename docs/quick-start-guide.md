# Guide de DÃ©marrage Rapide - GestCyber Backend

## Vue d'ensemble

Ce guide vous permet de dÃ©ployer rapidement l'infrastructure backend de GestCyber, le systÃ¨me de gestion de crise cyber conforme aux recommandations ANSSI.

## PrÃ©requis

### SystÃ¨me
- **OS** : Linux (Ubuntu 20.04+), macOS, ou Windows avec WSL2
- **RAM** : Minimum 4 GB, recommandÃ© 8 GB
- **Disque** : Minimum 20 GB d'espace libre
- **RÃ©seau** : AccÃ¨s Internet pour tÃ©lÃ©charger les dÃ©pendances

### Logiciels requis
```bash
# Node.js 18+ et npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Docker et Docker Compose
sudo apt-get update
sudo apt-get install docker.io docker-compose
sudo usermod -aG docker $USER

# PostgreSQL client (pour la gestion manuelle)
sudo apt-get install postgresql-client
```

## Installation Express (Docker)

### 1. Cloner le projet
```bash
git clone https://github.com/your-org/gestcyber-backend.git
cd gestcyber-backend
```

### 2. Configuration
```bash
# Copier le fichier d'environnement
cp .env.example .env

# Ãditer les variables d'environnement
nano .env
```

**Variables critiques Ã  modifier :**
```env
# Mots de passe sÃ©curisÃ©s
DB_PASSWORD=your_secure_db_password_123!
REDIS_PASSWORD=your_secure_redis_password_456!
JWT_SECRET=your_very_long_jwt_secret_key_at_least_64_characters_long_789!

# URL de votre frontend
FRONTEND_URL=https://gestcyber.your-domain.com

# Services de notification (optionnel)
TWILIO_ACCOUNT_SID=your_twilio_sid
SENDGRID_API_KEY=your_sendgrid_key
```

### 3. DÃ©marrage
```bash
# Construction et dÃ©marrage des services
docker-compose up -d

# VÃ©rification du statut
docker-compose ps

# VÃ©rification des logs
docker-compose logs -f backend
```

### 4. Initialisation de la base de donnÃ©es
```bash
# ExÃ©cution des migrations
docker-compose exec backend npm run db:migrate

# Insertion des donnÃ©es de test
docker-compose exec backend npm run db:seed
```

### 5. VÃ©rification
```bash
# Test de santÃ© de l'API
curl http://localhost:5000/health

# Test de connexion base de donnÃ©es
curl http://localhost:5000/health/db
```

## Installation Manuelle (DÃ©veloppement)

### 1. Installation des dÃ©pendances
```bash
# Installation des paquets Node.js
npm install

# Installation de PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Installation de Redis
sudo apt-get install redis-server
```

### 2. Configuration de la base de donnÃ©es
```bash
# Connexion Ã  PostgreSQL
sudo -u postgres psql

# CrÃ©ation de la base et de l'utilisateur
CREATE DATABASE gestcyber;
CREATE USER gestcyber_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE gestcyber TO gestcyber_user;
\q
```

### 3. Configuration de Redis
```bash
# DÃ©marrage de Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Configuration d'un mot de passe
echo "requirepass your_redis_password" | sudo tee -a /etc/redis/redis.conf
sudo systemctl restart redis-server
```

### 4. Configuration de l'application
```bash
# Variables d'environnement
cp .env.example .env
nano .env

# Migration de la base de donnÃ©es
npm run db:migrate

# DonnÃ©es de test
npm run db:seed
```

### 5. DÃ©marrage en dÃ©veloppement
```bash
# Mode dÃ©veloppement avec rechargement automatique
npm run dev

# Ou mode production
npm start
```

## Configuration de Production

### 1. SÃ©curitÃ© SSL/TLS
```bash
# GÃ©nÃ©ration des certificats SSL (exemple avec Let's Encrypt)
sudo apt-get install certbot
sudo certbot certonly --standalone -d gestcyber.your-domain.com

# Configuration Nginx
sudo cp nginx/gestcyber.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/gestcyber.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 2. Monitoring et alertes
```bash
# DÃ©marrage avec monitoring complet
docker-compose --profile full up -d

# AccÃ¨s aux interfaces
# Grafana: http://localhost:3001 (admin/admin123)
# Prometheus: http://localhost:9091
# Kibana: http://localhost:5601
```

### 3. Sauvegardes automatiques
```bash
# Activation du service de sauvegarde
docker-compose --profile backup up -d

# Test de sauvegarde manuelle
docker-compose exec backup /backup.sh
```

### 4. Mise Ã  l'Ã©chelle
```bash
# DÃ©marrage avec plusieurs instances backend
docker-compose up -d --scale backend=3
```

## Tests et Validation

### 1. Tests automatisÃ©s
```bash
# Tests unitaires
npm test

# Tests d'intÃ©gration
npm run test:integration

# Couverture de code
npm run test:coverage
```

### 2. Tests de charge
```bash
# Installation d'Artillery
npm install -g artillery

# Test de charge basique
artillery quick --count 100 --num 10 http://localhost:5000/health
```

### 3. Tests de sÃ©curitÃ©
```bash
# Audit des vulnÃ©rabilitÃ©s
npm audit

# Scan de sÃ©curitÃ© Docker
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  -v $PWD:/root/.cache/ aquasec/trivy image gestcyber-backend
```

## OpÃ©rations Courantes

### Gestion des logs
```bash
# Voir les logs en temps rÃ©el
docker-compose logs -f backend

# Logs par service
docker-compose logs postgres
docker-compose logs redis

# Rotation des logs
sudo logrotate -f /etc/logrotate.d/gestcyber
```

### Sauvegardes et restauration
```bash
# Sauvegarde manuelle
docker-compose exec postgres pg_dump -U gestcyber_user gestcyber > backup_$(date +%Y%m%d).sql

# Restauration
docker-compose exec -T postgres psql -U gestcyber_user gestcyber < backup_20240613.sql
```

### Mise Ã  jour
```bash
# ArrÃªt des services
docker-compose down

# Mise Ã  jour du code
git pull origin main

# Reconstruction et redÃ©marrage
docker-compose build --no-cache
docker-compose up -d

# Migration si nÃ©cessaire
docker-compose exec backend npm run db:migrate
```

## DÃ©pannage

### ProblÃ¨mes courants

**Erreur de connexion base de donnÃ©es**
```bash
# VÃ©rifier que PostgreSQL fonctionne
docker-compose logs postgres

# Tester la connexion
docker-compose exec postgres psql -U gestcyber_user -d gestcyber -c "SELECT version();"
```

**ProblÃ¨me de mÃ©moire**
```bash
# Augmenter la limite Node.js
export NODE_OPTIONS="--max-old-space-size=4096"

# Ou modifier docker-compose.yml
environment:
  - NODE_OPTIONS=--max-old-space-size=4096
```

**Erreur de permissions**
```bash
# Corriger les permissions des logs
sudo chown -R $USER:$USER logs/
chmod 755 logs/

# Permissions Docker
sudo usermod -aG docker $USER
newgrp docker
```

### VÃ©rifications de santÃ©
```bash
# API principale
curl -f http://localhost:5000/health || echo "Backend KO"

# Base de donnÃ©es
curl -f http://localhost:5000/health/db || echo "Database KO"

# Redis
redis-cli -a your_redis_password ping || echo "Redis KO"

# MÃ©triques
curl -f http://localhost:9090/metrics || echo "Metrics KO"
```

## Configuration des Services Externes

### Twilio (SMS)
1. CrÃ©er un compte sur [twilio.com](https://twilio.com)
2. Obtenir : Account SID, Auth Token, numÃ©ro de tÃ©lÃ©phone
3. Configurer dans `.env`

### SendGrid (Email)
1. CrÃ©er un compte sur [sendgrid.com](https://sendgrid.com)
2. GÃ©nÃ©rer une clÃ© API
3. Configurer dans `.env`

### Slack
1. CrÃ©er une app Slack
2. Obtenir le Bot Token
3. CrÃ©er un Webhook URL
4. Configurer dans `.env`

## Prochaines Ãtapes

### 1. Configuration avancÃ©e
- [ ] Configurer le monitoring complet
- [ ] Mettre en place les alertes automatiques
- [ ] Configurer les sauvegardes distantes
- [ ] ImplÃ©menter l'authentification SSO

### 2. IntÃ©grations
- [ ] SIEM (Splunk, QRadar, etc.)
- [ ] MISP pour la threat intelligence
- [ ] Active Directory pour l'authentification
- [ ] ServiceNow pour la gestion des incidents

### 3. Personnalisation
- [ ] Adapter les workflows aux processus internes
- [ ] Customiser les templates de communication
- [ ] Ajouter des mÃ©triques spÃ©cifiques
- [ ] DÃ©velopper des rapports personnalisÃ©s

## Support et Ressources

### Documentation
- **Guide utilisateur** : `/docs/user-guide.md`
- **API Reference** : `/docs/api-reference.md`
- **Architecture** : `/docs/architecture.md`

### Support technique
- **Email** : support@gestcyber.com
- **Issues GitHub** : [GitHub Issues](https://github.com/your-org/gestcyber-backend/issues)
- **Wiki** : [Documentation Wiki](https://wiki.gestcyber.com)

### Formation
- **Formation ANSSI** : Modules de formation aux 4 phases
- **Webinaires** : Sessions de formation en ligne
- **Documentation ANSSI** : Guides officiels de gestion de crise cyber

---

**FÃ©licitations !** Votre infrastructure GestCyber Backend est maintenant opÃ©rationnelle. 

Pour toute question ou assistance, n'hÃ©sitez pas Ã  contacter notre Ã©quipe support.