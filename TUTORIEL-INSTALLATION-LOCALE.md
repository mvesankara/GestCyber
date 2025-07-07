# Tutoriel d'Installation Locale Complète de GestCyber

## 1. Introduction

Ce tutoriel vous guidera à travers les étapes nécessaires pour installer et exécuter l'ensemble de la plateforme GestCyber (backend, base de données, et frontend) sur votre machine locale. Cette configuration est idéale pour le développement, les tests, ou une démonstration de l'application.

Nous utiliserons Docker et Docker Compose pour orchestrer les différents services (PostgreSQL, Redis, Backend Node.js, Nginx), ce qui simplifie grandement la gestion des dépendances et la configuration de l'environnement.

## 2. Prérequis

Avant de commencer, assurez-vous que les éléments suivants sont installés et configurés sur votre système :

*   **Système d'exploitation compatible** :
    *   Linux (Ubuntu 20.04+ recommandé)
    *   macOS
    *   Windows 10/11 avec WSL2 (Windows Subsystem for Linux) activé et une distribution Linux installée.
*   **Matériel (recommandations minimales)** :
    *   RAM : 8 Go (4 Go peuvent fonctionner mais pourraient être lents avec plusieurs conteneurs Docker).
    *   Disque : Au moins 20 Go d'espace libre pour le code source, les images Docker et les volumes de données.
