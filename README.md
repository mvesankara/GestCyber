# GestCyber - Systeme de Gestion de Crise Cyber

## 🎯 Description

GestCyber est une plateforme complete de gestion de crise cyber conforme aux recommandations de l'ANSSI. Elle permet aux organisations de coordonner efficacement leur reponse aux incidents cyber selon les 4 phases officielles.

## 🏗️ Architecture

- **Frontend** : Application web moderne (HTML5, CSS3, JavaScript ES6+)
- **Backend** : API REST securisee (Node.js, Express.js, PostgreSQL)
- **Base de donnees** : PostgreSQL avec schema optimise pour la gestion de crise
- **Deploiement** : Docker & Docker Compose pour une installation simplifiee

## 🚀 Installation Rapide

1. **Prerequis** : Docker et Docker Compose installes
2. **Configuration** : `cp .env.example .env` et adapter les variables
3. **Demarrage** : `docker-compose up -d`
4. **Acces** : http://localhost (interface web)

## 📚 Documentation

- [Guide de deploiement](docs/README-deploiement.md)
- [Documentation utilisateur](docs/documentation-utilisateur.md)
- [Guide de demarrage rapide](docs/quick-start-guide.md)
- [Documentation technique backend](docs/gestcyber-backend-docs.md)

## 🔒 Securite

- Authentification JWT
- Chiffrement des communications
- Audit trail complet
- Conformite ANSSI

## 📞 Support

Pour toute question ou assistance, consultez la documentation ou contactez l'equipe de developpement.

---

**Version** : 1.0.0  
**Licence** : MIT  
**Conformite** : ANSSI