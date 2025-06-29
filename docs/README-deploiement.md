# README - Deploiement GestCyber

## ð Vue d'ensemble

GestCyber est une application web de gestion de crise cyber conforme aux recommandations de l'ANSSI. Cette plateforme permet aux organisations de gerer efficacement les incidents cyber selon les 4 phases definies dans le guide officiel ANSSI.

## ðï¸ Architecture de l'application

### Structure des fichiers
```
crise-cyber-manager/
âââ index.html          # Page principale de l'application
âââ style.css           # Feuilles de style CSS
âââ app.js              # Logique JavaScript principale
âââ README-deploiement.md   # Ce fichier
âââ documentation-utilisateur.md
```

### Technologies utilisees
- **Frontend** : HTML5, CSS3, JavaScript ES6+
- **Architecture** : Single Page Application (SPA)
- **Compatibilite** : Navigateurs modernes (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- **Responsive** : Optimise pour desktop, tablette et mobile

## âï¸ Prerequis techniques

### Serveur web
- **Option 1 - Serveur web simple** : Apache, Nginx, IIS
- **Option 2 - Serveur de developpement** : Python, Node.js, PHP
- **Option 3 - Hebergement cloud** : AWS S3, Azure Blob, Google Cloud Storage

### Environnement minimal
- Serveur HTTP/HTTPS fonctionnel
- Support des fichiers statiques (HTML, CSS, JS)
- Aucune base de donnees requise (application client-side)

## ð Options de deploiement

### Option 1 : Deploiement sur serveur web classique

#### 1. Preparation
```bash
# Telecharger les fichiers de l'application
wget https://github.com/votre-org/gestcyber/archive/main.zip
unzip main.zip
cd gestcyber-main/
```

#### 2. Configuration Apache
```apache
<VirtualHost *:80>
    ServerName gestcyber.votre-domaine.fr
    DocumentRoot /var/www/gestcyber
    
    <Directory /var/www/gestcyber>
        AllowOverride All
        Require all granted
    </Directory>
    
    # Headers de securite
    Header always set X-Frame-Options DENY
    Header always set X-Content-Type-Options nosniff
    Header always set X-XSS-Protection "1; mode=block"
</VirtualHost>
```

#### 3. Configuration Nginx
```nginx
server {
    listen 80;
    server_name gestcyber.votre-domaine.fr;
    root /var/www/gestcyber;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Headers de securite
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
}
```

### Option 2 : Deploiement avec HTTPS (Recommande)

#### Certificate SSL
```bash
# Avec Certbot (Let's Encrypt)
sudo certbot --apache -d gestcyber.votre-domaine.fr

# Ou avec certificat existant
sudo cp votre-certificat.crt /etc/ssl/certs/
sudo cp votre-cle-privee.key /etc/ssl/private/
```

#### Configuration HTTPS Nginx
```nginx
server {
    listen 443 ssl;
    server_name gestcyber.votre-domaine.fr;
    
    ssl_certificate /etc/ssl/certs/gestcyber.crt;
    ssl_certificate_key /etc/ssl/private/gestcyber.key;
    
    root /var/www/gestcyber;
    index index.html;
    
    # Configuration SSL securisee
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
}
```

### Option 3 : Deploiement Docker

#### Dockerfile
```dockerfile
FROM nginx:alpine

# Copier les fichiers de l'application
COPY . /usr/share/nginx/html/

# Configuration Nginx personnalisee
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### docker-compose.yml
```yaml
version: '3.8'
services:
  gestcyber:
    build: .
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/ssl/certs
    restart: unless-stopped
```

#### Commandes de deploiement
```bash
# Construction et lancement
docker-compose up -d

# Verification
docker-compose ps
docker-compose logs gestcyber
```

### Option 4 : Deploiement Cloud (AWS S3)

#### Configuration S3
```bash
# Creation du bucket
aws s3 mb s3://gestcyber-prod

# Upload des fichiers
aws s3 sync . s3://gestcyber-prod --delete

# Configuration du site web statique
aws s3 website s3://gestcyber-prod \
    --index-document index.html \
    --error-document index.html
```

#### CloudFront (CDN)
```json
{
  "Origins": [{
    "DomainName": "gestcyber-prod.s3.amazonaws.com",
    "OriginPath": "",
    "CustomOriginConfig": {
      "HTTPPort": 80,
      "HTTPSPort": 443,
      "OriginProtocolPolicy": "https-only"
    }
  }],
  "DefaultCacheBehavior": {
    "ViewerProtocolPolicy": "redirect-to-https"
  }
}
```

## ð Configuration de securite

### Headers de securite obligatoires
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### Authentification (recommandee)
Pour un environnement de production, integrer une couche d'authentification :

#### Option 1 : Authentification basique Apache
```apache
<Directory /var/www/gestcyber>
    AuthType Basic
    AuthName "Acces Gestion Crise Cyber"
    AuthUserFile /etc/apache2/.htpasswd
    Require valid-user
</Directory>
```

#### Option 2 : Reverse proxy avec authentification
```nginx
location / {
    auth_basic "Zone Restreinte";
    auth_basic_user_file /etc/nginx/.htpasswd;
    try_files $uri $uri/ /index.html;
}
```

## ð Monitoring et logs

### Configuration des logs Apache
```apache
LogFormat "%h %l %u %t \"%r\" %>s %O \"%{Referer}i\" \"%{User-Agent}i\"" combined
CustomLog /var/log/apache2/gestcyber-access.log combined
ErrorLog /var/log/apache2/gestcyber-error.log
```

### Configuration des logs Nginx
```nginx
access_log /var/log/nginx/gestcyber-access.log combined;
error_log /var/log/nginx/gestcyber-error.log warn;
```

### Surveillance recommandee
- **Disponibilite** : Monitoring HTTP (status 200)
- **Performance** : Temps de reponse < 2s
- **Securite** : Analyse des logs d'acces
- **Erreurs** : Alertes sur erreurs 4xx/5xx

## ð ï¸ Maintenance et mise a jour

### Sauvegarde
```bash
# Sauvegarde des fichiers
tar -czf gestcyber-backup-$(date +%Y%m%d).tar.gz /var/www/gestcyber/

# Sauvegarde de la configuration
cp /etc/apache2/sites-available/gestcyber.conf backup/
```

### Mise a jour
```bash
# 1. Sauvegarde de l'existant
cp -r /var/www/gestcyber /var/www/gestcyber.backup

# 2. Deploiement de la nouvelle version
wget https://releases.gestcyber.fr/latest.zip
unzip latest.zip -d /var/www/gestcyber/

# 3. Redemarrage des services
sudo systemctl reload apache2
# ou
sudo systemctl reload nginx
```

## ð§ Depannage

### Problemes courants

#### 1. Page blanche
- Verifier les permissions des fichiers
- Controler les logs d'erreur du serveur web
- Verifier la console developpeur du navigateur

#### 2. Erreur 404
- Verifier la configuration du DocumentRoot
- Controler l'existence du fichier index.html

#### 3. Problemes de style/JavaScript
- Verifier les Content-Type des fichiers
- Controler les headers de securite (CSP)
- Verifier les permissions de lecture

### Commandes de diagnostic
```bash
# Test de connectivite
curl -I http://gestcyber.votre-domaine.fr

# Verification des ports
netstat -tlnp | grep :80

# Test SSL
openssl s_client -connect gestcyber.votre-domaine.fr:443

# Analyse des logs en temps reel
tail -f /var/log/apache2/gestcyber-error.log
```

## ð Support et contact

### En cas de probleme technique
1. Consulter les logs du serveur web
2. Verifier la documentation utilisateur
3. Contacter l'administrateur systeme

### Informations systeme
- **Version application** : 1.0.0
- **Date de deploiement** : Voir timestamp des fichiers
- **Derniere mise a jour** : Voir git log ou changelog

## ð Checklist de deploiement

- [ ] Serveur web configure et fonctionnel
- [ ] Certificat SSL installe (production)
- [ ] Headers de securite configures
- [ ] Authentification mise en place (recommande)
- [ ] Monitoring configure
- [ ] Sauvegardes planifiees
- [ ] Tests de fonctionnement realises
- [ ] Documentation remise aux utilisateurs
- [ ] Formation des administrateurs effectuee

---

**Note importante** : Cette application gere des informations sensibles liees a la securite. Assurez-vous de respecter les politiques de securite de votre organisation et les reglementations en vigueur.