*   **Logiciels** :
    *   **Git** : Pour cloner le code source. ([Instructions d'installation](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git))
    *   **Node.js** : Version 18 ou supérieure. `npm` (Node Package Manager) est inclus avec Node.js. ([Instructions d'installation](https://nodejs.org/))
        ```bash
        # Exemple d'installation de Node.js 18 sur les systèmes basés sur Debian/Ubuntu
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
        ```
    *   **Docker Desktop** ou **Docker Engine** : La dernière version stable. ([Instructions d'installation](https://docs.docker.com/engine/install/))
    *   **Docker Compose** : Généralement inclus avec Docker Desktop. Si vous avez installé Docker Engine séparément, vous pourriez avoir besoin d'installer Docker Compose également. ([Instructions d'installation](https://docs.docker.com/compose/install/))
        ```bash
        # Assurez-vous que Docker et Docker Compose sont exécutables par votre utilisateur non-root
        # (souvent en ajoutant votre utilisateur au groupe 'docker')
        # sudo usermod -aG docker $USER
        # newgrp docker # Appliquer les changements de groupe, ou redémarrer la session/le système
        ```
    *   **Client PostgreSQL** (Optionnel, mais recommandé pour la vérification) :
        *   Ligne de commande `psql`.
            ```bash
            # Exemple sur Debian/Ubuntu
            sudo apt-get install postgresql-client
            ```
        *   Ou un outil GUI comme [pgAdmin](https://www.pgadmin.org/) ou [DBeaver](https://dbeaver.io/).

## 3. Préparation de l'Environnement

### 3.1 Cloner le Dépôt
Ouvrez un terminal ou une invite de commande, naviguez vers le répertoire où vous souhaitez stocker le projet, et clonez le dépôt Git de GestCyber :

```bash
git clone https://github.com/mvesankara/GestCyber.git
```
*(Remplacez `https://github.com/mvesankara/GestCyber.git` par l'URL correcte de votre dépôt si elle est différente).*

### 3.2 Naviguer vers le Répertoire du Projet
```bash
cd GestCyber
```

## 4. Configuration du Backend et des Services

Le backend et les autres services (base de données, Redis) sont configurés à l'aide de variables d'environnement.

### 4.1 Créer le Fichier d'Environnement
Copiez le fichier d'exemple `.env.example` (situé à la racine du projet backend, qui est la racine du dépôt dans ce cas) pour créer votre fichier de configuration local `.env` :

```bash
cp .env.example .env
```
*(Si `.env.example` est dans un sous-dossier `backend/`, adaptez la commande en conséquence, mais d'après la structure du `docker-compose.yml` il semble être à la racine où se trouve le Dockerfile du backend).*

### 4.2 Configurer les Variables Essentielles dans `.env`
Ouvrez le fichier `.env` avec un éditeur de texte et configurez au moins les variables suivantes. **Ne committez jamais votre fichier `.env` contenant des secrets dans un dépôt Git.**

```ini
# .env

# Base de données
DB_PASSWORD=votre_mot_de_passe_postgres_super_secret  # Remplacez par un mot de passe robuste

# Redis
REDIS_PASSWORD=votre_mot_de_passe_redis_super_secret # Remplacez par un mot de passe robuste

# Authentification JWT
JWT_SECRET=votre_longue_chaine_secrete_aleatoire_pour_jwt_ici_au_moins_32_ caracteres # Remplacez par une chaîne longue et aléatoire
JWT_EXPIRES_IN=24h # Durée de validité du token JWT

# URL du Frontend (important pour CORS et autres fonctionnalités)
FRONTEND_URL=http://localhost
# Si Nginx tourne sur un autre port localement, ajustez (ex: http://localhost:8080)

# --- Variables Optionnelles (pour des fonctionnalités spécifiques) ---
# TWILIO_ACCOUNT_SID=
# TWILIO_AUTH_TOKEN=
# TWILIO_PHONE_NUMBER=

# SENDGRID_API_KEY=
# FROM_EMAIL=noreply@gestcyber.local

# SLACK_BOT_TOKEN=
# SLACK_WEBHOOK_URL=

# --- Autres configurations (valeurs par défaut généralement OK pour le local) ---
# NODE_ENV=development # Peut être utile pour le développement
# PORT=5000
# BCRYPT_ROUNDS=12
# RATE_LIMIT_WINDOW_MS=900000
# RATE_LIMIT_MAX_REQUESTS=100
# LOG_LEVEL=debug # 'debug' pour plus de verbosité en développement
# ... autres variables ...
```

**Conseils pour les secrets :**
*   Utilisez un gestionnaire de mots de passe pour générer et stocker des mots de passe robustes et des secrets JWT.
*   Pour `JWT_SECRET`, une commande comme `openssl rand -hex 32` peut générer une bonne chaîne aléatoire.

## 5. Démarrage des Services avec Docker Compose

Docker Compose va lire le fichier `docker-compose.yml` pour construire les images nécessaires (si elles n'existent pas localement ou si le Dockerfile a changé) et démarrer tous les services définis (Postgres, Redis, Backend, Nginx, etc.).

### 5.1 Lancer les Services
Depuis la racine de votre projet (où se trouve le fichier `docker-compose.yml`), exécutez :

```bash
docker-compose up -d
```
*   `up` : Crée et démarre les conteneurs.
*   `-d` (detached) : Lance les conteneurs en arrière-plan et affiche les logs. Si vous voulez voir les logs en direct dans le terminal, omettez `-d` (vous pouvez arrêter avec `Ctrl+C`).

La première fois, Docker téléchargera les images de base (Postgres, Redis, Nginx, etc.) et construira l'image de votre application backend. Cela peut prendre quelques minutes en fonction de votre connexion internet et des performances de votre machine.

### 5.2 Vérifier le Statut des Conteneurs
Une fois la commande terminée, vérifiez que tous les conteneurs sont en cours d'exécution et sains :

```bash
docker-compose ps
```
Vous devriez voir des services comme `gestcyber-postgres`, `gestcyber-redis`, `gestcyber-backend`, `gestcyber-nginx` avec un état "Up" ou "running". Certains services ont des `healthcheck` configurés ; attendez qu'ils passent à un état "healthy".

## 6. Initialisation de la Base de Données

Après le démarrage des services, et une fois que le conteneur PostgreSQL (`gestcyber-postgres`) est pleinement opérationnel et sain, vous devez initialiser la structure de la base de données (schéma) et y insérer les données initiales (seeds).

### 6.1 Exécuter les Migrations
Les migrations créent les tables et les relations dans la base de données `gestcyber` :

```bash
docker-compose exec backend npm run db:migrate
```
*   `docker-compose exec backend` : Exécute une commande à l'intérieur du conteneur nommé `backend`.
*   `npm run db:migrate` : Est un script défini dans le `package.json` du backend pour appliquer les migrations.

Vérifiez la sortie de cette commande pour toute erreur.

### 6.2 Exécuter les Seeds (Données Initiales)
Les seeds remplissent la base de données avec des données initiales nécessaires au fonctionnement de l'application (ex: utilisateurs par défaut, types de phases ANSSI, etc.) :

```bash
docker-compose exec backend npm run db:seed
```
Vérifiez également la sortie de cette commande.

### 6.3 (Optionnel) Vérifier la Base de Données
Si vous avez un client PostgreSQL, vous pouvez vous connecter à la base de données pour vérifier que les tables ont été créées.
*   Hôte : `localhost`
*   Port : `5432` (port exposé par Docker)
*   Base de données : `gestcyber`
*   Utilisateur : `gestcyber_user`
*   Mot de passe : Celui que vous avez défini dans votre fichier `.env` pour `DB_PASSWORD`.

## 7. Configuration et Accès au Frontend

Le `docker-compose.yml` inclut un service Nginx (`gestcyber-nginx`) qui agit comme un reverse proxy pour le backend et peut également servir les fichiers statiques du frontend.

### 7.1 Servir le Frontend
Le dépôt contient un répertoire `frontend/` avec `index.html`, `style.css`, et `app.js`.
La configuration Nginx (`nginx/nginx.conf` et `nginx/conf.d/default.conf`) devrait être mise en place pour servir le contenu de ce répertoire `frontend/` lorsque vous accédez à la racine du site.

**Note** : Si votre application frontend nécessite une étape de build (par exemple, si elle est développée avec un framework comme React, Vue, Angular), vous devriez :
1.  Naviguer dans le dossier `frontend/`.
2.  Exécuter `npm install` (si un `package.json` existe et liste des dépendances).
3.  Exécuter `npm run build` (ou la commande de build appropriée).
4.  Assurez-vous que la configuration Nginx dans `docker-compose.yml` et les fichiers de configuration Nginx pointent vers le répertoire de sortie de ce build (ex: `frontend/dist` ou `frontend/build`) pour servir les fichiers statiques.
    *Le `docker-compose.yml` actuel ne semble pas monter le dossier `frontend/` directement dans Nginx, donc la configuration de Nginx (`nginx/conf.d/default.conf`) doit être vérifiée pour s'assurer qu'elle sert correctement les fichiers du frontend, potentiellement en montant le dossier `frontend` comme volume pour Nginx si ce n'est pas déjà le cas ou en s'assurant que le build du frontend est copié où Nginx s'attend à le trouver.*

Pour une utilisation de base où `frontend/index.html` est le point d'entrée :

### 7.2 Accéder à l'Application
Ouvrez votre navigateur web et allez à :

[http://localhost](http://localhost)

Si Nginx est configuré pour écouter sur un autre port (ex: 8080), utilisez cette URL : `http://localhost:8080`. Le port 80 est le port HTTP par défaut, donc `http://localhost` devrait fonctionner.

## 8. Vérifications Finales

*   **API Backend** : Testez un endpoint de santé du backend (si disponible) :
    ```bash
    curl http://localhost:5000/health
    ```
    (Le port 5000 est celui du backend, mais Nginx devrait normalement router les requêtes depuis le port 80/443 vers le backend).
*   **Application Frontend** :
    *   La page d'accueil se charge-t-elle ?
    *   Pouvez-vous essayer de vous connecter (si des identifiants par défaut sont fournis par les seeds) ?
    *   Naviguez à travers les différentes sections pour vérifier les fonctionnalités de base.

## 9. Gestion des Services Docker

*   **Voir les logs d'un service spécifique** (utile pour le débogage) :
    ```bash
    docker-compose logs -f backend
    docker-compose logs -f postgres
    # etc.
    ```
    Le `-f` permet de suivre les logs en temps réel. Appuyez sur `Ctrl+C` pour arrêter le suivi.

*   **Arrêter tous les services** :
    ```bash
    docker-compose down
    ```
    Cela arrêtera et supprimera les conteneurs. Les volumes de données (`postgres_data`, `redis_data`) persisteront, donc vos données de base de données ne seront pas perdues. Si vous voulez supprimer aussi les volumes (attention, perte de données), utilisez `docker-compose down -v`.

*   **Redémarrer les services** :
    ```bash
    docker-compose up -d
    ```

## 10. Dépannage (Problèmes Courants)

*   **Ports déjà utilisés** : Si vous avez un autre service qui utilise les ports 80, 443, 5000, 5432, 6379, etc., Docker ne pourra pas démarrer le conteneur concerné. Arrêtez le service conflictuel ou modifiez les ports dans `docker-compose.yml` (ex: `ports: - "8081:80"` pour exposer Nginx sur le port 8081 de votre machine hôte).
*   **Erreurs lors du `docker-compose up`** :
    *   Vérifiez les messages d'erreur. Ils peuvent indiquer un problème dans le `Dockerfile` du backend, une variable d'environnement manquante dans `.env` (que `docker-compose.yml` essaie d'utiliser), ou des problèmes de réseau pour télécharger les images.
    *   Assurez-vous que Docker a suffisamment de ressources (CPU, RAM, espace disque).
*   **Le backend ne démarre pas (boucle de redémarrage)** :
    *   Vérifiez les logs du backend : `docker-compose logs backend`.
    *   Cela peut être dû à une mauvaise configuration dans `.env`, une incapacité à se connecter à la base de données ou à Redis.
*   **Problèmes de connexion à la base de données depuis le backend** :
    *   Assurez-vous que `DB_HOST` dans `.env` (utilisé par le backend) est bien le nom du service Docker de la base de données (ici, `postgres`).
    *   Vérifiez que `DB_PASSWORD` dans `.env` correspond à `POSTGRES_PASSWORD` utilisé par le service `postgres` dans `docker-compose.yml`.
    *   Vérifiez les logs du conteneur `postgres` pour des erreurs d'initialisation.
*   **Frontend non accessible ou ne fonctionnant pas** :
    *   Vérifiez la configuration de Nginx.
    *   Ouvrez les outils de développement de votre navigateur (Console, onglet Réseau) pour des messages d'erreur JavaScript ou des erreurs de chargement de ressources.
    *   Assurez-vous que `FRONTEND_URL` dans le fichier `.env` du backend est correct pour les requêtes CORS.

---

Félicitations ! Vous devriez maintenant avoir une instance locale de GestCyber fonctionnelle. N'hésitez pas à consulter la documentation spécifique de chaque composant pour plus de détails.
