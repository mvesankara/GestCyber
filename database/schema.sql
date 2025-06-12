# Schéma de Base de Données GestCyber

Ce fichier contient le schéma complet de la base de données PostgreSQL pour l'application GestCyber, conforme aux recommandations ANSSI pour la gestion de crise cyber.

## Vue d'ensemble

Le schéma est organisé autour des 4 phases de gestion de crise cyber selon l'ANSSI :
1. **Phase 1** : Alerter, mobiliser et endiguer
2. **Phase 2** : Maintenir la confiance et comprendre l'attaque
3. **Phase 3** : Relancer les activités et durcir les SI
4. **Phase 4** : Tirer les leçons et capitaliser

## Tables principales

### 1. Gestion des incidents et crises
```sql
CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    type_incident VARCHAR(50) CHECK (type_incident IN ('ransomware', 'fuite_donnees', 'ddos', 'compromission', 'autre')),
    niveau_critique VARCHAR(20) CHECK (niveau_critique IN ('normal', 'alerte', 'crise', 'critique')),
    phase_actuelle VARCHAR(50) CHECK (phase_actuelle IN ('phase1_alerter', 'phase2_comprendre', 'phase3_relancer', 'phase4_capitaliser')),
    perimetre_impact TEXT,
    date_debut TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_fin TIMESTAMP NULL,
    statut VARCHAR(30) CHECK (statut IN ('ouvert', 'en_cours', 'resolu', 'ferme')),
    dirigeant_crise_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Gestion des utilisateurs et équipes
```sql
CREATE TABLE utilisateurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(20),
    role VARCHAR(50) CHECK (role IN ('admin', 'dirigeant_crise', 'responsable_cyber', 'expert_it', 'communication', 'juridique', 'rh', 'consultant')),
    equipe VARCHAR(50) CHECK (equipe IN ('strategique', 'cyber_it', 'metiers', 'communication', 'juridique', 'rh', 'logistique')),
    disponible BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Gestion des actions et tâches
