# Guide de Demarrage Rapide - GestCyber Backend

## Vue d'ensemble

Ce guide vous permet de deployer rapidement l'infrastructure backend de GestCyber, le systeme de gestion de crise cyber conforme aux recommandations ANSSI.

## Prerequis

### Systeme
- **OS** : Linux (Ubuntu 20.04+), macOS, ou Windows avec WSL2
- **RAM** : Minimum 4 GB, recommande 8 GB
- **Disque** : Minimum 20 GB d'espace libre
- **Reseau** : Acces Internet pour telecharger les dependances

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

# Editer les variables d'environnement
nano .env
```

**Variables critiques a modifier :**
```env
# Mots de passe securises
DB_PASSWORD=your_secure_db_password_123!
REDIS_PASSWORD=your_secure_redis_password_456!
JWT_SECRET=your_very_long_jwt_secret_key_at_least_64_characters_long_789!

# URL de votre frontend
FRONTEND_URL=https://gestcyber.your-domain.com

# Services de notification (optionnel)
TWILIO_ACCOUNT_SID=your_twilio_sid
SENDGRID_API_KEY=your_sendgrid_key
```

### 3. Demarrage
```bash
# Construction et demarrage des services
docker-compose up -d

# Verification du statut
docker-compose ps

# Verification des logs
docker-compose logs -f backend
```

### 4. Initialisation de la base de donnees
```bash
# Execution des migrations
docker-compose exec backend npm run db:migrate

# Insertion des donnees de test
docker-compose exec backend npm run db:seed
```

### 5. Verification
```bash
# Test de sante de l'API
curl http://localhost:5000/health

# Test de connexion base de donnees
curl http://localhost:5000/health/db
```

## Installation Manuelle (Developpement)

### 1. Installation des dependances
```bash
# Installation des paquets Node.js
npm install

# Installation de PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Installation de Redis
sudo apt-get install redis-server
```

### 2. Configuration de la base de donnees
```bash
# Connexion a PostgreSQL
sudo -u postgres psql

# Creation de la base et de l'utilisateur
CREATE DATABASE gestcyber;
CREATE USER gestcyber_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE gestcyber TO gestcyber_user;
\q
```

### 3. Configuration de Redis
```bash
# Demarrage de Redis
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

# Migration de la base de donnees
npm run db:migrate

# Donnees de test
npm run db:seed
```

### 5. Demarrage en developpement
```bash
# Mode developpement avec rechargement automatique
npm run dev

# Ou mode production
npm start
```

## Configuration de Production

### 1. Securite SSL/TLS
```bash
# Generation des certificats SSL (exemple avec Let's Encrypt)
sudo apt-get install certbot
sudo certbot certonly --standalone -d gestcyber.your-domain.com

# Configuration Nginx
sudo cp nginx/gestcyber.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/gestcyber.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 2. Monitoring et alertes
```bash
# Demarrage avec monitoring complet
docker-compose --profile full up -d

# Acces aux interfaces
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

### 4. Mise a l'echelle
```bash
# Demarrage avec plusieurs instances backend
docker-compose up -d --scale backend=3
```

## Tests et Validation

### 1. Tests automatises
```bash
# Tests unitaires
npm test

# Tests d'integration
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

### 3. Tests de securite
```bash
# Audit des vulnerabilites
npm audit

# Scan de securite Docker
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  -v $PWD:/root/.cache/ aquasec/trivy image gestcyber-backend
```

## Operations Courantes

### Gestion des logs
```bash
# Voir les logs en temps reel
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

### Mise a jour
```bash
# Arret des services
docker-compose down

# Mise a jour du code
git pull origin main

# Reconstruction et redemarrage
docker-compose build --no-cache
docker-compose up -d

# Migration si necessaire
docker-compose exec backend npm run db:migrate
```

## Depannage

### Problemes courants

**Erreur de connexion base de donnees**
```bash
# Verifier que PostgreSQL fonctionne
docker-compose logs postgres

# Tester la connexion
docker-compose exec postgres psql -U gestcyber_user -d gestcyber -c "SELECT version();"
```

**Probleme de memoire**
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

### Verifications de sante
```bash
# API principale
curl -f http://localhost:5000/health || echo "Backend KO"

# Base de donnees
curl -f http://localhost:5000/health/db || echo "Database KO"

# Redis
redis-cli -a your_redis_password ping || echo "Redis KO"

# Metriques
curl -f http://localhost:9090/metrics || echo "Metrics KO"
```

## Configuration des Services Externes

### Twilio (SMS)
1. Creer un compte sur [twilio.com](https://twilio.com)
2. Obtenir : Account SID, Auth Token, numero de telephone
3. Configurer dans `.env`

### SendGrid (Email)
1. Creer un compte sur [sendgrid.com](https://sendgrid.com)
2. Generer une cle API
3. Configurer dans `.env`

### Slack
1. Creer une app Slack
2. Obtenir le Bot Token
3. Creer un Webhook URL
4. Configurer dans `.env`

## Prochaines Etapes

### 1. Configuration avancee
- [ ] Configurer le monitoring complet
- [ ] Mettre en place les alertes automatiques
- [ ] Configurer les sauvegardes distantes
- [ ] Implementer l'authentification SSO

### 2. Integrations
- [ ] SIEM (Splunk, QRadar, etc.)
- [ ] MISP pour la threat intelligence
- [ ] Active Directory pour l'authentification
- [ ] ServiceNow pour la gestion des incidents

### 3. Personnalisation
- [ ] Adapter les workflows aux processus internes
- [ ] Customiser les templates de communication
- [ ] Ajouter des metriques specifiques
- [ ] Developper des rapports personnalises

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

**Felicitations !** Votre infrastructure GestCyber Backend est maintenant operationnelle.

Pour toute question ou assistance, n'hesitez pas a contacter notre equipe support.