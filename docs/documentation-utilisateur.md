# Documentation Utilisateur - GestCyber

## ð Guide d'utilisation de la plateforme de gestion de crise cyber

### ð¯ Objectif de l'application

GestCyber est une plateforme de gestion de crise cyber conforme aux recommandations ANSSI. Elle permet de coordonner efficacement la reponse a un incident cyber selon les 4 phases officielles :

1. **Phase 1** : Alerter, mobiliser et endiguer
2. **Phase 2** : Maintenir la confiance et comprendre l'attaque
3. **Phase 3** : Relancer les activites et durcir les SI
4. **Phase 4** : Tirer les lecons et capitaliser

## ð  Page d'accueil - Dashboard

### Vue d'ensemble

Le dashboard principal offre une vue consolidee de la situation de crise :

#### Indicateurs de statut
- **ð¢ Normal** : Fonctionnement normal des systemes
- **ð¡ Alerte** : Surveillance renforcee, incident mineur detecte
- **ð  Crise** : Incident majeur en cours necessitant une cellule de crise
- **ð´ Critique** : Paralysie totale des activites, situation d'urgence maximale

#### Metriques temps reel
- **Temps ecoule depuis le debut de l'incident**
- **Phase actuelle de gestion de crise**
- **Nombre d'actions en cours / terminees**
- **Equipes mobilisees**
- **Systemes affectes**

#### Timeline des evenements
Affichage chronologique des evenements majeurs de la crise avec :
- Horodatage precis
- Type d'evenement (detection, action, communication)
- Responsable de l'action
- Statut (en cours, termine, bloque)

### Navigation
Le menu lateral permet d'acceder aux differents modules :
- ð **Dashboard** : Vue d'ensemble
- â **Actions** : Gestion des taches
- ð¬ **Communication** : Centre de communication
- ð **Investigation** : Analyse technique
- ð§ **Reconstruction** : Remise en service
- ð **Reporting** : Rapports et metriques

## â Module Actions

### Vue generale
Le module Actions centralise toutes les taches a realiser pendant la crise.

#### Creation d'une nouvelle action
1. Cliquer sur **"Nouvelle Action"**
2. Remplir le formulaire :
   - **Titre** : Description claire de l'action
   - **Phase ANSSI** : Selectionner la phase correspondante (1-4)
   - **Priorite** : P0 (critique), P1 (elevee), P2 (moyenne), P3 (faible)
   - **Equipe responsable** : Cellule strategique, Cyber-IT, Metiers, Communication, Juridique
   - **Echeance** : Date et heure limite
   - **Description detaillee** : Instructions precises
3. Cliquer sur **"Creer l'action"**

#### Gestion des actions existantes

##### Filtrage et tri
- **Par phase** : Afficher uniquement les actions d'une phase specifique
- **Par priorite** : Trier par ordre de criticite
- **Par equipe** : Filtrer par equipe responsable
- **Par statut** : A faire, En cours, Termine, Bloque

##### Statuts des actions
- **ð´ A faire** : Action creee, pas encore demarree
- **ð¡ En cours** : Action en cours de realisation
- **ð¢ Termine** : Action completee avec succes
- **â« Bloque** : Action bloquee, necessite intervention

##### Modification d'une action
1. Cliquer sur l'action dans la liste
2. Modifier les champs necessaires
3. Ajouter des commentaires de suivi
4. Mettre a jour le statut
5. Sauvegarder les modifications

#### Escalade automatique
- Les actions P0 non traitees dans les 30 minutes generent une alerte
- Les actions P1 non traitees dans les 2 heures generent une notification
- Notification automatique aux responsables hierarchiques

## ð¬ Module Communication

### Main courante partagee
Registre central de tous les evenements et communications :

#### Ajout d'une entree
1. Cliquer sur **"Nouvelle entree"**
2. Selectionner le type :
   - **Information** : Information generale
   - **Decision** : Decision prise par la cellule de crise
   - **Communication** : Message envoye a des parties prenantes
   - **Alerte** : Information urgente
3. Rediger le contenu
4. Attribuer l'importance (Normal, Important, Critique)
5. Valider l'entree

#### Recherche et filtrage
- Recherche par mots-cles
- Filtrage par date/heure
- Filtrage par type d'entree
- Filtrage par auteur

### Gestion des communications externes

#### Templates de messages
Messages pre-approuves pour differentes situations :
- **Notification d'incident** aux autorites (ANSSI, CNIL)
- **Communication client** sur l'indisponibilite de services
- **Communique de presse** en cas de mediatisation
- **Information partenaires** sur les impacts