```sql
CREATE TABLE actions (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER REFERENCES incidents(id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    phase VARCHAR(50) CHECK (phase IN ('phase1_alerter', 'phase2_comprendre', 'phase3_relancer', 'phase4_capitaliser')),
    priorite VARCHAR(5) CHECK (priorite IN ('P0', 'P1', 'P2', 'P3')),
    type_action VARCHAR(50) CHECK (type_action IN ('investigation', 'endurcissement', 'communication', 'remediaion', 'reconstruction', 'surveillance')),
    assignee_id INTEGER REFERENCES utilisateurs(id),
    equipe_responsable VARCHAR(50),
    statut VARCHAR(30) CHECK (statut IN ('todo', 'en_cours', 'bloque', 'termine', 'annule')),
    date_echeance TIMESTAMP,
    date_debut_execution TIMESTAMP,
    date_fin_execution TIMESTAMP,
    temps_estime INTEGER, -- en minutes
    temps_reel INTEGER, -- en minutes
    commentaires TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Main courante et communications
```sql
CREATE TABLE main_courante (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER REFERENCES incidents(id) ON DELETE CASCADE,
    auteur_id INTEGER REFERENCES utilisateurs(id),
    type_entree VARCHAR(50) CHECK (type_entree IN ('info_generale', 'decision', 'alerte', 'communication', 'investigation', 'technique')),
    contenu TEXT NOT NULL,
    destinataires VARCHAR(255), -- Équipes/personnes concernées
    criticite VARCHAR(20) CHECK (criticite IN ('info', 'important', 'critique', 'urgent')),
    timestamp_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lu_par TEXT -- JSON des IDs qui ont lu
);
```

### 5. Investigation numérique
```sql
CREATE TABLE investigations (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER REFERENCES incidents(id) ON DELETE CASCADE,
    responsable_id INTEGER REFERENCES utilisateurs(id),
    vecteur_attaque VARCHAR(100),
    perimetre_compromission TEXT,
    indicateurs_compromission TEXT, -- JSON des IoCs
    malware_detecte VARCHAR(255),
    techniques_attaque TEXT,
    systemes_impactes TEXT, -- JSON des systèmes
    preuves_collectees TEXT, -- JSON des preuves
    niveau_confiance VARCHAR(20) CHECK (niveau_confiance IN ('faible', 'moyen', 'eleve', 'confirme')),
    statut_investigation VARCHAR(30) CHECK (statut_investigation IN ('en_cours', 'suspendue', 'terminee')),
    rapport_final TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Systèmes et actifs
```sql
CREATE TABLE systemes (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    type_systeme VARCHAR(50) CHECK (type_systeme IN ('serveur', 'application', 'base_donnees', 'reseau', 'poste_travail', 'mobile')),
    criticite VARCHAR(20) CHECK (criticite IN ('faible', 'moyenne', 'elevee', 'critique')),
    proprietaire_id INTEGER REFERENCES utilisateurs(id),
    adresse_ip VARCHAR(45),
    os VARCHAR(100),
    version VARCHAR(50),
    statut VARCHAR(30) CHECK (statut IN ('operationnel', 'compromis', 'isole', 'reconstruit', 'hors_service')),
    derniere_sauvegarde TIMESTAMP,
    metiers_dependants TEXT, -- JSON des métiers impactés
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7. Plan de reconstruction
```sql
CREATE TABLE reconstructions (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER REFERENCES incidents(id) ON DELETE CASCADE,
    systeme_id INTEGER REFERENCES systemes(id),
    priorite VARCHAR(5) CHECK (priorite IN ('P0', 'P1', 'P2', 'P3')),
    statut VARCHAR(30) CHECK (statut IN ('planifie', 'en_cours', 'teste', 'valide', 'deploye')),
    responsable_id INTEGER REFERENCES utilisateurs(id),
    date_planifiee TIMESTAMP,
    date_debut TIMESTAMP,
    date_fin TIMESTAMP,
    duree_estimee INTEGER, -- en heures
    duree_reelle INTEGER, -- en heures
    methode_reconstruction VARCHAR(100),
    sauvegarde_utilisee VARCHAR(255),
    tests_validation TEXT,
    commentaires TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 8. Communications externes
```sql
CREATE TABLE communications (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER REFERENCES incidents(id) ON DELETE CASCADE,
    auteur_id INTEGER REFERENCES utilisateurs(id),
    type_communication VARCHAR(50) CHECK (type_communication IN ('interne', 'presse', 'client', 'partenaire', 'autorite', 'assurance')),
    destinataire VARCHAR(255),
    canal VARCHAR(50) CHECK (canal IN ('email', 'telephone', 'courrier', 'site_web', 'communique', 'reunion')),
    sujet VARCHAR(255),
    contenu TEXT,
    statut VARCHAR(30) CHECK (statut IN ('brouillon', 'envoye', 'accuse_reception', 'reponse_recue')),
    date_envoi TIMESTAMP,
    date_reponse TIMESTAMP,
    pieces_jointes TEXT, -- JSON des fichiers
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 9. Métriques et KPIs
```sql
CREATE TABLE metriques (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER REFERENCES incidents(id) ON DELETE CASCADE,
    type_metrique VARCHAR(50) CHECK (type_metrique IN ('temps_activation', 'temps_endiguement', 'temps_investigation', 'temps_reconstruction', 'disponibilite_service')),
    valeur DECIMAL(10,2),
    unite VARCHAR(20), -- minutes, heures, pourcentage
    timestamp_mesure TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);
```

### 10. Retours d'expérience (RETEX)
```sql
CREATE TABLE retex (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER REFERENCES incidents(id) ON DELETE CASCADE,
    responsable_id INTEGER REFERENCES utilisateurs(id),
    type_retex VARCHAR(30) CHECK (type_retex IN ('a_chaud', 'a_froid', 'final')),
    points_forts TEXT,
    points_amelioration TEXT,
    recommandations TEXT,
    plan_action TEXT, -- JSON des actions d'amélioration
    participants TEXT, -- JSON des participants
    date_realisation TIMESTAMP,
    statut VARCHAR(30) CHECK (statut IN ('planifie', 'en_cours', 'termine', 'valide')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Index pour optimiser les performances
```sql
CREATE INDEX idx_incidents_statut ON incidents(statut);
CREATE INDEX idx_incidents_phase ON incidents(phase_actuelle);
CREATE INDEX idx_actions_incident ON actions(incident_id);
CREATE INDEX idx_actions_assignee ON actions(assignee_id);
CREATE INDEX idx_actions_statut ON actions(statut);
CREATE INDEX idx_main_courante_incident ON main_courante(incident_id);
CREATE INDEX idx_main_courante_timestamp ON main_courante(timestamp_creation);
CREATE INDEX idx_systemes_statut ON systemes(statut);
CREATE INDEX idx_investigations_incident ON investigations(incident_id);
```

## Contraintes et règles métier

### Contraintes de cohérence
- Un incident ne peut pas passer directement de la phase 1 à la phase 3
- Les actions P0 doivent obligatoirement avoir une date d'échéance
- Un système compromis ne peut pas être en statut "opérationnel"

### Triggers automatiques
- Mise à jour automatique du champ `updated_at` lors des modifications
- Calcul automatique des métriques lors de changements d'état
- Notification automatique lors de création d'incidents critiques

## Scripts d'initialisation

### Données de référence
```sql
-- Insertion des utilisateurs par défaut
INSERT INTO utilisateurs (nom, prenom, email, role, equipe) VALUES
('Admin', 'Système', 'admin@gestcyber.local', 'admin', 'strategique'),
('Crisis', 'Manager', 'crisis@gestcyber.local', 'dirigeant_crise', 'strategique'),
('Cyber', 'Expert', 'cyber@gestcyber.local', 'responsable_cyber', 'cyber_it');

-- Configuration des systèmes critiques de base
INSERT INTO systemes (nom, type_systeme, criticite, statut) VALUES
('Active Directory', 'serveur', 'critique', 'operationnel'),
('Serveur Mail', 'serveur', 'elevee', 'operationnel'),
('Base de données principale', 'base_donnees', 'critique', 'operationnel');
```