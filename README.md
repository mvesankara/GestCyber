# GestCyber - Système de Gestion de Crise Cyber

## 🎯 Description

GestCyber est une plateforme complète de gestion de crise cyber conforme aux recommandations de l'ANSSI. Elle permet aux organisations de coordonner efficacement leur réponse aux incidents cyber selon les 4 phases officielles.

## 🏗️ Architecture

- **Frontend** : Application web moderne (HTML5, CSS3, JavaScript ES6+)
- **Backend** : API REST sécurisée (Node.js, Express.js, PostgreSQL)
- **Base de données** : PostgreSQL avec schéma optimisé pour la gestion de crise
- **Déploiement** : Docker & Docker Compose pour une installation simplifiée

## 🚀 Installation Rapide

1. **Prérequis** : Docker et Docker Compose installés
2. **Configuration** : `cp .env.example .env` et adapter les variables
3. **Démarrage** : `docker-compose up -d`
4. **Accès** : http://localhost (interface web)

## 📚 Documentation

- [Guide de déploiement](docs/README-deploiement.md)
- [Documentation utilisateur](docs/documentation-utilisateur.md)
- [Guide de démarrage rapide](docs/quick-start-guide.md)
- [Documentation technique backend](docs/gestcyber-backend-docs.md)

## 🔒 Sécurité

- Authentification JWT
- Chiffrement des communications
- Audit trail complet
- Conformité ANSSI

## 📞 Support

Pour toute question ou assistance, consultez la documentation ou contactez l'équipe de développement.

---

**Version** : 1.0.0  
**Licence** : MIT  
**Conformité** : ANSSI