#### Annuaire de crise
- **Contacts internes** : Equipes, responsables, experts
- **Contacts externes** : Autorites, prestataires, medias
- **Contacts d'urgence** : Numeros prioritaires 24/7
- **Canaux alternatifs** : Moyens de communication de secours

### Suivi des declarations obligatoires
- **ANSSI** : Declaration d'incident de securite
- **CNIL** : Notification de violation de donnees personnelles
- **Autorites judiciaires** : Depot de plainte
- **Assurances** : Declaration de sinistre

## ð Module Investigation

### Cartographie de la compromission

#### Vue systeme
- **Systemes compromis** : Liste des serveurs/applications affectes
- **Perimetre d'impact** : Etendue geographique et technique
- **Vecteur d'attaque** : Point d'entree identifie
- **Propagation** : Chemin de compromission

#### Timeline de l'attaque
1. **Point d'entree** : Date/heure et methode d'intrusion
2. **Mouvement lateral** : Progression dans le reseau
3. **Exfiltration** : Vol de donnees identifie
4. **Impact final** : Chiffrement/destruction de donnees

### Collecte des preuves

#### Logs et traces
- **Logs systeme** : Evenements Windows/Linux
- **Logs reseau** : Trafic suspect identifie
- **Logs applicatifs** : Comportements anormaux
- **Forensics** : Images disques et memoire

#### Indicateurs de compromission (IoC)
- **Adresses IP** malveillantes
- **Domaines** utilises par les attaquants
- **Hash de fichiers** malveillants
- **Signatures** d'attaque detectees

### Analyse et correlation
- **Famille de malware** identifiee
- **Techniques MITRE ATT&CK** utilisees
- **Attribution** (si possible)
- **Motivations** de l'attaque

## ð§ Module Reconstruction

### Plan de remise en service

#### Priorisation des systemes
- **P0 - Critique** : Systemes vitaux (sauvegardes, AD, DNS)
- **P1 - Elevee** : Applications metier critiques
- **P2 - Moyenne** : Applications secondaires
- **P3 - Faible** : Systemes non-critiques

#### Phases de reconstruction
1. **Preparation** : Validation des sauvegardes saines
2. **Isolement** : Creation d'un environnement securise
3. **Restauration** : Remise en service progressive
4. **Tests** : Validation fonctionnelle et securitaire
5. **Production** : Retour en service surveille

### Suivi de la progression

#### Metriques de recuperation
- **RTO (Recovery Time Objective)** : Temps de remise en service vise
- **RPO (Recovery Point Objective)** : Perte de donnees maximale toleree
- **Temps reel de recuperation** : Suivi en temps reel
- **Pourcentage d'avancement** : Par systeme et global

#### Validation de securite
- **Tests de penetration** : Validation de la securisation
- **Scan de vulnerabilites** : Absence de failles critiques
- **Configuration baseline** : Respect des standards de securite
- **Monitoring renforce** : Surveillance active post-remise en service

### Gestion des derogations
- **Derogations temporaires** : Mesures d'urgence documentees
- **Risques acceptes** : Validation par la direction
- **Plan de regularisation** : Actions de mise en conformite
- **Suivi des echeances** : Alertes sur les derogations expirees

## ð Module Reporting

### Rapports de situation

#### Rapport executif
- **Resume de situation** : Statut actuel en 1 page
- **Actions cles** : Principales decisions et realisations
- **Prochaines etapes** : Planning des 24 prochaines heures
- **Risques identifies** : Points de vigilance

#### Rapport technique
- **Analyse de compromission** : Details techniques
- **Actions de remediation** : Mesures techniques prises
- **Indicateurs de securite** : Metriques de protection
- **Recommandations** : Ameliorations suggerees

### Metriques de performance

#### Indicateurs de gestion de crise
- **Temps de detection** : Delai entre incident et detection
- **Temps de reaction** : Delai entre detection et premiere action
- **Temps de resolution** : Duree totale de l'incident
- **Efficacite des equipes** : Ratio actions terminees/creees

#### Indicateurs operationnels
- **Disponibilite des services** : Pourcentage de temps d'uptime
- **Performance des equipes** : Respect des echeances
- **Qualite de la communication** : Indicateurs de satisfaction
- **Cout de la crise** : Impact financier global

### RETEX (Retour d'experience)

#### Collecte des retours
- **Questionnaires equipes** : Feedback des intervenants
- **Analyse des dysfonctionnements** : Points d'amelioration
- **Bonnes pratiques** : Actions particulierement efficaces
- **Recommandations** : Ameliorations pour l'avenir

#### Plan d'amelioration
- **Actions correctives** : Mesures immediates
- **Actions preventives** : Prevention d'incidents similaires
- **Formation** : Besoins de renforcement des competences
- **Evolution des procedures** : Mises a jour necessaires

## ð¨ Gestion d'un nouvel incident

### Procedure de declenchement

#### 1. Detection d'incident
- Cliquer sur **"ð¨ Nouveau Incident"** dans la barre laterale
- Remplir le formulaire de declaration :
  - **Date/heure de detection**
  - **Type d'incident** (Ransomware, Vol de donnees, DDoS, etc.)
  - **Systemes impactes**
  - **Niveau de criticite** initial
  - **Premieres observations**

#### 2. Activation automatique
L'application genere automatiquement :
- **Actions de phase 1** : Mobilisation, isolation, alerte
- **Timeline d'incident** : Horodatage des evenements
- **Cellule de crise** : Notification des equipes
- **Communication** : Templates de messages

#### 3. Escalade
Selon la criticite, notification automatique :
- **Direction generale** pour incidents critiques
- **Equipes techniques** pour incidents majeurs
- **Parties prenantes** selon les procedures

### Workflow type d'incident

#### Phase 1 : Alerter, mobiliser et endiguer (0-4h)
1. **Confirmer l'incident** et evaluer la criticite
2. **Activer la cellule de crise** strategique
3. **Isoler les systemes** compromis
4. **Alerter les autorites** (ANSSI, CNIL si applicable)
5. **Mobiliser les equipes** techniques et metiers

#### Phase 2 : Maintenir la confiance et comprendre l'attaque (4h-48h)
1. **Communiquer** avec les parties prenantes
2. **Investiguer** pour comprendre l'attaque
3. **Identifier le perimetre** de compromission
4. **Mettre en place** le mode degrade
5. **Analyser les impacts** metiers

#### Phase 3 : Relancer les activites et durcir les SI (2-30 jours)
1. **Durcir** les systemes selon les vulnerabilites identifiees
2. **Restaurer** les donnees a partir de sauvegardes saines
3. **Tester** les applications avant remise en production
4. **Surveiller** les systemes restaures
5. **Reprendre** progressivement les activites

#### Phase 4 : Tirer les lecons et capitaliser (apres resolution)
1. **Organiser** le retour d'experience (RETEX)
2. **Analyser** les dysfonctionnements et bonnes pratiques
3. **Definir** un plan d'amelioration
4. **Former** les equipes sur les lecons apprises
5. **Mettre a jour** les procedures et outils

## âï¸ Configuration et personnalisation

### Parametres utilisateur
- **Profil** : Role dans l'organisation (Strategique, Technique, Metier)
- **Notifications** : Types d'alertes a recevoir
- **Interface** : Preferences d'affichage (mode sombre, langue)
- **Raccourcis** : Actions rapides personnalisees

### Parametres organisation
- **Contacts** : Annuaire de crise specifique
- **Procedures** : Adaptation aux processus internes
- **Seuils d'alerte** : Criteres de declenchement personnalises
- **Templates** : Messages adaptes au contexte

## ð Support et aide

### Aide contextuelle
- **Bouton "?"** : Aide sur chaque ecran
- **Tooltips** : Explications des champs et fonctions
- **Guides integres** : Procedures pas-a-pas
- **FAQ** : Questions frequentes

### En cas de probleme technique
1. **Actualiser** la page (F5)
2. **Vider le cache** du navigateur
3. **Verifier la connexion** internet
4. **Contacter** l'administrateur systeme

### Formation recommandee
- **Formation initiale** : 2 heures sur l'utilisation de base
- **Formation avancee** : 4 heures sur toutes les fonctionnalites
- **Exercices pratiques** : Simulations d'incidents
- **Mise a jour** : Formation continue sur les evolutions

## ð Checklist utilisateur

### Avant un incident
- [ ] Verifier l'acces a l'application
- [ ] Valider les contacts dans l'annuaire
- [ ] Tester les notifications
- [ ] Reviser les procedures d'urgence

### Pendant un incident
- [ ] Documenter toutes les actions dans la main courante
- [ ] Mettre a jour regulierement le statut des actions
- [ ] Communiquer les informations importantes
- [ ] Respecter les priorites et echeances

### Apres un incident
- [ ] Completer le RETEX
- [ ] Archiver la documentation
- [ ] Mettre a jour les procedures
- [ ] Planifier les actions d'amelioration

---

**Important** : Cette application contient des informations sensibles de securite. Respectez les consignes de confidentialite et de securite de votre organisation.